import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import giftFill from "@iconify-icons/ri/gift-fill";
import Giftcards from "./components/Giftcards";
import PageTabs from "components/PageTabs";

const messages = defineMessages({
    title: {defaultMessage: "Your Purchases"},
    giftcards: {defaultMessage: "Giftcards"}
});

const Purchases = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                value: "giftcards",
                label: intl.formatMessage(messages.giftcards),
                icon: giftFill,
                component: <Giftcards />
            }
        ],
        [intl]
    );

    return (
        <PageTabs
            initial="giftcards"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Purchases;
