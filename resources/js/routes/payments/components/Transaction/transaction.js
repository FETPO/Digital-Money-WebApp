import React, {useEffect, useMemo, useRef} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {fetchPaymentAccount} from "redux/slices/payment";
import {Card, CardHeader, Typography} from "@mui/material";
import {route} from "services/Http";
import AsyncTable from "components/AsyncTable";
import CommonTable from "components/TableCells/CommonTable";
import PaymentTable from "components/TableCells/PaymentTable";
import TrapScrollBox from "components/TrapScrollBox";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    status: {defaultMessage: "Status"},
    description: {defaultMessage: "Description"},
    date: {defaultMessage: "Date"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    value: {defaultMessage: "Value"}
});

const Transaction = () => {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const auth = useAuth();
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);
    const intl = useIntl();

    useEffect(() => {
        const channel = "PaymentTransactionSaved";

        broadcast.listen(channel, (e) => {
            if (e?.status === "completed") {
                dispatch(fetchPaymentAccount());
            }
            tableRef.current?.fetchData();
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
                renderCell: PaymentTable.status
            },
            {
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: PaymentTable.value
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description),
                filterable: true,
                renderCell: ({value}) => {
                    return (
                        <Typography variant="caption" noWrap>
                            {value}
                        </Typography>
                    );
                }
            }
        ];
    }, [intl]);

    const url = route("payment.transaction-paginate");

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
