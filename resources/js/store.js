import {initAuthState} from "redux/slices/auth";
import createStore from "./redux/store";
import {initSettingsState} from "redux/slices/settings";

const store = createStore({
    auth: initAuthState(),
    settings: initSettingsState()
});

export default store;
