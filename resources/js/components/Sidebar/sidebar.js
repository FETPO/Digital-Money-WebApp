import React, {useEffect} from "react";
import {useAuth} from "models/Auth";
import {useLocation} from "react-router-dom";
import {usePrevious} from "utils/helpers";
import {FormattedMessage} from "react-intl";
import Scrollbar from "../Scrollbar";
import {Box, Drawer, Typography} from "@mui/material";
import Logo from "../Logo";
import {router} from "utils/index";
import UserAvatar from "../UserAvatar";
import NavSection from "../NavSection";
import {MHidden} from "../@material-extend";
import PropTypes from "prop-types";
import {experimentalStyled as styled} from "@mui/material/styles";

const DRAWER_WIDTH = 280;

const Sidebar = ({
    isOpenSidebar,
    onCloseSidebar,
    links,
    accountAction,
    extras
}) => {
    const {pathname} = useLocation();
    const prevPathname = usePrevious(pathname);
    const auth = useAuth();

    useEffect(() => {
        if (isOpenSidebar && pathname !== prevPathname) {
            onCloseSidebar();
        }
    }, [pathname, prevPathname, isOpenSidebar, onCloseSidebar]);

    const sidebarContent = (
        <Scrollbar>
            <Box sx={{px: 2.5, py: 3}}>
                <Logo to={router.generatePath("home")} />
            </Box>

            <AccountStyle sx={{mb: 2, mx: 2}}>
                <UserAvatar user={auth.user} />

                <Box sx={{ml: 2}}>
                    <Typography variant="body2" sx={{width: "130px"}} noWrap>
                        <FormattedMessage
                            defaultMessage="Hi, {name}"
                            values={{name: <b>{auth.user.name}</b>}}
                        />
                    </Typography>

                    {accountAction}
                </Box>
            </AccountStyle>

            <NavSection config={links} />

            {extras}
        </Scrollbar>
    );

    return (
        <BaseStyle>
            <MHidden width="lgUp">
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{sx: {width: DRAWER_WIDTH}}}>
                    {sidebarContent}
                </Drawer>
            </MHidden>

            <MHidden width="lgDown">
                <Drawer
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: DRAWER_WIDTH,
                            bgcolor: "background.default"
                        }
                    }}>
                    {sidebarContent}
                </Drawer>
            </MHidden>
        </BaseStyle>
    );
};

export const AccountStyle = styled("div")(({theme}) => ({
    display: "flex",
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: theme.palette.grey[500_12],
    alignItems: "center"
}));

export const BaseStyle = styled("div")(({theme}) => ({
    [theme.breakpoints.up("lg")]: {
        flexShrink: 0,
        width: DRAWER_WIDTH
    }
}));

Sidebar.propTypes = {
    isOpenSidebar: PropTypes.bool,
    onCloseSidebar: PropTypes.func
};

export default Sidebar;
