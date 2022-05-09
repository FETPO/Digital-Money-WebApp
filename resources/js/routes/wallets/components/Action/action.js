import React, {useMemo, useState} from "react";
import Send from "./components/Send";
import Receive from "./components/Receive";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import {experimentalStyled as styled, useTheme} from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import {Box, Card, Stack, Tab, Tabs, Typography} from "@mui/material";

const messages = defineMessages({
    send: {defaultMessage: "Send"},
    receive: {defaultMessage: "Receive"}
});

const Action = () => {
    const [value, setValue] = useState(0);
    const intl = useIntl();
    const activeAccount = useActiveWalletAccount();
    const theme = useTheme();

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.send),
                component: <Send />
            },
            {
                label: intl.formatMessage(messages.receive),
                component: <Receive />
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

            {!activeAccount.isEmpty() && (
                <FooterStyle sx={{px: 2}}>
                    <Box sx={{display: "inline"}}>
                        <Stack
                            direction="row"
                            sx={{display: "inline-flex"}}
                            spacing={1}>
                            <Typography variant="body2" color="inherit">
                                {activeAccount.wallet.coin.symbol}
                            </Typography>
                            <Typography variant="body2" color="inherit">
                                <FormattedMessage defaultMessage="Balance" />
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{display: "inline"}}>
                        <Stack
                            direction="row"
                            sx={{display: "inline-flex"}}
                            divider={<span>&#8776;</span>}
                            spacing={2}>
                            <Typography variant="body2">
                                {activeAccount.available}
                            </Typography>
                            <Typography variant="body2">
                                {activeAccount.formatted_available_price}
                            </Typography>
                        </Stack>
                    </Box>
                </FooterStyle>
            )}
        </Card>
    );
};

const FooterStyle = styled("div")({
    display: "flex",
    justifyContent: "space-between"
});

export default Action;
