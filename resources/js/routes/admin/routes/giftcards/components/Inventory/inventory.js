import React from "react";
import {Grid} from "@mui/material";
import Giftcards from "./Giftcards";
import Brands from "./Brands";

const Inventory = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Giftcards />
            </Grid>
            <Grid item xs={12}>
                <Brands />
            </Grid>
        </Grid>
    );
};

export default Inventory;
