import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import UserTable from "components/TableCells/UserTable";
import CommonTable from "components/TableCells/CommonTable";
import ExchangeTable from "components/TableCells/ExchangeTable";
import CancelPending from "./components/CancelPending";
import CompletePending from "./components/CompletePending";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    created: {defaultMessage: "Created"},
    completed: {defaultMessage: "Completed"},
    title: {defaultMessage: "Title"},
    date: {defaultMessage: "Date"},
    coin: {defaultMessage: "Coin"},
    payment: {defaultMessage: "Payment"},
    wallet: {defaultMessage: "Wallet"},
    trader: {defaultMessage: "Trader"},
    operator: {defaultMessage: "Operator"}
});

const routeName = "admin.exchange-trade.paginate";

const Trade = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const [url, setUrl] = useState(() => route(routeName));
    const intl = useIntl();

    const searchFunc = useCallback((searchUser) => {
        setUrl(route(routeName, {searchUser}));
        tableRef.current?.resetPage();
    }, []);

    const clearFunc = useCallback(() => {
        setUrl(route(routeName));
        tableRef.current?.resetPage();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                field: "wallet_account",
                width: 200,
                renderHeader: () => <span />,
                renderCell: ({value}) => UserTable.render(value.user)
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
                minWidth: 120,
                flex: 0.5,
                filterable: true,
                renderCell: ExchangeTable.payment
            },
            {
                field: "wallet_value",
                headerName: intl.formatMessage(messages.wallet),
                type: "number",
                minWidth: 120,
                flex: 0.5,
                filterable: true,
                renderCell: ExchangeTable.wallet
            },
            {
                field: "trader",
                headerName: intl.formatMessage(messages.trader),
                width: 200,
                renderCell: ({value}) => UserTable.render(value)
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.created),
                width: 150,
                renderCell: CommonTable.date
            },
            {
                field: "completed_at",
                headerName: intl.formatMessage(messages.completed),
                width: 150,
                renderCell: (data) => {
                    const {row: trade} = data;

                    if (trade.status === "completed") {
                        return CommonTable.date(data);
                    }

                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CompletePending
                                reloadTable={reloadTable}
                                trade={trade}
                            />
                            <CancelPending
                                reloadTable={reloadTable}
                                trade={trade}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    return (
        <Card>
            <ActionBar onSearchChange={setSearch} search={search} />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Trade;
