import React from "react";
import {Grid} from "@mui/material";
import UpdateGeneral from "./components/UpdateGeneral";
import UpdateGateway from "./components/UpdateGateway";

const General = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <UpdateGeneral />
            </Grid>
            <Grid item xs={12} md={6}>
                <UpdateGateway />
            </Grid>
        </Grid>
    );
};

export default General;
