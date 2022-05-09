import {FormattedMessage} from "react-intl";
import {Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
import Coin from "models/Coin";
import IconBuilder from "../IconBuilder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {getSymbolIcon} from "utils/helpers";

const ExchangeTable = {
    payment: ({row: trade}) => {
        const negative = trade.type === "buy";
        let statusMessage;

        switch (trade.status) {
            case "canceled":
                statusMessage = <FormattedMessage defaultMessage="Canceled" />;
                break;
            case "pending":
                statusMessage = <FormattedMessage defaultMessage="Pending" />;
                break;
            case "completed":
                statusMessage = <FormattedMessage defaultMessage="Completed" />;
                break;
        }

        return (
            <Stack alignItems="flex-end" sx={{width: "100%"}}>
                <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                    {negative && "-"}
                    {trade.formatted_payment_value}
                </Typography>
                <Typography
                    sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                    variant="caption">
                    {statusMessage}
                </Typography>
            </Stack>
        );
    },
    wallet: ({row: trade}) => {
        const negative = trade.type === "sell";
        return (
            <Tooltip title={trade.wallet_value}>
                <Stack alignItems="flex-end" sx={{width: "100%"}}>
                    <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                        {negative && "-"}
                        {trade.wallet_value}
                    </Typography>
                    <Typography
                        sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                        variant="caption">
                        {negative && "-"}
                        {trade.formatted_wallet_value_price}
                    </Typography>
                </Stack>
            </Tooltip>
        );
    },
    status: ({row: trade}) => {
        const coin = Coin.use(trade.coin);

        const walletIcon = (
            <IconBuilder sx={{fontSize: "25px"}} icon={coin.svgIcon()} />
        );

        const arrowIcon = (
            <ArrowForwardIcon
                color={trade.status === "completed" ? "success" : "disabled"}
                fontSize="small"
            />
        );

        const paymentIcon = getSymbolIcon(trade.payment_symbol);

        switch (trade.type) {
            case "buy":
                return (
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}>
                        {paymentIcon}
                        {arrowIcon}
                        {walletIcon}
                    </Stack>
                );

            case "sell":
                return (
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}>
                        {walletIcon}
                        {arrowIcon}
                        {paymentIcon}
                    </Stack>
                );
        }
    }
};

export default ExchangeTable;
