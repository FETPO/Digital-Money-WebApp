import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {Card, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import CommonTable from "components/TableCells/CommonTable";
import UserTable from "components/TableCells/UserTable";
import PaymentTable from "components/TableCells/PaymentTable";

const routeName = "admin.payment.transaction.paginate";

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

const Transactions = () => {
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

    const columns = useMemo(
        () => [
            {
                field: "account",
                width: 200,
                renderHeader: () => <span />,
                renderCell: ({value}) => UserTable.render(value.user)
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
            },
            {
                field: "formatted_balance",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.balance),
                type: "number",
                filterable: true,
                renderCell: ({value}) => {
                    return (
                        <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                            {value}
                        </Typography>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                renderCell: CommonTable.date
            }
        ],
        [intl]
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

export default Transactions;
