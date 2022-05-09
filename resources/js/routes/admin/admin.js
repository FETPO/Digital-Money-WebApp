import React, {Fragment} from "react";
import {lazy, router} from "utils/index";
import BaseRedirect from "components/BaseRedirect";
import PresenceTimer from "components/PresenceTimer";
import ProtectedRoute from "components/ProtectedRoute";
import {Switch} from "react-router-dom";
import FallbackRoute from "components/FallbackRoute";
import Result404 from "components/Result404";
import {can} from "utils/middleware";

const Home = lazy(() =>
    import(/* webpackChunkName: 'admin.home' */ "./routes/home")
);

const Wallets = lazy(() =>
    import(/* webpackChunkName: 'admin.wallets' */ "./routes/wallets")
);

const Payments = lazy(() =>
    import(/* webpackChunkName: 'admin.payments' */ "./routes/payments")
);

const Users = lazy(() =>
    import(/* webpackChunkName: 'admin.users' */ "./routes/users")
);

const Giftcards = lazy(() =>
    import(/* webpackChunkName: 'admin.giftcards' */ "./routes/giftcards")
);

const Exchange = lazy(() =>
    import(/* webpackChunkName: 'admin.exchange' */ "./routes/exchange")
);

const Settings = lazy(() =>
    import(/* webpackChunkName: 'admin.settings' */ "./routes/settings")
);

const Localization = lazy(() =>
    import(/* webpackChunkName: 'admin.localization' */ "./routes/localization")
);

const Customize = lazy(() =>
    import(/* webpackChunkName: 'admin.customize' */ "./routes/customize")
);

const Admin = () => {
    return (
        <Fragment>
            <PresenceTimer />
            <BaseRedirect to={router.generatePath("admin.home")} />

            <Switch>
                <ProtectedRoute path={router.getPath("admin.home")}>
                    <Home />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_wallets")}
                    path={router.getPath("admin.wallets")}>
                    <Wallets />
                </ProtectedRoute>

                <ProtectedRoute path={router.getPath("admin.users")}>
                    <Users />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_payments")}
                    path={router.getPath("admin.payments")}>
                    <Payments />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_giftcards")}
                    path={router.getPath("admin.giftcards")}>
                    <Giftcards />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_exchange")}
                    path={router.getPath("admin.exchange")}>
                    <Exchange />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_settings")}
                    path={router.getPath("admin.settings")}>
                    <Settings />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_localization")}
                    path={router.getPath("admin.localization")}>
                    <Localization />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={can("manage_customization")}
                    path={router.getPath("admin.customize")}>
                    <Customize />
                </ProtectedRoute>

                <FallbackRoute>
                    <Result404 />
                </FallbackRoute>
            </Switch>
        </Fragment>
    );
};

export default Admin;
