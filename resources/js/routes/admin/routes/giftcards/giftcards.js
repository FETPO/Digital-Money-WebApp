import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import gift from "@iconify-icons/ri/gift-2-fill";
import Inventory from "./components/Inventory";
import PageTabs from "components/PageTabs";
import history from "@iconify-icons/ri/history-fill";
import Purchases from "./components/Purchases";

const messages = defineMessages({
    inventory: {defaultMessage: "Inventory"},
    purchases: {defaultMessage: "Purchases"},
    title: {defaultMessage: "Giftcards"}
});

const Giftcards = () => {
    const intl = useIntl();

    const tabs = useMemo(() => {
        return [
            {
                value: "inventory",
                label: intl.formatMessage(messages.inventory),
                icon: gift,
                component: <Inventory />
            },
            {
                value: "purchases",
                label: intl.formatMessage(messages.purchases),
                icon: history,
                component: <Purchases />
            }
        ];
    }, [intl]);

    return (
        <PageTabs
            initial="inventory"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Giftcards;
