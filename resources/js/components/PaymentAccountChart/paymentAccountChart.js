import React, {useMemo} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import PercentChart from "../PercentChart";
import {usePaymentAccount} from "hooks/account";
import {CardContent, CardHeader, Stack} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import ChartLegend from "../ChartLegend/chartLegend";
import {useTheme} from "@mui/material/styles";
import {calculatePercent} from "utils/helpers";

const messages = defineMessages({
    available: {defaultMessage: "Available"},
    onTrade: {defaultMessage: "On Trade"}
});

const PaymentAccountChart = () => {
    const theme = useTheme();
    const {account} = usePaymentAccount();
    const intl = useIntl();

    const percent = useMemo(() => {
        return calculatePercent(account.available, account.balance);
    }, [account]);

    return (
        <ResponsiveCard>
            <CardHeader title={<FormattedMessage defaultMessage="Payment" />} />

            <CardContent sx={{flexGrow: 1}}>
                <Stack justifyContent="space-between" sx={{height: "100%"}}>
                    <PercentChart
                        title={account.currency}
                        color={theme.palette.primary.main}
                        value={percent || 0}
                        content={account.available}
                        height={200}
                    />

                    <Stack>
                        <ChartLegend
                            color={theme.palette.primary.main}
                            label={intl.formatMessage(messages.available)}
                            content={account.formatted_available}
                            active={true}
                        />

                        <ChartLegend
                            color={theme.palette.primary.main}
                            label={intl.formatMessage(messages.onTrade)}
                            content={account.formatted_balance_on_trade}
                            active={false}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </ResponsiveCard>
    );
};

PaymentAccountChart.dimensions = {
    lg: {w: 3, h: 3, isResizable: false},
    md: {w: 2, h: 3, isResizable: false},
    sm: {w: 1, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default PaymentAccountChart;
