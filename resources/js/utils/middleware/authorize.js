import React from "react";
import Result403 from "components/Result403";

export function can(permission) {
    return function (next) {
        return function (node, auth) {
            if (!auth.can(permission)) {
                return <Result403 />;
            }
            return next(node, auth);
        };
    };
}

export function cannot(permission) {
    return function (next) {
        return function (node, auth) {
            if (auth.can(permission)) {
                return <Result403 />;
            }
            return next(node, auth);
        };
    };
}
