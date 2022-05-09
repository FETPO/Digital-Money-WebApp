import React from "react";
import {Grid} from "@mui/material";
import UserActivity from "./components/UserActivity";
import TwoFactor from "./components/TwoFactor";
import ChangePassword from "./components/ChangePassword";

const Security = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <UserActivity />
            </Grid>
            <Grid item xs={12} md={6}>
                <TwoFactor />
            </Grid>
            <Grid item xs={12} md={6}>
                <ChangePassword />
            </Grid>
        </Grid>
    );
};

export default Security;
