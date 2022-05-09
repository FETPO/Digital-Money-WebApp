import React, {forwardRef} from "react";
import PropTypes from "prop-types";
import {alpha, useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import {ButtonAnimate} from "../Animate";

const MIconButton = forwardRef((props, ref) => {
    const theme = useTheme();
    const {color = "default", children, sx, ...other} = props;

    if (
        color === "default" ||
        color === "inherit" ||
        color === "primary" ||
        color === "secondary"
    ) {
        return (
            <ButtonAnimate>
                <IconButton ref={ref} color={color} sx={sx} {...other}>
                    {children}
                </IconButton>
            </ButtonAnimate>
        );
    }

    return (
        <ButtonAnimate>
            <IconButton
                ref={ref}
                sx={{
                    "&:hover": {
                        bgcolor: alpha(
                            theme.palette[color].main,
                            theme.palette.action.hoverOpacity
                        )
                    },
                    color: theme.palette[color].main,
                    ...sx
                }}
                {...other}>
                {children}
            </IconButton>
        </ButtonAnimate>
    );
});

MIconButton.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object,
    color: PropTypes.oneOf([
        "default",
        "inherit",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error"
    ])
};

export default MIconButton;
