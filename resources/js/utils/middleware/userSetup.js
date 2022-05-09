import React from "react";
import Redirect from "components/Redirect";
import {router} from "../index";

export function requireUserSetup() {
    return function (next) {
        return function (node, auth) {
            if (auth.isUserSetupRequired()) {
                return <Redirect to={router.generatePath("user-setup")} />;
            }

            return next(node, auth);
        };
    };
}

export function withoutUserSetup(redirectTo) {
    return function (next) {
        return function (node, auth) {
            if (!auth.isUserSetupRequired()) {
                return <Redirect to={redirectTo} />;
            }

            return next(node, auth);
        };
    };
}
