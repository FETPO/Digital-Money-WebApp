import React, {forwardRef} from "react";
import {alpha} from "@mui/material/styles";
import {MIconButton} from "../@material-extend";

const ActionButton = forwardRef(({sx, active, ...otherProps}, ref) => {
    return (
        <MIconButton
            ref={ref}
            color={active ? "primary" : "default"}
            {...otherProps}
            sx={{
                ...(active && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.focusOpacity
                        )
                }),
                ...sx
            }}
        />
    );
});

export default ActionButton;
