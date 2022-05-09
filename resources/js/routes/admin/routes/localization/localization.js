import React, {useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import Page from "components/Page";
import ManageLocales from "./components/ManageLocales";
import ManageGroup from "./components/ManageGroup";

const messages = defineMessages({
    title: {defaultMessage: "Localization"}
});

const Localization = () => {
    const [group, setGroup] = useState();
    const intl = useIntl();
    return (
        <Page title={intl.formatMessage(messages.title)}>
            {group ? (
                <ManageGroup group={group} />
            ) : (
                <ManageLocales setGroup={setGroup} />
            )}
        </Page>
    );
};

export default Localization;
