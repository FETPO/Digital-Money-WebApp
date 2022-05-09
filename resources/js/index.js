import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./store";
import Localization from "./localization";

import "scss/index.scss";

// lazy image
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "lazysizes/plugins/object-fit/ls.object-fit";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

// Wrap the rendering in a function:
const render = (Component) => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </Provider>,
        document.getElementById("root")
    );
};

render(Localization);

if (module.hot) {
    module.hot.accept("./localization", () => {
        render(Localization);
    });
    module.hot.accept("./store");
}
