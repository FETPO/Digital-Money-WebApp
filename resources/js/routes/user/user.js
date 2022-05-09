import React, {Fragment} from "react";
import BaseRedirect from "components/BaseRedirect";
import {router} from "utils/index";
import AnimatedSwitch from "components/AnimatedSwitch";
import Result404 from "components/Result404";
import FallbackRoute from "components/FallbackRoute";
import Account from "./routes/account";
import ProtectedRoute from "components/ProtectedRoute";
import Purchases from "./routes/purchases";

const User = () => {
    return (
        <Fragment>
            <BaseRedirect to={router.generatePath("user.account")} />

            <AnimatedSwitch>
                <ProtectedRoute path={router.getPath("user.purchases")}>
                    <Purchases />
                </ProtectedRoute>

                <ProtectedRoute path={router.getPath("user.account")}>
                    <Account />
                </ProtectedRoute>

                <FallbackRoute>
                    <Result404 />
                </FallbackRoute>
            </AnimatedSwitch>
        </Fragment>
    );
};

export default User;
