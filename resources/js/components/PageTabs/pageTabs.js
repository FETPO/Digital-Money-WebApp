import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Page from "components/Page";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {Box, Container, Stack, Tab, Tabs, useMediaQuery} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import {useTheme} from "@mui/material/styles";
import {useLocation} from "react-router-dom";
import {isString, isNumber} from "lodash";
import {Icon} from "@iconify/react";
import useSessionStorage from "hooks/useSessionStorage";

const PageTabs = ({initial, tabs, title}) => {
    const location = useLocation();
    const theme = useTheme();
    const storageKey = `tab.${location.pathname}`;
    const upSm = useMediaQuery(theme.breakpoints.up("sm"));
    const [current, setCurrent] = useSessionStorage(storageKey, initial);
    const [height, setHeight] = useState(0);
    const [resetKey, setResetKey] = useState(0);
    const currentRef = useRef();

    const viewIndex = useMemo(() => {
        return tabs.findIndex((tab) => tab.value === current);
    }, [tabs, current]);

    const onChangeViewIndex = useCallback(
        (index) => {
            setCurrent(tabs[index]?.value || initial);
        },
        [tabs, initial, setCurrent]
    );

    const handleChangeTab = useCallback(
        (event, value) => {
            setCurrent(value);
        },
        [setCurrent]
    );

    const calculateHeight = useCallback(() => {
        if (isNumber(resetKey) && currentRef.current) {
            setHeight(currentRef.current.clientHeight);
        }
    }, [resetKey]);

    useEffect(() => {
        calculateHeight();
    }, [calculateHeight]);

    useEffect(() => {
        if (isString(location.state?.tab)) {
            const i = tabs.findIndex((tab) => tab.value === location.state.tab);
            onChangeViewIndex(i < 0 ? 0 : i);
        }
    }, [location, tabs, onChangeViewIndex]);

    const ySpacing = 4;
    const xSpacing = upSm ? 3 : 2;

    const tabHeader = useMemo(
        () =>
            tabs.map((tab) => (
                <Tab
                    key={tab.value}
                    value={tab.value}
                    icon={<Icon width={20} icon={tab.icon} height={20} />}
                    label={tab.label}
                    disableRipple
                />
            )),
        [tabs]
    );

    const tabContent = useMemo(
        () =>
            tabs.map((tab) => {
                const selected = current === tab.value;
                return (
                    <Box
                        key={tab.value}
                        ref={!selected ? null : currentRef}
                        sx={{
                            py: ySpacing,
                            height: selected ? "auto" : height,
                            overflow: "hidden",
                            px: xSpacing
                        }}>
                        {tab.component}
                    </Box>
                );
            }),
        [tabs, ySpacing, xSpacing, current, height]
    );

    return (
        <Page title={title}>
            <Container>
                <HeaderBreadcrumbs />

                <Stack spacing={1}>
                    <Tabs
                        value={current}
                        allowScrollButtonsMobile
                        scrollButtons="auto"
                        onChange={handleChangeTab}
                        variant="scrollable">
                        {tabHeader}
                    </Tabs>

                    <Box sx={{py: ySpacing}}>
                        <SwipeableViews
                            index={viewIndex}
                            onChangeIndex={onChangeViewIndex}
                            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                            onTransitionEnd={() => setResetKey((k) => k + 1)}
                            style={{
                                margin: theme.spacing(-ySpacing, -xSpacing)
                            }}
                            containerStyle={{alignItems: "flex-start"}}
                            // ignoreNativeScroll={true}
                            // animateTransitions={false}
                            // disableLazyLoading={true}
                            slideStyle={{overflow: "visible"}}>
                            {tabContent}
                        </SwipeableViews>
                    </Box>
                </Stack>
            </Container>
        </Page>
    );
};

export default PageTabs;
