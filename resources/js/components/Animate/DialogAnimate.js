import React from "react";
import PropTypes from "prop-types";
import {motion, AnimatePresence} from "framer-motion";
import {Dialog} from "@mui/material";
import {varFadeInUp} from "./variants";

function DialogAnimate({open = false, animate, onClose, children, ...other}) {
    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={open}
                    onClose={onClose}
                    PaperComponent={motion.div}
                    PaperProps={{
                        sx: {borderRadius: 2, bgcolor: "background.paper"},
                        ...(animate || varFadeInUp)
                    }}
                    {...other}>
                    {children}
                </Dialog>
            )}
        </AnimatePresence>
    );
}

DialogAnimate.propTypes = {
    open: PropTypes.bool.isRequired,
    animate: PropTypes.object,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired
};

export default DialogAnimate;
