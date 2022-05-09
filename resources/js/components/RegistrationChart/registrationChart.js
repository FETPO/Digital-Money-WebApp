import React, {useCallback, useEffect, useState} from "react";
import {
    CardHeader,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {Area, AreaChart, ResponsiveContainer, Tooltip, YAxis} from "recharts";
import {parseDate} from "utils/form";
import {get, isEmpty} from "lodash";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {useTheme} from "@mui/material/styles";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "../Spin";
import {dayjs} from "utils";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";

const messages = defineMessages({
    selectMonth: {defaultMessage: "Month"}
});

const RegistrationChart = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [request] = useRequest();
    const [period, setPeriod] = useState(() => formatPeriod(dayjs()));

    const changePeriod = useCallback((e) => {
        setPeriod(e.target.value);
    }, []);

    const fetchData = useCallback(() => {
        const [month, year] = period.split(",");
        const params = {month, year};
        const routeName = "admin.statistics.registration-chart";
        request
            .get(route(routeName), {params})
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request, period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Registrations" />}
                subheader={
                    <FormattedMessage defaultMessage="Monthly Statistics" />
                }
                action={
                    <SelectPeriod period={period} onChange={changePeriod} />
                }
            />

            <Spin sx={{flexGrow: 1, height: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        margin={{top: 50, right: 0, left: 0, bottom: 0}}
                        data={data}>
                        <Tooltip content={<TooltipContent />} />
                        <defs>
                            <linearGradient
                                id="registration"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={theme.palette.primary.main}
                                    stopOpacity={0.9}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={theme.palette.primary.dark}
                                    stopOpacity={0.9}
                                />
                            </linearGradient>
                        </defs>

                        <YAxis domain={[0, "dataMax"]} type="number" hide />

                        <Area
                            dataKey="total"
                            fill={`url(#registration)`}
                            fillOpacity={1}
                            stroke={theme.palette.primary.main}
                            strokeWidth={1}
                            type="monotone"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Spin>
        </ResponsiveCard>
    );
};

const SelectPeriod = ({period, onChange}) => {
    const intl = useIntl();
    const options = [];
    options.push(dayjs());

    for (let i = 1; i < 12; i++) {
        options.push(dayjs().subtract(i, "month"));
    }

    return (
        <TextField
            size="small"
            onChange={onChange}
            value={period}
            label={intl.formatMessage(messages.selectMonth)}
            select>
            {options.map((option, key) => (
                <MenuItem value={formatPeriod(option)} key={key}>
                    {option.format("MMM, YYYY")}
                </MenuItem>
            ))}
        </TextField>
    );
};

const formatPeriod = (date) => {
    return `${date.month() + 1},${date.year()}`;
};

const TooltipContent = ({active, payload}) => {
    const data = get(payload, "[0].payload");
    const visible = active && !isEmpty(data);
    return (
        visible && (
            <Paper sx={{textAlign: "center", p: 1}} elevation={3}>
                <Typography variant="subtitle2" sx={{color: "text.primary"}}>
                    {`${data.total}`}
                </Typography>
                <Typography variant="caption" sx={{color: "text.secondary"}}>
                    {parseDate(data.date).format("ll")}
                </Typography>
            </Paper>
        )
    );
};

RegistrationChart.dimensions = {
    lg: {w: 8, h: 3, isResizable: false},
    md: {w: 5, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default RegistrationChart;
