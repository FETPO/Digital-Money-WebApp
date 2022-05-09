import {auth, guest} from "./authenticate";
import {requireUserSetup, withoutUserSetup} from "./userSetup";
import {can, cannot} from "./authorize";
import {isFunction} from "lodash";

export {requireUserSetup, withoutUserSetup};
export {auth, guest, can, cannot};

export default function basicMiddleware(check, fallback) {
    return function (next) {
        return function (node, auth) {
            if (isFunction(check) && !check(auth)) {
                return fallback;
            }

            return next(node, auth);
        };
    };
}
