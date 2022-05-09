import React from "react";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {AppBar, Box, IconButton, Stack, Toolbar} from "@mui/material";
import {MHidden} from "../@material-extend";
import {Icon} from "@iconify/react";
import menu2Fill from "@iconify-icons/ri/menu-2-fill";

const Navbar = ({onOpenSidebar, content, actions}) => {
    return (
        <StyledAppBar>
            <StyledToolbar>
                <MHidden width="lgUp">
                    <IconButton
                        sx={{mr: 2, color: "text.primary"}}
                        onClick={onOpenSidebar}>
                        <Icon icon={menu2Fill} />
                    </IconButton>
                </MHidden>

                {content}

                <Box sx={{flexGrow: 1}} />

                {actions && (
                    <Stack
                        direction="row"
                        spacing={{xs: 0.5, sm: 1.5}}
                        alignItems="center">
                        {actions}
                    </Stack>
                )}
            </StyledToolbar>
        </StyledAppBar>
    );
};

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

export const StyledAppBar = styled(AppBar)(({theme}) => ({
    boxShadow: "none",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    [theme.breakpoints.up("lg")]: {width: `calc(100% - ${DRAWER_WIDTH + 1}px)`}
}));

export const StyledToolbar = styled(Toolbar)(({theme}) => ({
    minHeight: APPBAR_MOBILE,
    [theme.breakpoints.up("lg")]: {
        minHeight: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5)
    }
}));

export default Navbar;
