import React from "react";
import PropTypes from "prop-types";
import {motion} from "framer-motion";
import {Box} from "@mui/material";
import {varSmallClick, varMediumClick} from "./variants";

function ButtonAnimate({mediumClick = false, children, sx, ...other}) {
    return (
        <Box
            component={motion.div}
            sx={{display: "inline-flex", ...sx}}
            whileTap="tap"
            variants={mediumClick ? varMediumClick : varSmallClick}
            whileHover="hover"
            {...other}>
            {children}
        </Box>
    );
}

ButtonAnimate.propTypes = {
    mediumClick: PropTypes.bool,
    children: PropTypes.node,
    sx: PropTypes.object
};

export default ButtonAnimate;
