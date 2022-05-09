import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty, toUpper} from "lodash";
import {route} from "services/Http";
import {Box, Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import CurrencyDelete from "./components/CurrencyDelete";
import CurrencyMenu from "./components/CurrencyMenu";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {Icon} from "@iconify/react";
import starSFill from "@iconify-icons/ri/star-s-fill";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {useExchangeBaseCurrency} from "hooks/settings";

const messages = defineMessages({
    code: {defaultMessage: "Code"},
    name: {defaultMessage: "Name"},
    accounts: {defaultMessage: "Accounts"},
    balance: {defaultMessage: "Balance"},
    onTrade: {defaultMessage: "On Trade"},
    exchangeRate: {defaultMessage: "Exchange Rate"},
    rate: {defaultMessage: "Rate"}
});

const Currencies = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const baseCurrency = useExchangeBaseCurrency();

    const searchFunc = useCallback((name) => {
        tableRef.current?.applySearch({name});
    }, []);

    const clearFunc = useCallback(() => {
        tableRef.current?.clearSearch();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const columns = useMemo(
        () => [
            {
                field: "code",
                width: 70,
                renderHeader: () => <span />,
                renderCell: ({row}) => (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2">
                            {toUpper(row.code)}
                        </Typography>

                        {row.default && (
                            <Box component="span" sx={{display: "flex"}}>
                                <Icon icon={starSFill} />
                            </Box>
                        )}
                    </Stack>
                )
            },
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "payment_accounts_count",
                width: 100,
                headerName: intl.formatMessage(messages.accounts)
            },
            {
                field: "exchange_rate",
                minWidth: 100,
                flex: 1,
                renderHeader: () => {
                    const text = intl.formatMessage(messages.rate);
                    return `${text}/${baseCurrency}`;
                },
                renderCell: ({value, row}) => (
                    <Stack>
                        <Typography variant="body2">{value}</Typography>
                        <Typography
                            sx={{color: "text.secondary"}}
                            variant="caption">
                            {toUpper(row.exchange_type)}
                        </Typography>
                    </Stack>
                )
            },
            {
                field: "balance",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.balance),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return !isEmpty(statistic) ? (
                        <Tooltip title={statistic.balance}>
                            <Stack>
                                <Typography
                                    sx={{whiteSpace: "nowrap"}}
                                    variant="body2">
                                    {statistic.balance}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "nowrap"
                                    }}
                                    variant="caption">
                                    {statistic.formatted_balance}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    ) : (
                        <Typography
                            sx={{whiteSpace: "nowrap"}}
                            variant="caption">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    );
                }
            },
            {
                field: "balance_on_trade",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.onTrade),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return !isEmpty(statistic) ? (
                        <Tooltip title={statistic.balance_on_trade}>
                            <Stack>
                                <Typography
                                    sx={{whiteSpace: "nowrap"}}
                                    variant="body2">
                                    {statistic.balance_on_trade}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "nowrap"
                                    }}
                                    variant="caption">
                                    {statistic.formatted_balance_on_trade}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    ) : (
                        <Typography
                            sx={{whiteSpace: "nowrap"}}
                            variant="caption">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    );
                }
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: currency}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CurrencyDelete
                                reloadTable={reloadTable}
                                currency={currency}
                            />
                            <CurrencyMenu
                                reloadTable={reloadTable}
                                currency={currency}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, baseCurrency, reloadTable]
    );

    const url = route("admin.payment.supported-currency.paginate");

    return (
        <Card>
            <ActionBar
                reloadTable={reloadTable}
                onSearchChange={setSearch}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable
                    ref={tableRef}
                    getRowId={(row) => row.code}
                    columns={columns}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default Currencies;
