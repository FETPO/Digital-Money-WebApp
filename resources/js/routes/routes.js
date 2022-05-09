import React, {Fragment} from "react";
import {lazy, router} from "utils";
import {Switch} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import FallbackRoute from "../components/FallbackRoute";
import BaseRedirect from "../components/BaseRedirect";
import {withoutUserSetup, requireUserSetup} from "utils/middleware";
import PresenceTimer from "components/PresenceTimer";
import Result404 from "../components/Result404";

const Home = lazy(() => import(/* webpackChunkName: 'home' */ "./home"));

const UserSetup = lazy(() =>
    import(/* webpackChunkName: 'userSetup' */ "./userSetup")
);

const Payments = lazy(() =>
    import(/* webpackChunkName: 'payments' */ "./payments")
);

const User = lazy(() => import(/* webpackChunkName: 'user' */ "./user"));

const Wallets = lazy(() =>
    import(/* webpackChunkName: 'wallets' */ "./wallets")
);

const Exchange = lazy(() =>
    import(/* webpackChunkName: 'exchange' */ "./exchange")
);

const Giftcards = lazy(() =>
    import(/* webpackChunkName: 'giftcards' */ "./giftcards")
);

const Routes = () => {
    return (
        <Fragment>
            <BaseRedirect to={router.generatePath("home")} />
            <PresenceTimer />
            <Switch>
                <ProtectedRoute
                    path={router.getPath("home")}
                    middleware={requireUserSetup()}>
                    <Home />
                </ProtectedRoute>

                <ProtectedRoute
                    middleware={withoutUserSetup(router.generatePath("home"))}
                    path={router.getPath("user-setup")}>
                    <UserSetup />
                </ProtectedRoute>

                <ProtectedRoute
                    path={router.getPath("payments")}
                    middleware={requireUserSetup()}>
                    <Payments />
                </ProtectedRoute>

                <ProtectedRoute path={router.getPath("user")}>
                    <User />
                </ProtectedRoute>

                <ProtectedRoute
                    path={router.getPath("wallets")}
                    middleware={requireUserSetup()}>
                    <Wallets />
                </ProtectedRoute>

                <ProtectedRoute
                    path={router.getPath("exchange")}
                    middleware={requireUserSetup()}>
                    <Exchange />
                </ProtectedRoute>

                <ProtectedRoute
                    path={router.getPath("giftcards")}
                    middleware={requireUserSetup()}>
                    <Giftcards />
                </ProtectedRoute>

                <FallbackRoute>
                    <Result404 />
                </FallbackRoute>
            </Switch>
        </Fragment>
    );
};

export default Routes;
