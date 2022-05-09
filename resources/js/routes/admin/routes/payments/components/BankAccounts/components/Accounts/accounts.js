import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {route} from "services/Http";
import {Card, Stack, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import AccountDelete from "./components/AccountDelete";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import CurrencyCell from "components/CurrencyCell";

const messages = defineMessages({
    bank: {defaultMessage: "Bank"},
    beneficiary: {defaultMessage: "Beneficiary"},
    currency: {defaultMessage: "Currency"}
});

const Accounts = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const searchFunc = useCallback((number) => {
        tableRef.current?.applySearch({number});
    }, []);

    const clearFunc = useCallback(() => {
        tableRef.current?.clearSearch();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const columns = useMemo(
        () => [
            {
                field: "bank_name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.bank),
                renderCell: ({row}) => {
                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography variant="body2" noWrap>
                                {row.bank_name}
                            </Typography>

                            {row.note && (
                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    {row.note}
                                </Typography>
                            )}
                        </Stack>
                    );
                }
            },
            {
                field: "beneficiary",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.beneficiary),
                renderCell: ({row}) => {
                    return (
                        <Stack alignItems="flex-start" sx={{minWidth: 0}}>
                            <Typography variant="body2" noWrap>
                                {row.beneficiary}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {row.number}
                            </Typography>
                        </Stack>
                    );
                }
            },
            {
                field: "currency",
                minWidth: 150,
                flex: 0.5,
                headerName: intl.formatMessage(messages.currency),
                renderCell: ({row}) => (
                    <CurrencyCell
                        currency={row.currency}
                        country={row.country}
                    />
                )
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: account}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AccountDelete
                                reloadTable={reloadTable}
                                account={account}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.bank.account.paginate");

    return (
        <Card>
            <ActionBar
                reloadTable={reloadTable}
                onSearchChange={setSearch}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Accounts;
