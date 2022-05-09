import React from "react";
import widgets from "./widgets";
import ResponsiveWidgets from "components/ResponsiveWidgets";
import Page from "components/Page";
import {useIntl, defineMessages} from "react-intl";

const messages = defineMessages({title: {defaultMessage: "Home"}});

const Home = () => {
    const intl = useIntl();
    return (
        <Page title={intl.formatMessage(messages.title)}>
            <ResponsiveWidgets widgets={widgets} page="index.home" />
        </Page>
    );
};

export default Home;
