import React from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {Stack, Divider} from "@mui/material";
import TotalUsers from "./components/TotalUsers";
import TotalEarnings from "./components/TotalEarnings";

const EarningSummary = () => {
    return (
        <ResponsiveCard>
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                sx={{height: "100%"}}
                spacing={2}>
                <TotalEarnings />
                <TotalUsers />
            </Stack>
        </ResponsiveCard>
    );
};

EarningSummary.dimensions = {
    lg: {w: 6, h: 2, isResizable: false},
    md: {w: 4, h: 2, isResizable: false},
    sm: {w: 2, h: 2, isResizable: false},
    xs: {w: 1, h: 2, isResizable: false}
};

export default EarningSummary;
