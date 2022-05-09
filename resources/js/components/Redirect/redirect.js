import React from "react";
import {
    matchPath,
    Redirect as RouterRedirect,
    Route,
    withRouter
} from "react-router-dom";

/**
 * @return {null}
 */
function Redirect({from, to, exact, strict, status, location}) {
    const {pathname} = location;

    if (typeof from !== "undefined") {
        const match = matchPath(pathname, {exact, path: from, strict});

        if (match === null) {
            return null;
        }
    }

    return (
        <Route
            render={({staticContext}) => {
                if (staticContext) {
                    staticContext.status = status ? status : 302;
                }

                return (
                    <RouterRedirect
                        from={from}
                        strict={strict}
                        exact={exact}
                        to={to}
                    />
                );
            }}
        />
    );
}

export default withRouter(Redirect);
