import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {Avatar} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const BankLogo = ({src, size = 40, disabled = false, sx, ...otherProps}) => {
    const theme = useTheme();
    const withColor = !src && !disabled;
    return (
        <Avatar
            {...otherProps}
            variant="rounded"
            sx={{
                height: size,
                fontSize: size * (2 / 3),
                width: size,
                ...(withColor && {
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.dark
                }),
                cursor: "pointer",
                ...sx
            }}
            src={src}>
            <AccountBalanceIcon fontSize="inherit" />
        </Avatar>
    );
};

export default BankLogo;
