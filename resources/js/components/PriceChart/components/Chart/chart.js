import React, {useState, useEffect} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, YAxis} from "recharts";
import TooltipContent from "../Tooltip";
import {lightenColor} from "utils";
import {defaultTo} from "lodash";
import {useTheme} from "@mui/material/styles";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";

const Chart = ({selectedWallet, range}) => {
    const [data, setData] = useState([]);
    const [request, loading] = useRequest();

    useEffect(() => {
        if (selectedWallet.isNotEmpty()) {
            const params = {wallet: selectedWallet.id};
            request
                .post(route("wallet.market-chart", params), {range})
                .then((data) => setData(data))
                .catch(errorHandler());
        }
    }, [selectedWallet, request, range]);

    if (selectedWallet.isEmpty()) {
        return <ChartBody data={data} />;
    }

    const coin = selectedWallet.coin;

    return (
        <Spin sx={{height: "100%"}} spinning={loading}>
            <ChartBody color={coin.color} name={coin.identifier} data={data} />
        </Spin>
    );
};

const ChartBody = ({color, name = "unknown", data = []}) => {
    const theme = useTheme();
    color = defaultTo(color, theme.palette.primary.main);
    const id = name + "Color";
    const toColor = lightenColor(color, 20);
    const fromColor = color;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                margin={{top: 5, right: 0, left: 0, bottom: 0}}
                data={data}>
                <Tooltip content={<TooltipContent />} />
                <defs>
                    <linearGradient x1="0" y1="0" x2="1" y2="1" id={id}>
                        <stop
                            offset="5%"
                            stopColor={fromColor}
                            stopOpacity={0.9}
                        />
                        <stop
                            offset="95%"
                            stopColor={toColor}
                            stopOpacity={0.9}
                        />
                    </linearGradient>
                </defs>

                <YAxis domain={["dataMin", "dataMax"]} type="number" hide />

                <Area
                    dataKey="price"
                    strokeWidth={0}
                    stroke={fromColor}
                    type="linear"
                    fill={`url(#${id})`}
                    fillOpacity={1}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default Chart;
