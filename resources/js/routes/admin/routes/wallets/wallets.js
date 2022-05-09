import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import fileList from "@iconify-icons/ri/file-list-2-fill";
import history from "@iconify-icons/ri/history-fill";
import percent from "@iconify-icons/ri/percent-fill";
import List from "./components/List";
import Transactions from "./components/Transactions";
import WithdrawalFee from "./components/WithdrawalFee";
import PageTabs from "components/PageTabs";
import ExchangeFee from "./components/ExchangeFee";

const messages = defineMessages({
    list: {defaultMessage: "List"},
    transactions: {defaultMessage: "Transactions"},
    withdrawalFee: {defaultMessage: "Withdrawal Fee"},
    exchangeFee: {defaultMessage: "Exchange Fee"},
    title: {defaultMessage: "Wallets"}
});

const Wallets = () => {
    const intl = useIntl();

    const tabs = useMemo(() => {
        return [
            {
                value: "list",
                label: intl.formatMessage(messages.list),
                icon: fileList,
                component: <List />
            },
            {
                value: "transactions",
                label: intl.formatMessage(messages.transactions),
                icon: history,
                component: <Transactions />
            },
            {
                value: "withdrawal-fee",
                label: intl.formatMessage(messages.withdrawalFee),
                icon: percent,
                component: <WithdrawalFee />
            },
            {
                value: "exchange-fee",
                label: intl.formatMessage(messages.exchangeFee),
                icon: percent,
                component: <ExchangeFee />
            }
        ];
    }, [intl]);

    return (
        <PageTabs
            initial="list"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Wallets;
