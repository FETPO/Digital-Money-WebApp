import React from "react";
import {Grid} from "@mui/material";
import UpdateLimit from "./components/UpdateLimit";
import UpdateSettings from "./components/UpdateSettings";

const Limits = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <UpdateLimit />
            </Grid>
            <Grid item xs={12} md={4}>
                <UpdateSettings />
            </Grid>
        </Grid>
    );
};

export default Limits;
