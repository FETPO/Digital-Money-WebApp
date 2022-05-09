import React from "react";
import {Box, Stack, Typography, Chip} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {defaultTo} from "lodash";

const ChartLegend = ({label, content, color, active = true}) => {
    const theme = useTheme();
    color = defaultTo(color, theme.palette.primary.main);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{p: 0.3}}
            alignItems="center"
            spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                    sx={{
                        borderRadius: 0.75,
                        bgcolor: active ? color : "grey.50016",
                        width: 16,
                        height: 16
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    {label}
                </Typography>
            </Stack>

            <Typography variant="body2" noWrap>
                <Chip component="span" label={content} size="small" />
            </Typography>
        </Stack>
    );
};

export default ChartLegend;
