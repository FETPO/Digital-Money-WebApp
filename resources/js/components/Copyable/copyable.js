import React, {useCallback} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {notify} from "utils";
import {useIntl} from "react-intl";
import {isString} from "lodash";
import {IconButton, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Copyable = ({
    onCopy,
    text,
    ellipsis,
    containerProps,
    buttonProps,
    children,
    ...props
}) => {
    const intl = useIntl();

    const handleCopy = useCallback(
        (...args) => {
            notify.success(
                intl.formatMessage({defaultMessage: "Copied to clipboard."})
            );
            onCopy?.(...args);
        },
        [onCopy, intl]
    );

    const {sx, ...otherProps} = props;

    const textProps = {
        sx: {...sx},
        noWrap: ellipsis,
        ...otherProps
    };

    if (!text && isString(children)) {
        text = children;
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{minWidth: 0}}
            spacing={1}
            {...containerProps}>
            <Typography {...textProps}>{children}</Typography>
            <CopyToClipboard text={text || "empty"} onCopy={handleCopy}>
                <IconButton size="small" {...buttonProps}>
                    <ContentCopyIcon fontSize="inherit" />
                </IconButton>
            </CopyToClipboard>
        </Stack>
    );
};

Copyable.propTypes = {text: PropTypes.string};

export default Copyable;
