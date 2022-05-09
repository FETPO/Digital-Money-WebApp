import React, {useMemo} from "react";
import {BaseStyle, MainStyle} from "../layout.style";
import Navbar from "components/Navbar";
import Routes from "routes";
import Sidebar from "components/Sidebar";
import Account from "./components/Account";
import Language from "components/Language";
import Notifications from "components/Notifications";
import {router} from "utils/index";
import {useAuth} from "models/Auth";
import {FormattedMessage, useIntl} from "react-intl";
import {Box, Button, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import MemoryIcon from "@mui/icons-material/Memory";
import Clock from "components/Clock";
import {DocIcon} from "assets/index";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {useSidebarToggle} from "hooks/useSidebarToggle";
import {useBrand} from "hooks/settings";

const Main = () => {
    const auth = useAuth();
    const intl = useIntl();

    const links = useMemo(() => {
        const getSidebarItem = (key, children) => {
            return {
                title: router.getName(key, intl),
                icon: router.getIconComponent(key),
                path: router.generatePath(key),
                ...{key, children}
            };
        };

        return [
            {
                key: "general",
                title: intl.formatMessage({defaultMessage: "General"}),
                items: [
                    getSidebarItem("home"),
                    getSidebarItem("payments"),
                    getSidebarItem("wallets")
                ]
            },
            {
                key: "marketplace",
                title: intl.formatMessage({defaultMessage: "Marketplace"}),
                items: [
                    getSidebarItem("exchange", [
                        getSidebarItem("exchange.trade")
                    ]),
                    getSidebarItem("giftcards")
                ]
            }
        ];
    }, [intl]);

    const brand = useBrand();

    const [sidebarState, openSidebar, closeSidebar] = useSidebarToggle();

    return (
        <BaseStyle>
            <Navbar
                onOpenSidebar={openSidebar}
                actions={[
                    <Language key={0} />,
                    <Notifications key={1} />,
                    <Account key={2} />
                ]}
            />
            <Sidebar
                isOpenSidebar={sidebarState}
                onCloseSidebar={closeSidebar}
                links={links}
                accountAction={
                    auth.can("access_control_panel") ? (
                        <Button
                            component={RouterLink}
                            sx={{boxShadow: "none", mt: 0.5}}
                            to={router.generatePath("admin")}
                            size="small"
                            variant="contained"
                            startIcon={<MemoryIcon />}
                            color="primary">
                            <FormattedMessage defaultMessage="Control Panel" />
                        </Button>
                    ) : (
                        <Typography
                            variant="caption"
                            sx={{color: "text.secondary"}}
                            noWrap={true}>
                            <Clock />
                        </Typography>
                    )
                }
                extras={
                    <Box sx={{px: 2.5, pb: 3, mt: 10}}>
                        <DocStyle>
                            <DocIcon sx={{width: 30, mb: 1}} />
                            <Typography
                                variant="subtitle1"
                                sx={{color: "grey.700"}}
                                gutterBottom>
                                <FormattedMessage
                                    defaultMessage="Need some help?"
                                    values={{name: auth.user.name}}
                                />
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{mb: 2, color: "grey.600"}}>
                                <FormattedMessage defaultMessage="Contact one of our support agents." />
                            </Typography>
                            <Button
                                fullWidth
                                href={brand.supportUrl}
                                target="_blank"
                                variant="contained">
                                <FormattedMessage defaultMessage="Get Support" />
                            </Button>
                        </DocStyle>
                    </Box>
                }
            />
            <MainStyle>
                <Routes />
            </MainStyle>
        </BaseStyle>
    );
};

export const DocStyle = styled("div")(({theme}) => ({
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadiusMd,
    backgroundColor:
        theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.08)
            : theme.palette.primary.lighter
}));

export default Main;
