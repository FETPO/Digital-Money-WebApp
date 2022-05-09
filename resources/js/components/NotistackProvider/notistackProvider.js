import React from "react";
import PropTypes from "prop-types";
import {Icon as BaseIcon} from "@iconify/react";
import {SnackbarProvider} from "notistack";
import infoFill from "@iconify/icons-eva/info-fill";
import alertCircleFill from "@iconify/icons-eva/alert-circle-fill";
import alertTriangleFill from "@iconify/icons-eva/alert-triangle-fill";
import checkmarkCircle2Fill from "@iconify/icons-eva/checkmark-circle-2-fill";
import {alpha} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import {Box} from "@mui/material";

const useStyles = makeStyles((theme) => {
    return {
        content: {
            width: "100%",
            margin: `${theme.spacing(0.25, 0)} !important`,
            padding: `${theme.spacing(1.5)} !important`,
            color: `${theme.palette.text.primary} !important`,
            backgroundColor: `${theme.palette.background.paper} !important`,
            borderRadius: `${theme.shape.borderRadius}px !important`,
            boxShadow: `${theme.customShadows.z8} !important`,
            [`& .SnackbarItem-message`]: {
                fontWeight: theme.typography.fontWeightMedium,
                padding: `${theme.spacing(0)} !important`
            },
            [`& .SnackbarItem-action`]: {
                marginRight: -4,
                "& svg": {
                    opacity: 0.48,
                    "&:hover": {opacity: 1},
                    width: 20,
                    height: 20
                }
            }
        },
        containerRoot: {
            "& .MuiCollapse-wrapperInner": {width: "100%"},
            pointerEvents: "unset"
        }
    };
});

function Icon({icon, color}) {
    return (
        <Box
            component="span"
            sx={{
                borderRadius: 1.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: `${color}.main`,
                width: 40,
                height: 40,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
                marginRight: (theme) => theme.spacing(1.5)
            }}>
            <BaseIcon icon={icon} width={24} height={24} />
        </Box>
    );
}

Icon.propTypes = {
    icon: PropTypes.object,
    color: PropTypes.string
};

function NotistackProvider({children}) {
    const classes = useStyles();

    return (
        <SnackbarProvider
            maxSnack={3}
            dense
            autoHideDuration={3000}
            anchorOrigin={{
                horizontal: "right",
                vertical: "top"
            }}
            iconVariant={{
                error: <Icon icon={infoFill} color="error" />,
                warning: <Icon icon={alertTriangleFill} color="warning" />,
                success: <Icon icon={checkmarkCircle2Fill} color="success" />,
                info: <Icon icon={alertCircleFill} color="info" />
            }}
            className={classes.content}
            classes={{
                containerRoot: classes.containerRoot
            }}>
            {children}
        </SnackbarProvider>
    );
}

NotistackProvider.propTypes = {children: PropTypes.node};

export default NotistackProvider;
