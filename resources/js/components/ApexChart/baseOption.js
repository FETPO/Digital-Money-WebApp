import {useMemo} from "react";
import {useTheme} from "@mui/material/styles";
import {defineMessages, useIntl} from "react-intl";
import {merge} from "lodash";

const messages = defineMessages({
    total: {defaultMessage: "Total"}
});

const useBaseOption = (options) => {
    const intl = useIntl();
    const theme = useTheme();

    return useMemo(() => {
        const totalLabel = {
            show: true,
            color: theme.palette.text.secondary,
            label: intl.formatMessage(messages.total),
            ...theme.typography.subtitle2
        };

        const valueLabel = {
            offsetY: 8,
            color: theme.palette.text.primary,
            ...theme.typography.h3
        };

        return merge(
            {
                colors: [
                    theme.palette.primary.main,
                    theme.palette.chart.yellow[0],
                    theme.palette.chart.blue[0],
                    theme.palette.chart.violet[0],
                    theme.palette.chart.green[0],
                    theme.palette.chart.red[0]
                ],

                chart: {
                    toolbar: {show: false},
                    zoom: {enabled: false},
                    foreColor: theme.palette.text.disabled,
                    fontFamily: theme.typography.fontFamily
                },

                states: {
                    hover: {
                        filter: {type: "lighten", value: 0.04}
                    },
                    active: {
                        filter: {type: "darken", value: 0.88}
                    }
                },

                fill: {
                    opacity: 1,
                    gradient: {
                        type: "vertical",
                        shadeIntensity: 0,
                        opacityFrom: 0.4,
                        opacityTo: 0,
                        stops: [0, 100]
                    }
                },

                dataLabels: {enabled: false},

                stroke: {
                    curve: "smooth",
                    lineCap: "round",
                    width: 3
                },

                grid: {
                    strokeDashArray: 3,
                    borderColor: theme.palette.divider
                },

                xaxis: {
                    axisBorder: {show: false},
                    axisTicks: {show: false}
                },

                markers: {
                    strokeColors: theme.palette.background.paper,
                    size: 0
                },

                tooltip: {
                    x: {show: false}
                },

                legend: {
                    show: true,
                    position: "top",
                    fontSize: 13,
                    horizontalAlign: "right",
                    markers: {radius: 12},
                    fontWeight: 500,
                    itemMargin: {horizontal: 12},
                    labels: {
                        colors: theme.palette.text.primary
                    }
                },

                plotOptions: {
                    bar: {
                        columnWidth: "28%",
                        borderRadius: 4
                    },

                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                value: valueLabel,
                                total: totalLabel
                            }
                        }
                    },

                    radialBar: {
                        track: {
                            strokeWidth: "100%",
                            background: theme.palette.grey[500_16]
                        },
                        dataLabels: {
                            value: valueLabel,
                            total: totalLabel
                        }
                    },

                    radar: {
                        polygons: {
                            fill: {colors: ["transparent"]},
                            connectorColors: theme.palette.divider,
                            strokeColors: theme.palette.divider
                        }
                    },

                    polarArea: {
                        spokes: {connectorColors: theme.palette.divider},
                        rings: {strokeColor: theme.palette.divider}
                    }
                },

                responsive: [
                    {
                        breakpoint: theme.breakpoints.values.sm,
                        options: {
                            plotOptions: {
                                bar: {columnWidth: "40%"}
                            }
                        }
                    },
                    {
                        breakpoint: theme.breakpoints.values.md,
                        options: {
                            plotOptions: {
                                bar: {columnWidth: "32%"}
                            }
                        }
                    }
                ]
            },
            options
        );
    }, [intl, theme, options]);
};

export default useBaseOption;
