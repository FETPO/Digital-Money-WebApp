import React from "react";
import {Icon} from "@iconify/react";
import moonFill from "@iconify/icons-eva/moon-fill";
import sunFill from "@iconify/icons-eva/sun-fill";
import {Box, CardActionArea, Grid, Paper, RadioGroup} from "@mui/material";
import useSettings from "hooks/useSettings";
import {useTheme} from "@mui/material/styles";
import RadioField from "./RadioField";

const ModeSettings = () => {
    const {themeMode, onChangeMode} = useSettings();
    const theme = useTheme();
    return (
        <RadioGroup name="themeMode" value={themeMode} onChange={onChangeMode}>
            <Grid container spacing={2.5} dir="ltr">
                {["light", "dark"].map((mode) => {
                    const selected = themeMode === mode;
                    const dark = mode === "dark";
                    const bgColor = dark ? "grey.900" : "common.white";
                    const icon = dark ? moonFill : sunFill;
                    return (
                        <Grid item xs={6} key={mode}>
                            <Paper
                                sx={{
                                    width: 1,
                                    overflow: "hidden",
                                    position: "relative",
                                    zIndex: 0,
                                    bgcolor: bgColor,
                                    ...(selected && {
                                        boxShadow: theme.customShadows.z12
                                    })
                                }}>
                                <CardActionArea sx={{color: "primary.main"}}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            color: "text.disabled",
                                            padding: 4,
                                            fontSize: 40,
                                            ...(selected && {
                                                color: "primary.main"
                                            })
                                        }}>
                                        <Icon icon={icon} />
                                    </Box>

                                    <RadioField value={mode} />
                                </CardActionArea>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </RadioGroup>
    );
};

export default ModeSettings;
