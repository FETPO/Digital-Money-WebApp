import React from "react";
import Redirect from "components/Redirect";
import {router} from "../index";

export function auth(location) {
    return function (next) {
        return function (node, auth) {
            if (!auth.check()) {
                return (
                    <Redirect
                        to={{
                            pathname: router.generatePath("auth.login"),
                            state: {referrer: location}
                        }}
                    />
                );
            }

            return next(node, auth);
        };
    };
}

export function guest(redirectTo) {
    return function (next) {
        return function (node, auth) {
            if (auth.check()) {
                return <Redirect to={redirectTo} />;
            }

            return next(node, auth);
        };
    };
}
