import React, {useMemo} from "react";
import ApexChart from "../ApexChart";
import {useTheme} from "@mui/material/styles";
import {formatNumber} from "utils/formatter";
import {defaultTo} from "lodash";
import {lightenColor} from "utils/helpers";

const PercentChart = ({title, value, content, color, height = 300}) => {
    const theme = useTheme();
    color = defaultTo(color, theme.palette.primary.main);

    const options = useMemo(
        () => ({
            legend: {show: false},
            fill: {
                type: "gradient",
                gradient: {
                    colorStops: [
                        [
                            {offset: 0, color: lightenColor(color, 20)},
                            {offset: 100, color}
                        ]
                    ]
                }
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {offsetY: -4},
                        value: {offsetY: 4},
                        total: {
                            formatter: () => formatNumber(content),
                            label: title
                        }
                    },
                    hollow: {size: "60%"}
                }
            }
        }),
        [title, content, color]
    );

    return (
        <ApexChart
            type="radialBar"
            series={[value]}
            options={options}
            height={height}
        />
    );
};

export default PercentChart;
