import {defaultTo} from "lodash";
import {createContext} from "react";

let value;

if (typeof window !== "undefined") {
    value = window.__APP__;
} else {
    value = defaultTo(context?.app, {});
}

export const AppContext = createContext(value);
export default value;
