export default function Dialog(theme) {
    return {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    boxShadow: theme.customShadows.z24,
                    "&.MuiPaper-rounded": {
                        borderRadius: theme.shape.borderRadiusMd
                    },
                    "&.MuiDialog-paperFullScreen": {borderRadius: 0},
                    "&.MuiDialog-paper .MuiDialogActions-root": {
                        padding: theme.spacing(3)
                    },
                    "@media (max-width: 600px)": {margin: theme.spacing(2)},
                    "@media (max-width: 663.95px)": {
                        "&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody": {
                            maxWidth: "100%"
                        }
                    }
                },
                paperFullWidth: {width: "100%"}
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    "& + .MuiDialogContent-root": {
                        paddingTop: `${theme.spacing(1)} !important`
                    },
                    padding: theme.spacing(3, 3, 2)
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(0, 3)
                },
                dividers: {
                    borderBottom: 0,
                    borderTop: 0
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    "& > :not(:first-of-type)": {marginLeft: theme.spacing(1.5)}
                }
            }
        }
    };
}
