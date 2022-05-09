import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Page from "components/Page";
import {Container, Grid} from "@mui/material";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import Action from "./components/Action";
import Transaction from "./components/Transaction";
import SelectAccount from "components/SelectAccount";

const messages = defineMessages({
    title: {defaultMessage: "Trades"}
});

const Trade = () => {
    const intl = useIntl();

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs action={<SelectAccount />} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Action />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Transaction />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Trade;
