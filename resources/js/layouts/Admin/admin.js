import React, {useMemo} from "react";
import Routes from "routes/admin";
import {BaseStyle, MainStyle} from "../layout.style";
import Navbar from "components/Navbar";
import Language from "components/Language";
import Notifications from "components/Notifications";
import UserArea from "./components/UserArea";
import Sidebar from "components/Sidebar";
import {useIntl} from "react-intl";
import {router} from "utils/index";
import {Chip} from "@mui/material";
import {useSidebarToggle} from "hooks/useSidebarToggle";
import {useAuth} from "models/Auth";

const Admin = () => {
    const intl = useIntl();
    const auth = useAuth();

    const links = useMemo(() => {
        const getSidebarItem = (key, perm = null, children) => {
            if (!perm || auth.can(perm)) {
                return {
                    title: router.getName(key, intl),
                    icon: router.getIconComponent(key),
                    path: router.generatePath(key),
                    ...{key, children}
                };
            }
        };

        return [
            {
                key: "dashboard",
                title: intl.formatMessage({defaultMessage: "Dashboard"}),
                items: [
                    getSidebarItem("admin.home"),
                    getSidebarItem("admin.users", "view_users"),
                    getSidebarItem("admin.payments", "manage_payments"),
                    getSidebarItem("admin.wallets", "manage_wallets")
                ]
            },
            {
                key: "marketplace",
                title: intl.formatMessage({defaultMessage: "Marketplace"}),
                items: [
                    getSidebarItem("admin.exchange", "manage_exchange"),
                    getSidebarItem("admin.giftcards", "manage_giftcards")
                ]
            },
            {
                key: "configuration",
                title: intl.formatMessage({defaultMessage: "Configuration"}),
                items: [
                    getSidebarItem("admin.settings", "manage_settings"),
                    getSidebarItem("admin.localization", "manage_localization"),
                    getSidebarItem("admin.customize", "manage_customization")
                ]
            }
        ];
    }, [intl, auth]);

    const [sidebarState, openSidebar, closeSidebar] = useSidebarToggle();

    return (
        <BaseStyle>
            <Navbar
                onOpenSidebar={openSidebar}
                actions={[
                    <Language key={0} />,
                    <Notifications key={1} />,
                    <UserArea key={2} />
                ]}
            />
            <Sidebar
                isOpenSidebar={sidebarState}
                onCloseSidebar={closeSidebar}
                links={links}
                accountAction={
                    <Chip
                        variant="outlined"
                        size="small"
                        label={auth.user.all_roles[0]}
                        sx={{mt: 0.5}}
                    />
                }
            />
            <MainStyle>
                <Routes />
            </MainStyle>
        </BaseStyle>
    );
};

export default Admin;
