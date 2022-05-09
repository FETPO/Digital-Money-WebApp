import React, {Fragment} from "react";
import {router} from "utils";
import {Route} from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import AnimatedSwitch from "components/AnimatedSwitch";
import BaseRedirect from "components/BaseRedirect";
import FallbackRoute from "components/FallbackRoute";
import ForgotPassword from "routes/auth/routes/forgotPassword";
import Result404 from "components/Result404";

const Auth = () => {
    return (
        <Fragment>
            <BaseRedirect to={router.generatePath("auth.login")} />

            <AnimatedSwitch>
                <Route path={router.getPath("auth.login")}>
                    <Login />
                </Route>

                <Route path={router.getPath("auth.forgot-password")}>
                    <ForgotPassword />
                </Route>

                <Route path={router.getPath("auth.register")}>
                    <Register />
                </Route>

                <FallbackRoute>
                    <Result404 />
                </FallbackRoute>
            </AnimatedSwitch>
        </Fragment>
    );
};

export default Auth;
