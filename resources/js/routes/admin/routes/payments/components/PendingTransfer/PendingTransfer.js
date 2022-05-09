import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {route} from "services/Http";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {Card, Stack, Typography} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import TransferActionBar from "./components/TransferActionBar";
import TransferView from "./components/TransferView";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {useCountries} from "hooks/global";
import CommonTable from "components/TableCells/CommonTable";
import UserTable from "components/TableCells/UserTable";

const messages = defineMessages({
    user: {defaultMessage: "User"},
    note: {defaultMessage: "Note"},
    value: {defaultMessage: "Value"},
    date: {defaultMessage: "Date"}
});

const receiveRoute =
    "admin.payment.transaction.pending-transfer-receive-paginate";
const sendRoute = "admin.payment.transaction.pending-transfer-send-paginate";

const PendingTransfer = ({type}) => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const intl = useIntl();

    const routeName = useMemo(() => {
        switch (type) {
            case "receive":
                return receiveRoute;
            case "send":
                return sendRoute;
        }
    }, [type]);

    const [url, setUrl] = useState(() => route(routeName));

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const searchFunc = useCallback(
        (searchUser) => {
            setUrl(route(routeName, {searchUser}));
            tableRef.current?.resetPage();
        },
        [routeName]
    );

    const clearFunc = useCallback(() => {
        setUrl(route(routeName));
        tableRef.current?.resetPage();
    }, [routeName]);

    useSearchDebounce(search, searchFunc, clearFunc);

    const {countries} = useCountries();

    const columns = useMemo(
        () => [
            {
                field: "account",
                width: 200,
                headerName: intl.formatMessage(messages.user),
                renderCell: ({value: account}) => UserTable.render(account.user)
            },
            {
                field: "type",
                width: 30,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => {
                    switch (value) {
                        case "receive":
                            return (
                                <AccountBalanceWalletIcon
                                    color="primary"
                                    fontSize="large"
                                />
                            );
                        case "send":
                            return (
                                <AccountBalanceWalletIcon
                                    color="error"
                                    fontSize="large"
                                />
                            );
                    }
                }
            },
            {
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ({row}) => {
                    const negative = row.type === "send";

                    const countrySearch = countries.find((c) => {
                        return c.code === row.transfer_country;
                    });

                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography
                                sx={{whiteSpace: "nowrap"}}
                                variant="body2">
                                {negative && "-"}
                                {row.formatted_value}
                            </Typography>

                            {countrySearch && (
                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    {countrySearch.name}
                                </Typography>
                            )}
                        </Stack>
                    );
                }
            },
            {
                field: "note",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.note),
                filterable: true,
                renderCell: ({row}) => {
                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography variant="body2" noWrap>
                                <FormattedMessage
                                    defaultMessage="Ref: {reference}"
                                    values={{reference: row.account.reference}}
                                />
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {row.transfer_note}
                            </Typography>
                        </Stack>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                renderCell: CommonTable.date
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                headerAlign: "right",
                renderCell: ({row: transaction}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TransferView
                                transaction={transaction}
                                reloadTable={reloadTable}
                                type={type}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable, countries, type]
    );

    return (
        <Card>
            <TransferActionBar
                type={type}
                onSearchChange={setSearch}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default PendingTransfer;
