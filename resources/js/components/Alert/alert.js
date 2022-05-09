import React from "react";
import {Alert as BaseAlert, IconButton, Collapse} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";

const Alert = ({closeable = false, ...props}) => {
    const baseProps = {...props};
    const [open, setOpen] = React.useState(true);

    if (closeable) {
        baseProps.action = (
            <IconButton
                color="inherit"
                aria-label="close"
                size="small"
                onClick={() => {
                    setOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
            </IconButton>
        );
    }

    return (
        <Collapse in={open}>
            <BaseAlert {...baseProps} />
        </Collapse>
    );
};

export default Alert;
