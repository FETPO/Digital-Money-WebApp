import React, {useCallback, useEffect, useState} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, YAxis} from "recharts";
import {useTheme} from "@mui/material/styles";
import {errorHandler, route, useRequest} from "services/Http";
import {get, isEmpty} from "lodash";
import {parseDate} from "utils/form";
import {Paper, Typography} from "@mui/material";

const Chart = () => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const color = theme.palette.primary.main;
    const [request] = useRequest();

    const fetchData = useCallback(() => {
        request
            .get(route("payment.daily-chart"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <ResponsiveContainer width="100%" height={120}>
            <AreaChart
                margin={{top: 5, right: 0, left: 0, bottom: 0}}
                data={data}>
                <Tooltip content={<TooltipContent />} />
                <YAxis domain={[0, "dataMax"]} type="number" hide />
                <Area
                    dataKey="total_received"
                    stroke={color}
                    type="monotone"
                    fill={color}
                    strokeWidth={4}
                    fillOpacity={0.3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const TooltipContent = ({active, payload}) => {
    const data = get(payload, "[0].payload");
    const visible = active && !isEmpty(data);
    return (
        visible && (
            <Paper sx={{textAlign: "center", p: 1}} elevation={3}>
                <Typography variant="subtitle2" sx={{color: "text.primary"}}>
                    {`${data.formatted_total_received}`}
                </Typography>
                <Typography variant="caption" sx={{color: "text.secondary"}}>
                    {parseDate(data.date).format("ll")}
                </Typography>
            </Paper>
        )
    );
};

export default Chart;
