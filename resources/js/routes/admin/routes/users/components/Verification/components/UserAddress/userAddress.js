import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import ActionBar from "../ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {Card, Chip, Stack, Typography} from "@mui/material";
import AddressView from "./components/AddressView";
import {parseDate} from "utils/form";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import UserTable from "components/TableCells/UserTable";

const messages = defineMessages({
    status: {defaultMessage: "Status"},
    user: {defaultMessage: "User"},
    address: {defaultMessage: "Address"},
    city: {defaultMessage: "City"},
    state: {defaultMessage: "State"},
    submitted: {defaultMessage: "Submitted"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"}
});

const routeName = "admin.user.verification.address-paginate";

const UserAddress = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const [url, setUrl] = useState(() => route(routeName));
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

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
                field: "user",
                width: 200,
                headerName: intl.formatMessage(messages.user),
                renderCell: ({value: user}) => UserTable.render(user)
            },
            {
                field: "address",
                minWidth: 200,
                headerName: intl.formatMessage(messages.address),
                flex: 1
            },
            {
                field: "state",
                minWidth: 150,
                headerName: intl.formatMessage(messages.state),
                flex: 0.5
            },
            {
                field: "status",
                headerName: intl.formatMessage(messages.status),
                width: 140,
                type: "singleSelect",
                valueOptions: ["pending", "approved", "rejected"],
                filterable: true,
                renderCell: ({value: status}) => {
                    switch (status) {
                        case "pending":
                            return (
                                <Chip
                                    color="info"
                                    size="small"
                                    label={intl.formatMessage(messages.pending)}
                                />
                            );
                        case "approved":
                            return (
                                <Chip
                                    color="success"
                                    size="small"
                                    label={intl.formatMessage(
                                        messages.approved
                                    )}
                                />
                            );
                        case "rejected":
                            return (
                                <Chip
                                    color="error"
                                    size="small"
                                    label={intl.formatMessage(
                                        messages.rejected
                                    )}
                                />
                            );
                    }
                }
            },
            {
                field: "updated_at",
                headerName: intl.formatMessage(messages.submitted),
                width: 150,
                renderCell: ({row}) => {
                    const submitted = parseDate(row.updated_at);
                    return (
                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary"}}
                            noWrap>
                            {submitted.fromNow()}
                        </Typography>
                    );
                }
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                headerAlign: "right",
                renderCell: ({row: address}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AddressView
                                reloadTable={reloadTable}
                                address={address}
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

export default UserAddress;
