import React, {useEffect, useMemo} from "react";
import NProgress from "nprogress";
import {experimentalStyled as styled} from "@mui/material/styles";
import {makeStyles} from "@mui/styles";
import {CircularProgress} from "@mui/material";

const nprogressStyle = makeStyles((theme) => ({
    "@global": {
        "#nprogress": {
            pointerEvents: "none",
            "& .bar": {
                top: 0,
                left: 0,
                height: 2,
                width: "100%",
                position: "fixed",
                zIndex: theme.zIndex.snackbar,
                backgroundColor: theme.palette.primary.main,
                boxShadow: `0 0 2px ${theme.palette.primary.main}`
            },
            "& .peg": {
                right: 0,
                opacity: 1,
                width: 100,
                height: "100%",
                display: "block",
                position: "absolute",
                transform: "rotate(3deg) translate(0px, -4px)",
                boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`
            }
        }
    }
}));

const BaseStyle = styled("div")(({theme}) => ({
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.default
}));

export default function LoadingScreen({...other}) {
    nprogressStyle();

    useMemo(() => {
        NProgress.start();
    }, []);

    useEffect(() => {
        NProgress.done();
    }, []);

    return (
        <BaseStyle {...other}>
            <CircularProgress />
        </BaseStyle>
    );
}
