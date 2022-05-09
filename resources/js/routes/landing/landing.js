import React from "react";
import AnimatedSwitch from "components/AnimatedSwitch";
import {routePath, router} from "utils";
import {Link, Route, useRouteMatch} from "react-router-dom";
import FallbackRoute from "components/FallbackRoute";
import Result404 from "components/Result404";

const Landing = () => {
    const match = useRouteMatch();
    const basePath = routePath(match.path);

    return (
        <AnimatedSwitch>
            <Route exact path={basePath}>
                <Link to={router.getPath("auth.login")}>Login</Link>
            </Route>

            <FallbackRoute>
                <Result404 />
            </FallbackRoute>
        </AnimatedSwitch>
    );
};

export default Landing;
