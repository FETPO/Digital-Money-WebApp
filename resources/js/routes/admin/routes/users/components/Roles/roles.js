import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {lowerCase} from "lodash";
import {route} from "services/Http";
import {Card, Chip, Stack, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import RoleDelete from "./components/RoleDelete";
import RoleEdit from "./components/RoleEdit";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {useSearchDebounce} from "hooks/useSearchDebounce";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    permissions: {defaultMessage: "Permissions"},
    rank: {defaultMessage: "Rank"},
    users: {defaultMessage: "Users"}
});

const Roles = () => {
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
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "permissions",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.permissions),
                renderCell: ({value: permissions}) => {
                    if (permissions?.length) {
                        const label = lowerCase(permissions[0].name);
                        const count = permissions.length - 1;

                        return count > 0 ? (
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}>
                                <Chip label={label} size="small" />
                                <Typography
                                    sx={{color: "text.secondary"}}
                                    variant="caption">
                                    +{count}
                                </Typography>
                            </Stack>
                        ) : (
                            <Chip label={label} size="small" />
                        );
                    }
                }
            },
            {
                field: "rank",
                width: 100,
                headerName: intl.formatMessage(messages.rank)
            },
            {
                field: "users_count",
                width: 100,
                headerName: intl.formatMessage(messages.users)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: role}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <RoleDelete role={role} reloadTable={reloadTable} />
                            <RoleEdit role={role} reloadTable={reloadTable} />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.role.paginate");

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

export default Roles;
