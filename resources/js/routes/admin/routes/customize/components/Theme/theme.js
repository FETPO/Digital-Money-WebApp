import React from "react";
import {Card, Grid, Stack, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import ModeSettings from "./components/ModeSettings";
import DirectionChange from "./components/DirectionChange";
import ColorSettings from "./components/ColorSettings";

const Theme = () => {
    return (
        <Card>
            <Grid container spacing={5} sx={{p: 3}} justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Change Mode" />
                        </Typography>
                        <ModeSettings />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Change Direction" />
                        </Typography>
                        <DirectionChange />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Change Color" />
                        </Typography>
                        <ColorSettings />
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
};

export default Theme;
