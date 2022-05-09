import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {useSnackbar} from "notistack";
import MuiBootstrap from "components/MuiBootstrap";
import {Provider} from "react-redux";
import store from "../store";

const mountPoint = document.createElement("div");
document.body.appendChild(mountPoint);

const notify = {
    success(message, options) {
        this.toast(message, "success", options);
    },
    info(message, options) {
        this.toast(message, "info", options);
    },
    warning(message, options) {
        this.toast(message, "warning", options);
    },
    error(message, options) {
        this.toast(message, "error", options);
    },
    toast(message, variant = "default", options = {}) {
        const Display = () => {
            const {enqueueSnackbar} = useSnackbar();
            useEffect(() => {
                enqueueSnackbar(message, {
                    ...options,
                    variant
                });
            }, [enqueueSnackbar]);
            return null;
        };

        ReactDOM.render(
            <Provider store={store}>
                <MuiBootstrap>
                    <Display />
                </MuiBootstrap>
            </Provider>,
            mountPoint
        );
    }
};

export default notify;
