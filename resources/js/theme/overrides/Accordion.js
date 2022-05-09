export default function Accordion(theme) {
    return {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    "&.Mui-expanded": {
                        boxShadow: theme.customShadows.z8,
                        borderRadius: theme.shape.borderRadius
                    },
                    "&.no-border::before": {display: "none"},
                    "&.Mui-disabled": {
                        backgroundColor: "transparent"
                    }
                }
            }
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    paddingLeft: theme.spacing(2),
                    paddingRight: theme.spacing(1),
                    "&.Mui-disabled": {
                        opacity: 1,
                        color: theme.palette.action.disabled,
                        "& .MuiTypography-root": {
                            color: "inherit"
                        }
                    }
                },
                expandIconWrapper: {
                    color: "inherit"
                }
            }
        }
    };
}
