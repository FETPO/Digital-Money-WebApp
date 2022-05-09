import React, {useEffect, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {useActiveWalletAccount} from "hooks/account";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {route} from "services/Http";
import {Card, CardHeader} from "@mui/material";
import AsyncTable from "components/AsyncTable";
import UserAvatar from "components/UserAvatar";
import CommonTable from "components/TableCells/CommonTable";
import ExchangeTable from "components/TableCells/ExchangeTable";
import TrapScrollBox from "components/TrapScrollBox";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    date: {defaultMessage: "Date"},
    coin: {defaultMessage: "Coin"},
    payment: {defaultMessage: "Payment"},
    wallet: {defaultMessage: "Wallet"},
    trader: {defaultMessage: "Trader"}
});

const Transaction = () => {
    const tableRef = useRef();
    const [filterAccount, setFilterAccount] = useState();
    const dispatch = useDispatch();
    const auth = useAuth();
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);
    const intl = useIntl();
    const account = useActiveWalletAccount();

    useEffect(() => {
        if (account.get("id")) {
            setFilterAccount(account.get("id"));
        } else {
            setFilterAccount();
        }
    }, [account]);

    useEffect(() => {
        const channel = "ExchangeTradeSaved";

        broadcast.listen(channel, (e) => {
            dispatch(fetchWalletAccounts());
            dispatch(fetchPaymentAccount());
            tableRef.current.fetchData();
        });
        return () => {
            broadcast.stopListening(channel);
        };
    }, [broadcast, dispatch]);

    const columns = useMemo(
        () => [
            {
                field: "created_at",
                width: 70,
                renderHeader: () => <span />,
                type: "dateTime",
                filterable: true,
                renderCell: CommonTable.compactDate
            },
            {
                field: "status",
                width: 100,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ExchangeTable.status
            },
            {
                field: "payment_value",
                headerName: intl.formatMessage(messages.payment),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ExchangeTable.payment
            },
            {
                field: "wallet_value",
                headerName: intl.formatMessage(messages.wallet),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ExchangeTable.wallet
            },
            {
                field: "trader",
                headerName: intl.formatMessage(messages.trader),
                width: 100,
                align: "center",
                renderCell: ({value: user}) => <UserAvatar user={user} />
            }
        ],
        [intl]
    );

    const url = useMemo(() => {
        tableRef.current?.resetPage();
        const name = "exchange-trade.paginate";
        return filterAccount
            ? route(name, {account: filterAccount})
            : route(name);
    }, [filterAccount]);

    return (
        <Card>
            <CardHeader title={intl.formatMessage(messages.transactions)} />

            <TrapScrollBox sx={{pt: 3}}>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Transaction;
