import React, {useEffect, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import IconBuilder from "components/IconBuilder";
import Coin from "models/Coin";
import AsyncTable from "components/AsyncTable";
import {route} from "services/Http";
import {useActiveWalletAccount} from "hooks/account";
import {get} from "lodash";
import {usePrivateBroadcast} from "services/Broadcast";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {Box, Card, CardHeader} from "@mui/material";
import CommonTable from "components/TableCells/CommonTable";
import WalletTable from "components/TableCells/WalletTable";
import TrapScrollBox from "components/TrapScrollBox";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    description: {defaultMessage: "Description"},
    date: {defaultMessage: "Date"},
    hash: {defaultMessage: "Hash"},
    transactionHash: {defaultMessage: "Transaction Hash"},
    coin: {defaultMessage: "Coin"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    value: {defaultMessage: "Value"}
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
        const channel = "TransferRecordSaved";

        broadcast.listen(channel, (e) => {
            if (get(e, "confirmed")) {
                dispatch(fetchWalletAccounts());
            }
            tableRef.current.fetchData();
        });
        return () => {
            broadcast.stopListening(channel);
        };
    }, [broadcast, dispatch]);

    const columns = useMemo(() => {
        return [
            {
                field: "created_at",
                width: 70,
                renderHeader: () => <span />,
                type: "dateTime",
                filterable: true,
                renderCell: CommonTable.compactDate
            },
            {
                field: "type",
                width: 30,
                renderHeader: () => <span />,
                align: "center",
                renderCell: WalletTable.status
            },
            {
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: WalletTable.value
            },
            {
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({row}) => {
                    const coin = Coin.use(row.coin);
                    return (
                        <Box
                            component={IconBuilder}
                            sx={{fontSize: 30}}
                            icon={coin.svgIcon()}
                        />
                    );
                }
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description),
                filterable: true,
                renderCell: WalletTable.description
            }
        ];
    }, [intl]);

    const url = useMemo(() => {
        tableRef.current?.resetPage();
        const name = "wallet.transfer-record-paginate";
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
