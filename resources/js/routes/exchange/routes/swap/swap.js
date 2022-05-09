import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Page from "components/Page";
import {Container, Grid} from "@mui/material";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";

const messages = defineMessages({
    title: {defaultMessage: "Swap"}
});

const Swap = () => {
    const intl = useIntl();
    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs />

                <Grid container spacing={3}></Grid>
            </Container>
        </Page>
    );
};

export default Swap;
