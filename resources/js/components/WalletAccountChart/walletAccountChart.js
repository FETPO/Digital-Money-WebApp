import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useTheme} from "@mui/material/styles";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import PercentChart from "../PercentChart";
import {usePaymentAccount} from "hooks/account";
import {CardContent, CardHeader, Stack} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import ChartLegend from "../ChartLegend/chartLegend";
import {errorHandler, route, useRequest} from "services/Http";
import {calculatePercent} from "utils/helpers";

const messages = defineMessages({
    available: {defaultMessage: "Available"},
    onTrade: {defaultMessage: "On Trade"}
});

const WalletAccountChart = () => {
    const theme = useTheme();
    const [request] = useRequest();
    const [aggregate, setAggregate] = useState({});
    const {account} = usePaymentAccount();
    const intl = useIntl();

    const fetchAggregate = useCallback(() => {
        request
            .get(route("wallet.account.aggregate-price"))
            .then((data) => setAggregate(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchAggregate();
    }, [fetchAggregate]);

    const percent = useMemo(() => {
        return calculatePercent(aggregate.available, aggregate.balance);
    }, [aggregate]);

    return (
        <ResponsiveCard>
            <CardHeader title={<FormattedMessage defaultMessage="Wallet" />} />

            <CardContent sx={{flexGrow: 1}}>
                <Stack justifyContent="space-between" sx={{height: "100%"}}>
                    <PercentChart
                        title={account.currency}
                        color={theme.palette.chart.blue[0]}
                        value={percent || 0}
                        content={aggregate.available}
                        height={200}
                    />

                    <Stack>
                        <ChartLegend
                            color={theme.palette.chart.blue[0]}
                            label={intl.formatMessage(messages.available)}
                            content={aggregate.formatted_available}
                            active={true}
                        />

                        <ChartLegend
                            color={theme.palette.chart.blue[0]}
                            label={intl.formatMessage(messages.onTrade)}
                            content={aggregate.formatted_balance_on_trade}
                            active={false}
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </ResponsiveCard>
    );
};

WalletAccountChart.dimensions = {
    lg: {w: 3, h: 3, isResizable: false},
    md: {w: 2, h: 3, isResizable: false},
    sm: {w: 1, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default WalletAccountChart;
