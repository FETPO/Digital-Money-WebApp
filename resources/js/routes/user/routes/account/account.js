import React, {useMemo} from "react";
import PageTabs from "components/PageTabs";
import {defineMessages, useIntl} from "react-intl";
import roundAccountBox from "@iconify/icons-ic/round-account-box";
import roundFingerPrint from "@iconify/icons-ic/round-fingerprint";
import roundShield from "@iconify/icons-ic/round-shield";
import roundToggleOn from "@iconify/icons-ic/round-toggle-on";
import bankFill from "@iconify-icons/ri/bank-fill";
import BankAccounts from "./components/BankAccounts";
import General from "./components/General";
import Preference from "./components/Preference";
import Verification from "./components/Verification";
import Security from "./components/Security";

const messages = defineMessages({
    title: {defaultMessage: "User Account"},
    general: {defaultMessage: "General"},
    preferences: {defaultMessage: "Preferences"},
    bankAccounts: {defaultMessage: "Bank Accounts"},
    verification: {defaultMessage: "Verification"},
    security: {defaultMessage: "Security"}
});

const Account = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                value: "general",
                label: intl.formatMessage(messages.general),
                icon: roundAccountBox,
                component: <General />
            },
            {
                value: "preferences",
                label: intl.formatMessage(messages.preferences),
                icon: roundToggleOn,
                component: <Preference />
            },
            {
                value: "verification",
                label: intl.formatMessage(messages.verification),
                icon: roundFingerPrint,
                component: <Verification />
            },
            {
                value: "bank-accounts",
                label: intl.formatMessage(messages.bankAccounts),
                icon: bankFill,
                component: <BankAccounts />
            },
            {
                value: "security",
                label: intl.formatMessage(messages.security),
                icon: roundShield,
                component: <Security />
            }
        ],
        [intl]
    );

    return (
        <PageTabs
            initial="general"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Account;
