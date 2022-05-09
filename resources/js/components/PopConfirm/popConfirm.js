import React, {createElement, Fragment, useCallback, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {Button, DialogActions, DialogContent, Popover} from "@mui/material";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    no: {defaultMessage: "No"},
    yes: {defaultMessage: "Yes"}
});

const PopConfirm = ({
    component = LoadingButton,
    onClick,
    content,
    confirmText,
    cancelText,
    ...otherProps
}) => {
    const intl = useIntl();
    const [anchorEl, setAnchorEl] = useState(null);

    const confirm = useCallback(() => {
        onClick?.();
        setAnchorEl(null);
    }, [onClick]);

    const handleClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const cancel = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <Fragment>
            {createElement(component, {
                ...otherProps,
                onClick: handleClick
            })}

            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                sx={{p: 3}}
                onClose={cancel}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom"
                }}>
                <DialogContent sx={{pt: 2}}>{content}</DialogContent>
                <DialogActions>
                    <Button size="small" onClick={cancel}>
                        {cancelText || intl.formatMessage(messages.no)}
                    </Button>
                    <Button variant="contained" size="small" onClick={confirm}>
                        {confirmText || intl.formatMessage(messages.yes)}
                    </Button>
                </DialogActions>
            </Popover>
        </Fragment>
    );
};

export default PopConfirm;
