import React, {useEffect, useMemo} from "react";
import {lazy, routePath, router} from "./utils";
import {Switch, useLocation} from "react-router-dom";
import Redirect from "components/Redirect";
import {useDispatch, useSelector} from "react-redux";
import {get} from "lodash";
import ProtectedRoute from "./components/ProtectedRoute";
import basicMiddleware, {
    auth as authMiddleware,
    can as canMiddleware,
    guest as guestMiddleware
} from "utils/middleware";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {useAuth} from "models/Auth";
import {
    fetchCountries,
    fetchOperatingCountries,
    fetchSupportedCurrencies,
    fetchWallets
} from "redux/slices/global";
import {fetchVerification} from "redux/slices/user";

const Auth = lazy(() =>
    import(/* webpackChunkName: 'auth' */ "./layouts/Auth")
);
const Landing = lazy(() =>
    import(/* webpackChunkName: 'landing' */ "./layouts/Landing")
);
const Main = lazy(() =>
    import(/* webpackChunkName: 'main' */ "./layouts/Main")
);
const Admin = lazy(() =>
    import(/* webpackChunkName: 'admin' */ "./layouts/Admin")
);

const Router = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const location = useLocation();

    const showLanding = useSelector((state) => {
        return get(state, "landing.enable", true);
    });

    const landingMiddleware = useMemo(() => {
        const fallback = <Redirect to={router.generatePath("home")} />;
        return basicMiddleware(() => showLanding, fallback);
    }, [showLanding]);

    useEffect(() => {
        if (auth.check()) {
            dispatch(fetchWalletAccounts());
            dispatch(fetchPaymentAccount());
            dispatch(fetchVerification());
        }
    }, [dispatch, auth]);

    useEffect(() => {
        dispatch(fetchCountries());
        dispatch(fetchSupportedCurrencies());
        dispatch(fetchOperatingCountries());
        dispatch(fetchWallets());
    }, [dispatch]);

    return (
        <Switch>
            <ProtectedRoute
                middleware={landingMiddleware}
                exact
                path={routePath()}>
                <Redirect to={router.generatePath("landing")} />
            </ProtectedRoute>

            <ProtectedRoute
                middleware={landingMiddleware}
                path={router.getPath("landing")}>
                <Landing />
            </ProtectedRoute>

            <ProtectedRoute
                middleware={[canMiddleware("access_control_panel")]}
                path={router.getPath("admin")}>
                <Admin />
            </ProtectedRoute>

            <ProtectedRoute
                middleware={guestMiddleware(router.generatePath("home"))}
                path={router.getPath("auth")}>
                <Auth />
            </ProtectedRoute>

            <ProtectedRoute
                middleware={authMiddleware(location)}
                path={routePath()}>
                <Main />
            </ProtectedRoute>
        </Switch>
    );
};

export default Router;
