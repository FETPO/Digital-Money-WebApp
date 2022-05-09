import React from "react";
import {Grid} from "@mui/material";
import Limits from "./components/Limits";
import Data from "./components/Data";

const Verification = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Data />
            </Grid>
            <Grid item xs={12} md={4}>
                <Limits />
            </Grid>
        </Grid>
    );
};

export default Verification;
