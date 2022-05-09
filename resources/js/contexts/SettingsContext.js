import React, {createContext, useCallback, useState} from "react";
import PropTypes from "prop-types";
import palette from "../theme/palette";
import {useSelector} from "react-redux";
import {get} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import {useAuth} from "models/Auth";

const PRIMARY_COLOR = [
    // DEFAULT
    {
        name: "default",
        ...palette.light.primary
    },
    // PURPLE
    {
        name: "purple",
        lighter: "#EBD6FD",
        light: "#B985F4",
        main: "#7635dc",
        dark: "#431A9E",
        darker: "#200A69",
        contrastText: "#fff"
    },
    // CYAN
    {
        name: "cyan",
        lighter: "#D1FFFC",
        light: "#76F2FF",
        main: "#1CCAFF",
        dark: "#0E77B7",
        darker: "#053D7A",
        contrastText: palette.light.grey[800]
    },
    // BLUE
    {
        name: "blue",
        lighter: "#CCDFFF",
        light: "#6697FF",
        main: "#0045FF",
        dark: "#0027B7",
        darker: "#00137A",
        contrastText: "#fff"
    },
    // ORANGE
    {
        name: "orange",
        lighter: "#FEF4D4",
        light: "#FED680",
        main: "#fda92d",
        dark: "#B66816",
        darker: "#793908",
        contrastText: palette.light.grey[800]
    },
    // RED
    {
        name: "red",
        lighter: "#FFE3D5",
        light: "#FFC1AC",
        main: "#FF3030",
        dark: "#B71833",
        darker: "#7A0930",
        contrastText: "#fff"
    }
];

function getActiveColor(themeColor) {
    switch (themeColor) {
        case "purple":
            return PRIMARY_COLOR[1];
        case "cyan":
            return PRIMARY_COLOR[2];
        case "blue":
            return PRIMARY_COLOR[3];
        case "orange":
            return PRIMARY_COLOR[4];
        case "red":
            return PRIMARY_COLOR[5];
        default:
            return PRIMARY_COLOR[0];
    }
}

const initialState = {
    themeMode: "dark",
    themeDirection: "ltr",
    themeColor: "default",
    onChangeMode: () => {},
    onChangeDirection: () => {},
    onChangeColor: () => {},
    activeColor: PRIMARY_COLOR[0],
    colorOption: []
};

const SettingsContext = createContext(initialState);

function SettingsProvider({children}) {
    const auth = useAuth();
    const [request] = useRequest();

    const saved = useSelector((state) => {
        return get(state, "settings.theme");
    });

    const [settings, setSettings] = useState({
        themeMode: saved.mode,
        themeDirection: saved.direction,
        themeColor: saved.color
    });

    const saveSettings = useCallback(
        (routeName, value) => {
            if (auth.can("manage_customization")) {
                request.post(route(routeName), {value}).catch(errorHandler());
            }
        },
        [auth, request]
    );

    const onChangeMode = (event) => {
        saveSettings("admin.theme.set-mode", event.target.value);

        setSettings((settings) => ({
            ...settings,
            themeMode: event.target.value
        }));
    };

    const onChangeDirection = (event) => {
        saveSettings("admin.theme.set-direction", event.target.value);

        setSettings((settings) => ({
            ...settings,
            themeDirection: event.target.value
        }));
    };

    const onChangeColor = (event) => {
        saveSettings("admin.theme.set-color", event.target.value);

        setSettings((settings) => ({
            ...settings,
            themeColor: event.target.value
        }));
    };

    return (
        <SettingsContext.Provider
            value={{
                ...settings,
                onChangeMode,
                onChangeDirection,
                onChangeColor,
                activeColor: getActiveColor(settings.themeColor),
                colorOption: PRIMARY_COLOR.map((color) => ({
                    name: color.name,
                    value: color.main
                }))
            }}>
            {children}
        </SettingsContext.Provider>
    );
}

SettingsProvider.propTypes = {children: PropTypes.node};

export {SettingsProvider, SettingsContext};
