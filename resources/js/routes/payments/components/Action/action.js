import React, {useMemo, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useTheme} from "@mui/material/styles";
import {Tab, Tabs, Card, Box} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";

const messages = defineMessages({
    withdraw: {defaultMessage: "Withdraw"},
    deposit: {defaultMessage: "Deposit"}
});

const Action = () => {
    const theme = useTheme();
    const intl = useIntl();
    const [value, setValue] = useState(0);

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.withdraw),
                component: <Withdraw />
            },
            {
                label: intl.formatMessage(messages.deposit),
                component: <Deposit />
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
                disabled={true}
                onChangeIndex={(v) => setValue(v)}
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}>
                {tabContent}
            </SwipeableViews>
        </Card>
    );
};

export default Action;
