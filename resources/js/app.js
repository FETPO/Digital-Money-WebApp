import React, {useEffect} from "react";
import Router from "./router";
import context, {AppContext} from "context";
import {isEmpty} from "lodash";
import {lazy, notify} from "./utils";
import {useLocation} from "react-router-dom";
import {useInstaller} from "hooks/settings";

const Installer = lazy(() =>
    import(/* webpackChunkName: 'installer' */ "./routes/installer")
);

const App = () => {
    const installer = useInstaller();

    useEffect(() => {
        const data = context.notification;
        if (!isEmpty(data) && data.message) {
            const type = data.type || "info";
            notify[type](data.message);
        }
    }, []);

    return (
        <AppContext.Provider value={context}>
            <ScrollToTop />
            {installer ? <Installer /> : <Router />}
        </AppContext.Provider>
    );
};

const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default App;
