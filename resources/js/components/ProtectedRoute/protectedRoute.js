import React from "react";
import {Route} from "react-router-dom";
import {useAuth} from "models/Auth";
import {pipe} from "utils";
import PropTypes from "prop-types";

const ProtectedRoute = ({
    middleware = [],
    render,
    component,
    children: node,
    ...otherProps
}) => {
    const auth = useAuth();
    middleware = [].concat(middleware).reverse();
    const show = (n) => n;
    return (
        <Route {...otherProps}>{pipe(...middleware)(show)(node, auth)}</Route>
    );
};

ProtectedRoute.propTypes = {
    middleware: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.func),
        PropTypes.func
    ])
};

export default ProtectedRoute;
