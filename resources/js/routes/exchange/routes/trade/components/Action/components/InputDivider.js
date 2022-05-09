import React from "react";
import {Divider, Stack} from "@mui/material";
import SwapCircleIcon from "@mui/icons-material/SwapVerticalCircle";

const InputDivider = () => {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{height: 80, mb: 3}}>
            <Divider orientation="vertical" flexItem>
                <Stack
                    component="span"
                    justifyContent="center"
                    sx={{flexGrow: 1}}>
                    <SwapCircleIcon fontSize="large" color="primary" />
                </Stack>
            </Divider>
        </Stack>
    );
};

export default InputDivider;
