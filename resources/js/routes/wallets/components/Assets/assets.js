import React, {useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import IconBuilder from "components/IconBuilder";
import WalletAccount from "models/WalletAccount";
import {useWalletAccounts} from "hooks/account";
import AddAccount from "../AddAccount";
import Balance from "./components/Balance";
import {
    Card,
    CardContent,
    CardHeader,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import {experimentalStyled as styled} from "@mui/material/styles";
import Table from "components/Table";
import LinearProgressWithLabel from "components/LinearProgressWithLabel";

const messages = defineMessages({
    title: {defaultMessage: "Your Assets"},
    coin: {defaultMessage: "Coin"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    quota: {defaultMessage: "Quota"}
});

const Assets = () => {
    const {data, loading} = useWalletAccounts();
    const intl = useIntl();

    const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const columns = useMemo(() => {
        return [
            {
                headerName: intl.formatMessage(messages.coin),
                field: "coin",
                minWidth: 100,
                flex: 1,
                renderCell: (params) => {
                    const account = WalletAccount.use(params.row);
                    const icon = account.wallet.coin.svgIcon();
                    return (
                        <Tooltip title={account.wallet.coin.name}>
                            <CoinStyle>
                                <IconBuilder
                                    sx={{fontSize: "25px"}}
                                    icon={icon}
                                />

                                <Typography sx={{ml: 1}} noWrap>
                                    {account.wallet.coin.name}
                                </Typography>
                            </CoinStyle>
                        </Tooltip>
                    );
                }
            },
            {
                headerName: intl.formatMessage(messages.available),
                field: "available",
                minWidth: 80,
                flex: 0.8,
                sortable: true,
                type: "number",
                renderCell: (params) => {
                    const account = WalletAccount.use(params.row);
                    return (
                        <BalanceStyle>
                            <Typography variant="subtitle2">
                                {account.available}
                            </Typography>
                            <Typography
                                sx={{color: "text.secondary"}}
                                variant="caption">
                                {account.formatted_available_price}
                            </Typography>
                        </BalanceStyle>
                    );
                }
            },
            {
                headerName: intl.formatMessage(messages.balance),
                field: "balance",
                minWidth: 80,
                flex: 0.8,
                sortable: true,
                type: "number",
                renderCell: (params) => {
                    const account = WalletAccount.use(params.row);
                    return (
                        <BalanceStyle>
                            <Typography variant="subtitle2">
                                {account.balance}
                            </Typography>
                            <Typography
                                sx={{color: "text.secondary"}}
                                variant="caption">
                                {account.formatted_balance_price}
                            </Typography>
                        </BalanceStyle>
                    );
                }
            },
            {
                field: "quota",
                headerName: intl.formatMessage(messages.quota),
                minWidth: 80,
                flex: 0.8,
                hide: smDown,
                valueGetter: (params) => {
                    return params.row.available_price_quota;
                },
                sortable: true,
                renderCell: (params) => {
                    const record = params.row;
                    return (
                        <LinearProgressWithLabel
                            value={record.available_price_quota}
                        />
                    );
                }
            }
        ];
    }, [intl, smDown]);

    return (
        <Card>
            <CardHeader
                title={intl.formatMessage(messages.title)}
                action={<AddAccount />}
            />

            <CardContent>
                <TotalBalanceStyle sx={{my: 3, textAlign: "center"}}>
                    <Typography variant="h3">
                        <Balance />
                    </Typography>

                    <Typography variant="subtitle2">
                        <FormattedMessage defaultMessage="Total Balance" />
                    </Typography>
                </TotalBalanceStyle>
            </CardContent>

            <Table
                columns={columns}
                rows={data}
                rowHeight={60}
                loading={loading}
            />
        </Card>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    flexBasis: 0
});

const TotalBalanceStyle = styled("div")({
    display: "flex",
    flexDirection: "column"
});

const BalanceStyle = styled("div")({
    display: "flex",
    flexDirection: "column"
});

export default Assets;
