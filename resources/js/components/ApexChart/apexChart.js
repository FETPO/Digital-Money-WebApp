import React from "react";
import ReactApexChart from "react-apexcharts";
import useBaseOption from "./baseOption";

const ApexChart = ({options, ...otherProps}) => {
    const chartOptions = useBaseOption(options);
    return <ReactApexChart {...otherProps} options={chartOptions} />;
};

export default ApexChart;
