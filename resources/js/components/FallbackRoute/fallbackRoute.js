import React from "react";
import {Route, useRouteMatch} from "react-router-dom";
import {routePath} from "utils";

const FallbackRoute = ({
    path,
    component: Component,
    children,
    ...otherProps
}) => {
    const match = useRouteMatch();
    const basePath = routePath(match.path);
    return (
        <Route {...otherProps} path={basePath}>
            {Component ? <Component /> : children}
        </Route>
    );
};

export default FallbackRoute;
