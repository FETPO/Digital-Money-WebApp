import React, {useEffect, useMemo, useRef} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Box, CardHeader} from "@mui/material";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {get} from "lodash";
import {fetchWalletAccounts} from "redux/slices/wallet";
import CommonTable from "../TableCells/CommonTable";
import WalletTable from "../TableCells/WalletTable";
import Coin from "models/Coin";
import IconBuilder from "../IconBuilder";
import {route} from "services/Http";
import AsyncTable from "../AsyncTable";
import TrapScrollBox from "../TrapScrollBox";

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

const RecentTransaction = () => {
    const tableRef = useRef();
    const auth = useAuth();
    const dispatch = useDispatch();
    const intl = useIntl();
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);

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
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: WalletTable.value
            },
            {
                field: "type",
                width: 30,
                renderHeader: () => <span />,
                align: "center",
                renderCell: WalletTable.status
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description),
                filterable: true,
                renderCell: WalletTable.description
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                type: "dateTime",
                filterable: true,
                renderCell: CommonTable.date
            }
        ];
    }, [intl]);

    const url = route("wallet.transfer-record-paginate");

    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Recent Transaction" />}
            />

            <TrapScrollBox sx={{pt: 3, flexGrow: 1}}>
                <AsyncTable
                    ref={tableRef}
                    columns={columns}
                    autoHeight={false}
                    url={url}
                />
            </TrapScrollBox>
        </ResponsiveCard>
    );
};

RecentTransaction.dimensions = {
    lg: {w: 6, h: 4, isResizable: false},
    md: {w: 4, h: 4, isResizable: false},
    sm: {w: 2, h: 4, isResizable: false},
    xs: {w: 1, h: 4, isResizable: false}
};

export default RecentTransaction;
