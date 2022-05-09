import React, {useCallback, useMemo, useRef, useState} from "react";
import {route} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import {Box, Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import Coin from "models/Coin";
import IconBuilder from "components/IconBuilder";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import CommonTable from "components/TableCells/CommonTable";
import UserTable from "components/TableCells/UserTable";
import WalletTable from "components/TableCells/WalletTable";
import RecordDelete from "./components/RecordDelete";

const routeName = "admin.wallet.transfer-record.paginate";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    description: {defaultMessage: "Description"},
    date: {defaultMessage: "Date"},
    hash: {defaultMessage: "Hash"},
    transactionHash: {defaultMessage: "Transaction Hash"},
    coin: {defaultMessage: "Coin"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    value: {defaultMessage: "Value"}
});

const Transactions = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const [url, setUrl] = useState(() => route(routeName));
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const searchFunc = useCallback((searchUser) => {
        setUrl(route(routeName, {searchUser}));
        tableRef.current?.resetPage();
    }, []);

    const clearFunc = useCallback(() => {
        setUrl(route(routeName));
        tableRef.current?.resetPage();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const columns = useMemo(
        () => [
            {
                field: "wallet_account",
                width: 200,
                renderHeader: () => <span />,
                renderCell: ({value}) => UserTable.render(value?.user)
            },
            {
                field: "type",
                width: 30,
                renderHeader: () => <span />,
                align: "center",
                renderCell: WalletTable.status
            },
            {
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: WalletTable.value
            },
            {
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({row}) => {
                    const coin = Coin.use(row.coin);
                    return (
                        <Box
                            component={IconBuilder}
                            sx={{fontSize: 30}}
                            icon={coin.svgIcon()}
                        />
                    );
                }
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description),
                filterable: true,
                renderCell: WalletTable.description
            },
            {
                field: "balance",
                headerName: intl.formatMessage(messages.balance),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ({row}) => {
                    return (
                        <Tooltip title={row.balance}>
                            <Stack alignItems="flex-end" sx={{width: "100%"}}>
                                <Typography
                                    sx={{whiteSpace: "nowrap"}}
                                    variant="body2">
                                    {row.balance}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "nowrap"
                                    }}
                                    variant="caption">
                                    {row.formatted_balance_price}
                                </Typography>
                            </Stack>
                        </Tooltip>
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
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: record}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <RecordDelete
                                reloadTable={reloadTable}
                                record={record}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    return (
        <Card>
            <ActionBar onSearchChange={setSearch} search={search} />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Transactions;
