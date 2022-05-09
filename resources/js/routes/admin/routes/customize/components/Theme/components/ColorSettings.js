import React from "react";
import {Box, CardActionArea, Grid, Paper, RadioGroup} from "@mui/material";
import {alpha} from "@mui/material/styles";
import useSettings from "hooks/useSettings";
import RadioField from "./RadioField";

const ColorSettings = () => {
    const {themeColor, onChangeColor, colorOption} = useSettings();
    return (
        <RadioGroup
            name="themeColor"
            onChange={onChangeColor}
            value={themeColor}>
            <Grid container spacing={1.5} dir="ltr">
                {colorOption.map((color) => {
                    const colorName = color.name;
                    const selected = themeColor === colorName;
                    const variant = selected ? "elevation" : "outlined";
                    const colorValue = color.value;

                    return (
                        <Grid item xs={4} key={colorName}>
                            <Paper
                                variant={variant}
                                sx={{
                                    ...(selected && {
                                        border: `solid 2px ${colorValue}`,
                                        bgcolor: alpha(colorValue, 0.12)
                                    })
                                }}>
                                <CardActionArea sx={{borderRadius: 1}}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            height: 48,
                                            alignItems: "center"
                                        }}>
                                        <Box
                                            sx={{
                                                borderRadius: "50%",
                                                bgcolor: colorValue,
                                                transform: "rotate(-45deg)",
                                                width: 24,
                                                height: 12,
                                                transition: "all",
                                                ...(selected && {
                                                    transform: "none"
                                                })
                                            }}
                                        />
                                    </Box>

                                    <RadioField value={colorName} />
                                </CardActionArea>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </RadioGroup>
    );
};

export default ColorSettings;
