import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import DocumentDelete from "./components/DocumentDelete";
import DocumentEdit from "./components/DocumentEdit";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"},
    status: {defaultMessage: "Status"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"}
});

const Documents = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const searchFunc = useCallback((name) => {
        tableRef.current?.applySearch({name});
    }, []);

    const clearFunc = useCallback(() => {
        tableRef.current?.clearSearch();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const columns = useMemo(
        () => [
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description)
            },
            {
                field: "pending_count",
                width: 100,
                headerName: intl.formatMessage(messages.pending)
            },
            {
                field: "approved_count",
                width: 100,
                headerName: intl.formatMessage(messages.approved)
            },
            {
                field: "rejected_count",
                width: 100,
                headerName: intl.formatMessage(messages.rejected)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: document}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <DocumentDelete
                                reloadTable={reloadTable}
                                document={document}
                            />
                            <DocumentEdit
                                reloadTable={reloadTable}
                                document={document}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.required-document.paginate");

    return (
        <Card>
            <ActionBar
                reloadTable={reloadTable}
                onSearchChange={setSearch}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Documents;
