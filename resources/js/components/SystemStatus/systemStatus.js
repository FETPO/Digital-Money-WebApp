import React, {useCallback, useEffect, useMemo, useState} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {Box, Button, CardContent, Typography} from "@mui/material";
import {styled, useTheme} from "@mui/material/styles";
import {FormattedMessage} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";
import {SeoIllustration} from "assets/index";
import {router} from "utils/index";
import {Link as RouterLink} from "react-router-dom";

const SystemStatus = () => {
    const [data, setData] = useState({});
    const [request, loading] = useRequest();
    const theme = useTheme();

    const fetchData = useCallback(() => {
        request
            .get(route("admin.statistics.system-status"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const status = useMemo(() => {
        return ["error", "warning", "info"].reduce((status, level) => {
            return status || (data[level] > 0 && level);
        }, null);
    }, [data]);

    const color = useMemo(() => status || "success", [status]);

    const logsLocation = {
        pathname: router.generatePath("admin.settings"),
        state: {tab: "system-logs"}
    };

    return (
        <ResponsiveCard sx={{bgcolor: theme.palette[color].lighter}}>
            <Spin sx={{flexGrow: 1, height: "100%"}} spinning={loading}>
                <StyledBox>
                    <StyledCardContent
                        sx={{color: theme.palette[color].darker}}>
                        <Typography gutterBottom variant="h4">
                            {status ? (
                                <FormattedMessage defaultMessage="Your attention is needed!" />
                            ) : (
                                <FormattedMessage defaultMessage="All looks good!" />
                            )}
                        </Typography>

                        <Typography sx={{pb: 1}} variant="body2">
                            {status ? (
                                <FormattedMessage
                                    defaultMessage="There are a total of {logs} system logs that needs your immediate attention."
                                    values={{logs: <b>{data.total}</b>}}
                                />
                            ) : (
                                <FormattedMessage defaultMessage="You will be notified here of any system logs when available." />
                            )}
                        </Typography>

                        <Box sx={{flexGrow: 0.5}} />

                        <Box sx={{pt: 1}}>
                            <Button
                                variant="contained"
                                component={RouterLink}
                                color={color}
                                to={logsLocation}>
                                <FormattedMessage defaultMessage="Open Logs" />
                            </Button>
                        </Box>
                    </StyledCardContent>

                    <StyledIllustration color={color} />
                </StyledBox>
            </Spin>
        </ResponsiveCard>
    );
};

const StyledBox = styled(Box)(({theme}) => ({
    textAlign: "center",
    height: "100%",
    [theme.breakpoints.up("md")]: {
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }
}));

const StyledIllustration = styled(SeoIllustration)(({theme}) => ({
    height: "100%",
    maxWidth: "40%",
    minWidth: "150px",
    padding: theme.spacing(1),
    display: "flex",
    [theme.breakpoints.down("md")]: {display: "none"}
}));

const StyledCardContent = styled(CardContent)(({theme}) => ({
    "&:last-child": {padding: theme.spacing(0, 3)},
    [theme.breakpoints.up("md")]: {maxWidth: "60%"},
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center"
}));

SystemStatus.dimensions = {
    lg: {w: 6, h: 2, isResizable: false},
    md: {w: 4, h: 2, isResizable: false},
    sm: {w: 2, h: 2, isResizable: false},
    xs: {w: 1, h: 2, isResizable: false}
};

export default SystemStatus;
