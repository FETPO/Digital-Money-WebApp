import React from "react";
import PropTypes from "prop-types";
import {Popover} from "@mui/material";
import {ArrowStyle} from "./menuPopover.style";

function MenuPopover({children, sx, ...other}) {
    return (
        <Popover
            PaperProps={{
                sx: {
                    mt: 1.5,
                    ml: 0.5,
                    overflow: "inherit",
                    boxShadow: (theme) => theme.customShadows.z20,
                    border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
                    width: 200,
                    ...sx
                }
            }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
            {...other}>
            <ArrowStyle className="arrow" />
            {children}
        </Popover>
    );
}

MenuPopover.propTypes = {
    children: PropTypes.node.isRequired,
    sx: PropTypes.object
};

export default MenuPopover;
