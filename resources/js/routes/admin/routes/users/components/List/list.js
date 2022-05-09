import React, {useCallback, useMemo, useRef, useState} from "react";
import {Card, Checkbox, Chip, Stack, Typography} from "@mui/material";
import UserMenu from "./components/UserMenu";
import ActionBar from "./components/ActionBar";
import UserView from "./components/UserView";
import AsyncTable from "components/AsyncTable";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {route} from "services/Http";
import User from "models/User";
import {isEmpty, map, toLower} from "lodash";
import {parseDate} from "utils/form";
import FlagIcon from "components/FlagIcon";
import TrapScrollBox from "components/TrapScrollBox";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import CurrencyCell from "components/CurrencyCell";
import UserTable from "components/TableCells/UserTable";

const messages = defineMessages({
    status: {defaultMessage: "Status"},
    registered: {defaultMessage: "Joined"},
    location: {defaultMessage: "Location"},
    active: {defaultMessage: "Active"},
    suspended: {defaultMessage: "Deactivated"},
    payment: {defaultMessage: "Payment"}
});

const List = () => {
    const tableRef = useRef();
    const [search, setSearch] = useState();
    const [selection, setSelection] = useState([]);
    const [data, setData] = useState([]);
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

    const selectUser = useCallback((selected) => {
        setSelection((state) => {
            const selection = [...state];
            const index = selection.findIndex((v) => v === selected);
            if (index === -1) {
                selection.push(selected);
            } else {
                selection.splice(index, 1);
            }
            return selection;
        });
    }, []);

    const selectAllUsers = useCallback(
        (e) => {
            if (e.target.checked) {
                setSelection(map(data, "id"));
            } else {
                setSelection([]);
            }
        },
        [data]
    );

    const columns = useMemo(
        () => [
            {
                field: "id",
                width: 70,
                renderHeader: () => {
                    const selected = selection.length;
                    const total = data.length;
                    return (
                        <Checkbox
                            checked={total > 0 && selected === total}
                            indeterminate={selected > 0 && selected < total}
                            onChange={selectAllUsers}
                        />
                    );
                },
                renderCell: ({value}) => {
                    return (
                        <Checkbox
                            checked={selection.indexOf(value) !== -1}
                            onChange={() => selectUser(value)}
                        />
                    );
                }
            },
            {
                field: "name",
                minWidth: 200,
                flex: 1,
                renderHeader: () => <span />,
                renderCell: ({row: user}) => UserTable.render(user)
            },
            {
                field: "deactivated_until",
                headerName: intl.formatMessage(messages.status),
                width: 140,
                headerAlign: "center",
                align: "center",
                renderCell: ({row: data}) => {
                    const user = User.use(data);

                    if (!user.isActive()) {
                        const date = user.deactivatedUntil();
                        return (
                            <Stack alignItems="center" sx={{minWidth: 0}}>
                                <Chip
                                    color="warning"
                                    size="small"
                                    label={intl.formatMessage(
                                        messages.suspended
                                    )}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    <FormattedMessage
                                        defaultMessage="until: {date}"
                                        values={{date: date.fromNow()}}
                                    />
                                </Typography>
                            </Stack>
                        );
                    } else {
                        return (
                            <Chip
                                color="success"
                                size="small"
                                label={intl.formatMessage(messages.active)}
                            />
                        );
                    }
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.registered),
                width: 150,
                renderCell: ({row}) => {
                    const registered = parseDate(row.created_at);
                    const lastSeen = parseDate(row.last_seen_at);
                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography
                                variant="body2"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {registered.fromNow()}
                            </Typography>

                            {lastSeen.isValid() && (
                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    <FormattedMessage
                                        values={{date: lastSeen.fromNow()}}
                                        defaultMessage="Seen: {date}"
                                    />
                                </Typography>
                            )}
                        </Stack>
                    );
                }
            },
            {
                field: "location",
                headerName: intl.formatMessage(messages.location),
                flex: 0.5,
                minWidth: 150,
                renderCell: ({value: location}) =>
                    !isEmpty(location) && (
                        <Stack sx={{minWidth: 0}}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{minWidth: 0}}
                                spacing={1}>
                                <Typography variant="body2" noWrap>
                                    {location.ip}
                                </Typography>
                                {location.iso_code && (
                                    <FlagIcon
                                        code={toLower(location.iso_code)}
                                    />
                                )}
                            </Stack>

                            <Typography
                                variant="caption"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {`${location.state_name} (${location.iso_code})`}
                            </Typography>
                        </Stack>
                    )
            },
            {
                field: "currency",
                headerName: intl.formatMessage(messages.payment),
                flex: 0.5,
                minWidth: 170,
                renderCell: ({row}) => (
                    <CurrencyCell
                        currency={row.currency}
                        country={row.country}
                    />
                )
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                headerAlign: "right",
                renderCell: ({row: user}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <UserMenu user={user} reloadTable={reloadTable} />
                            <UserView user={user} />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable, selection, selectAllUsers, selectUser, data]
    );

    const url = route("admin.user.paginate");

    return (
        <Card>
            <ActionBar
                selection={selection}
                onSearchChange={setSearch}
                reloadTable={reloadTable}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable
                    ref={tableRef}
                    onDataChange={setData}
                    columns={columns}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default List;
