import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {CssBaseline} from "@mui/material";
import {
    alpha,
    createTheme,
    StyledEngineProvider,
    ThemeProvider
} from "@mui/material/styles";
import shadows, {customShadows} from "./shadows";
import useSettings from "../hooks/useSettings";
import shape from "./shape";
import typography from "./typography";
import GlobalStyles from "./globalStyles";
import componentsOverride from "./overrides";
import palette from "./palette";
import breakpoints from "./breakpoints";

function ThemeConfig({children}) {
    const {themeMode, themeDirection, activeColor} = useSettings();

    const themeOptions = useMemo(() => {
        const light = themeMode === "light";
        const basePalette = light ? palette.light : palette.dark;
        const baseShadows = light ? shadows.light : shadows.dark;
        const baseCustomShadows = light
            ? customShadows.light
            : customShadows.dark;

        return {
            palette: {...basePalette, primary: activeColor},
            typography,
            shape,
            direction: themeDirection,
            breakpoints,
            shadows: baseShadows,
            customShadows: {
                ...baseCustomShadows,
                primary: `0 8px 16px 0 ${alpha(activeColor.main, 0.24)}`
            }
        };
    }, [themeMode, activeColor, themeDirection]);

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

ThemeConfig.propTypes = {children: PropTypes.node};

export default ThemeConfig;
