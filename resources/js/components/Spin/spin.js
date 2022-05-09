import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {CircularProgress} from "@mui/material";

const BaseStyle = styled(({spinning, ...others}) => <div {...others} />)(
    ({theme, spinning}) => ({
        position: "relative",
        transition: "opacity 0.3s",
        clear: "both",
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            background: theme.palette.background.paper,
            zIndex: 10,
            width: "100%",
            height: "100%",
            display: spinning ? "block" : "none",
            opacity: spinning ? 0.5 : 0,
            transition: "all 0.3s",
            content: "''"
        },
        "& .spinner": {
            position: "absolute",
            top: 0,
            left: 0,
            display: spinning ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
        }
    })
);

const Spin = ({spinning, size, children, sx}) => {
    return (
        <BaseStyle spinning={spinning} sx={sx}>
            {children}
            <div className="spinner">
                <CircularProgress size={size} />
            </div>
        </BaseStyle>
    );
};

export default Spin;
