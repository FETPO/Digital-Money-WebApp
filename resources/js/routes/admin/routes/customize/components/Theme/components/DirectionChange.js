import React from "react";
import {Box, CardActionArea, Grid, Paper, RadioGroup} from "@mui/material";
import useSettings from "hooks/useSettings";
import {useTheme} from "@mui/material/styles";
import RadioField from "./RadioField";

const DirectionChange = () => {
    const {themeDirection, onChangeDirection} = useSettings();
    const theme = useTheme();
    return (
        <RadioGroup
            name="themeDirection"
            onChange={onChangeDirection}
            value={themeDirection}>
            <Grid container spacing={2.5} dir="ltr">
                {["ltr", "rtl"].map((direction) => {
                    const selected = themeDirection === direction;
                    const rtl = direction === "rtl";
                    const bgColor = selected ? "primary.main" : "grey.500";
                    const variant = selected ? "elevation" : "outlined";
                    return (
                        <Grid item xs={6} key={direction}>
                            <Paper
                                key={direction}
                                variant={variant}
                                sx={{
                                    width: 1,
                                    overflow: "hidden",
                                    position: "relative",
                                    zIndex: 0,
                                    ...(selected && {
                                        boxShadow: theme.customShadows.z12
                                    })
                                }}>
                                <CardActionArea sx={{color: "primary.main"}}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            p: 1.5,
                                            ...(rtl && {
                                                alignItems: "flex-end"
                                            })
                                        }}>
                                        <Content color={bgColor} />
                                    </Box>

                                    <RadioField value={direction} />
                                </CardActionArea>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </RadioGroup>
    );
};

const Content = ({color}) => {
    return [56, 36, 24].map((size, index) => (
        <Box
            key={size}
            sx={{
                height: size / 2.5,
                width: size,
                borderRadius: 0.75,
                my: 0.5,
                bgcolor: color,
                ...(index === 0 && {
                    opacity: 0.64
                }),
                ...(index === 1 && {
                    opacity: 0.32,
                    borderRadius: "4px"
                }),
                ...(index === 2 && {
                    opacity: 0.16,
                    borderRadius: "3px"
                })
            }}
        />
    ));
};

export default DirectionChange;
