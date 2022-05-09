import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import PageTabs from "components/PageTabs";
import dollarCircle from "@iconify-icons/ri/money-dollar-circle-fill";
import bank from "@iconify-icons/ri/bank-fill";
import exchangeDollar from "@iconify-icons/ri/exchange-dollar-line";
import sendPlane from "@iconify-icons/ri/send-plane-fill";
import Currencies from "./components/Currencies";
import BankAccounts from "./components/BankAccounts";
import history from "@iconify-icons/ri/history-fill";
import PendingTransfer from "./components/PendingTransfer";
import Transactions from "./components/Transactions";
import {useAuth} from "models/Auth";

const messages = defineMessages({
    currencies: {defaultMessage: "Currencies"},
    title: {defaultMessage: "Payments"},
    bankAccounts: {defaultMessage: "Bank Accounts"},
    withdrawals: {defaultMessage: "Withdrawals"},
    deposits: {defaultMessage: "Deposits"},
    transactions: {defaultMessage: "Transactions"}
});

const Payments = () => {
    const intl = useIntl();
    const auth = useAuth();

    const tabs = useMemo(() => {
        const stack = [
            {
                value: "currencies",
                label: intl.formatMessage(messages.currencies),
                icon: dollarCircle,
                component: <Currencies />
            }
        ];

        if (auth.can("manage_banks")) {
            stack.push({
                value: "bank-accounts",
                label: intl.formatMessage(messages.bankAccounts),
                icon: bank,
                component: <BankAccounts />
            });

            stack.push({
                value: "deposits",
                label: intl.formatMessage(messages.deposits),
                icon: exchangeDollar,
                component: <PendingTransfer type="receive" />
            });

            stack.push({
                value: "withdrawals",
                label: intl.formatMessage(messages.withdrawals),
                icon: sendPlane,
                component: <PendingTransfer type="send" />
            });
        }

        stack.push({
            value: "transactions",
            label: intl.formatMessage(messages.transactions),
            icon: history,
            component: <Transactions />
        });

        return stack;
    }, [intl, auth]);

    return (
        <PageTabs
            initial="currencies"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Payments;
