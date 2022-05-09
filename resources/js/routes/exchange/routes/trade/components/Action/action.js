import React, {useMemo, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {defineMessages, useIntl} from "react-intl";
import Buy from "./components/Buy";
import Sell from "./components/Sell";
import {Box, Card, Tab, Tabs} from "@mui/material";
import SwipeableViews from "react-swipeable-views";

const messages = defineMessages({
    buy: {defaultMessage: "Buy"},
    sell: {defaultMessage: "Sell"}
});

const Action = () => {
    const theme = useTheme();
    const intl = useIntl();
    const [value, setValue] = useState(0);

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.buy),
                component: <Buy />
            },
            {
                label: intl.formatMessage(messages.sell),
                component: <Sell />
            }
        ],
        [intl]
    );

    const tabHeader = useMemo(
        () => tabs.map((tab, key) => <Tab key={key} label={tab.label} />),
        [tabs]
    );

    const tabContent = useMemo(
        () =>
            tabs.map((tab, key) => (
                <Box key={key} component="div">
                    {value === key && tab.component}
                </Box>
            )),
        [tabs, value]
    );

    return (
        <Card>
            <Tabs
                variant="fullWidth"
                onChange={(e, v) => setValue(v)}
                value={value}>
                {tabHeader}
            </Tabs>

            <SwipeableViews
                onChangeIndex={(v) => setValue(v)}
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}>
                {tabContent}
            </SwipeableViews>
        </Card>
    );
};

export default Action;
