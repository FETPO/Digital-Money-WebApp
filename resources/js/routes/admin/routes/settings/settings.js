import React, {useMemo} from "react";
import PageTabs from "components/PageTabs";
import {defineMessages, useIntl} from "react-intl";
import settings from "@iconify-icons/ri/settings-3-fill";
import scales from "@iconify-icons/ri/scales-fill";
import fileText from "@iconify-icons/ri/file-text-fill";
import bug from "@iconify-icons/ri/bug-fill";
import Limits from "./components/Limits";
import Documents from "./components/Documents";
import SystemLogs from "./components/SystemLogs";
import General from "./components/General";

const messages = defineMessages({
    title: {defaultMessage: "Settings"},
    documents: {defaultMessage: "Documents"},
    limits: {defaultMessage: "Limits"},
    systemLogs: {defaultMessage: "System Logs"},
    general: {defaultMessage: "General"}
});

const Settings = () => {
    const intl = useIntl();

    const tabs = useMemo(() => {
        return [
            {
                value: "general",
                label: intl.formatMessage(messages.general),
                icon: settings,
                component: <General />
            },
            {
                value: "limits",
                label: intl.formatMessage(messages.limits),
                icon: scales,
                component: <Limits />
            },
            {
                value: "documents",
                label: intl.formatMessage(messages.documents),
                icon: fileText,
                component: <Documents />
            },
            {
                value: "system-logs",
                label: intl.formatMessage(messages.systemLogs),
                icon: bug,
                component: <SystemLogs />
            }
        ];
    }, [intl]);

    return (
        <PageTabs
            initial="limits"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Settings;
