import React from "react";
import {alpha, useTheme} from "@mui/material/styles";
import {GlobalStyles} from "@mui/material";

export function ApexChartStyles() {
    const theme = useTheme();
    const isLight = theme.palette.mode === "light";

    const background = {
        backgroundColor: alpha(theme.palette.background.default, 0.72),
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)"
    };

    const styles = {
        "&.apexcharts-canvas": {
            ".apexcharts-xaxistooltip": {
                ...background,
                border: 0,
                boxShadow: theme.customShadows.z24,
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadiusSm,
                "&:before": {
                    borderBottomColor: "transparent"
                },
                "&:after": {
                    borderBottomColor: alpha(
                        theme.palette.background.default,
                        0.72
                    )
                }
            },
            ".apexcharts-tooltip.apexcharts-theme-light": {
                ...background,
                border: 0,
                boxShadow: theme.customShadows.z24,
                borderRadius: theme.shape.borderRadiusSm,
                "& .apexcharts-tooltip-title": {
                    border: 0,
                    textAlign: "center",
                    fontWeight: theme.typography.fontWeightBold,
                    backgroundColor: theme.palette.grey[500_16],
                    color: theme.palette.text[isLight ? "secondary" : "primary"]
                }
            },
            ".apexcharts-legend": {
                padding: 0
            },
            ".apexcharts-legend-series": {
                display: "flex !important",
                alignItems: "center"
            },
            ".apexcharts-legend-marker": {
                marginRight: 8
            },
            ".apexcharts-legend-text": {
                lineHeight: "18px",
                textTransform: "capitalize"
            }
        }
    };

    return <GlobalStyles styles={styles} />;
}
