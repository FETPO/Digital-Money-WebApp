import React from "react";
import PropTypes from "prop-types";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Typography} from "@mui/material";
import Logo from "components/Logo";
import {MHidden} from "components/@material-extend";
import {router} from "utils/index";

const HeaderStyle = styled("header")(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    lineHeight: 0,
    width: "100%",
    zIndex: 9,
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
        alignItems: "flex-start",
        padding: theme.spacing(7, 5, 0, 7)
    }
}));

function HintLayout({children}) {
    return (
        <HeaderStyle>
            <Logo to={router.generatePath("landing")} />

            <MHidden width="smDown">
                <Typography variant="body2" sx={{mt: {md: -2}}}>
                    {children}
                </Typography>
            </MHidden>
        </HeaderStyle>
    );
}

HintLayout.propTypes = {children: PropTypes.node};

export default HintLayout;
