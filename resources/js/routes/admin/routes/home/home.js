import React from "react";
import {defineMessages, useIntl} from "react-intl";
import ResponsiveWidgets from "components/ResponsiveWidgets";
import widgets from "./widgets";
import Page from "components/Page";

const messages = defineMessages({
    title: {defaultMessage: "Home"}
});

const Home = () => {
    const intl = useIntl();
    return (
        <Page title={intl.formatMessage(messages.title)}>
            <ResponsiveWidgets widgets={widgets} page="admin.home" />
        </Page>
    );
};

export default Home;
