import PropTypes from "prop-types";
import React, {useEffect} from "react";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import {useTheme} from "@mui/material/styles";

function RtlLayout({children}) {
    const theme = useTheme();

    const cacheRtl = createCache({
        stylisPlugins: theme.direction === "rtl" ? [rtlPlugin] : [],
        key: theme.direction === "rtl" ? "rtl" : "css"
    });

    useEffect(() => {
        document.dir = theme.direction;
    }, [theme.direction]);

    cacheRtl.compat = true;

    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}

RtlLayout.propTypes = {children: PropTypes.node};

export default RtlLayout;
