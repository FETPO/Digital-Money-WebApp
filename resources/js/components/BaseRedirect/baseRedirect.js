import React from "react";
import Redirect from "../Redirect";
import {routePath} from "../../utils";
import {useRouteMatch} from "react-router-dom";

const BaseRedirect = (props) => {
    const match = useRouteMatch();
    return (
        <Redirect exact status={301} {...props} from={routePath(match.path)} />
    );
};

export default BaseRedirect;
