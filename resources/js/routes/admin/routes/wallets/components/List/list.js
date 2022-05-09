import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty} from "lodash";
import {route} from "services/Http";
import {Box, Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import WalletDelete from "./components/WalletDelete";
import WalletMenu from "./components/WalletMenu";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import Coin from "models/Coin";
import IconBuilder from "components/IconBuilder";
import {useSearchDebounce} from "hooks/useSearchDebounce";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    accounts: {defaultMessage: "Accounts"},
    confirmations: {defaultMessage: "Confirmations"},
    balance: {defaultMessage: "Balance"},
    onTrade: {defaultMessage: "On Trade"}
});

const routeName = "admin.wallet.paginate";

const List = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const [url, setUrl] = useState(() => route(routeName));
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const searchFunc = useCallback((searchCoin) => {
        setUrl(route(routeName, {searchCoin}));
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
                field: "id",
                minWidth: 150,
                flex: 1,
                renderHeader: () => <span />,
                renderCell: ({row}) => {
                    const coin = Coin.use(row.coin);
                    return (
                        <Stack direction="row" sx={{minWidth: 0}} spacing={2}>
                            <Box
                                component={IconBuilder}
                                sx={{fontSize: 30}}
                                icon={coin.svgIcon()}
                            />

                            <Stack sx={{minWidth: 0}}>
                                <Typography variant="body2" noWrap>
                                    {coin.name}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    {coin.formatted_price}
                                </Typography>
                            </Stack>
                        </Stack>
                    );
                }
            },
            {
                field: "accounts_count",
                width: 100,
                headerName: intl.formatMessage(messages.accounts)
            },
            {
                field: "min_conf",
                width: 100,
                headerName: intl.formatMessage(messages.confirmations)
            },
            {
                field: "balance",
                minWidth: 150,
                flex: 0.5,
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
                                    {statistic.formatted_balance_price}
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
                flex: 0.5,
                headerName: intl.formatMessage(messages.onTrade),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return !isEmpty(statistic) ? (
                        <Tooltip title={statistic.balance}>
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
                                    {statistic.formatted_balance_on_trade_price}
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
                renderCell: ({row: wallet}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WalletDelete
                                reloadTable={reloadTable}
                                wallet={wallet}
                            />
                            <WalletMenu
                                reloadTable={reloadTable}
                                wallet={wallet}
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

export default List;
