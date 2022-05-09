import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, Card, Chip, Grid, Stack} from "@mui/material";
import StatisticCard from "./components/StatisticCard";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import LogMarkAsSeen from "./components/LogMarkAsSeen";
import CommonTable from "components/TableCells/CommonTable";
import Copyable from "components/Copyable";

const messages = defineMessages({
    date: {defaultMessage: "Date"},
    message: {defaultMessage: "Message"},
    level: {defaultMessage: "Level"}
});

const SystemLogs = () => {
    const tableRef = useRef();
    const intl = useIntl();
    const [search, setSearch] = useState();
    const [request, loading] = useRequest();
    const [data, setData] = useState({});

    const searchFunc = useCallback((message) => {
        tableRef.current?.applySearch({message});
    }, []);

    const clearFunc = useCallback(() => {
        tableRef.current?.clearSearch();
    }, []);

    useSearchDebounce(search, searchFunc, clearFunc);

    const fetchData = useCallback(() => {
        request
            .get(route("admin.statistics.system-status"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const reloadTable = useCallback(() => {
        fetchData();
        tableRef.current?.fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            {
                field: "level",
                width: 100,
                headerName: intl.formatMessage(messages.level),
                renderCell: ({value}) => {
                    return <Chip color={value} size="small" label={value} />;
                }
            },
            {
                field: "message",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.message),
                renderCell: ({row}) => {
                    return (
                        <Stack direction="row" sx={{minWidth: 0}}>
                            <Copyable ellipsis>{row.message}</Copyable>
                        </Stack>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                renderCell: CommonTable.date
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: log}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LogMarkAsSeen
                                reloadTable={reloadTable}
                                log={log}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.system-logs.paginate");

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="info"
                        value={data.info}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="warning"
                        value={data.warning}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="error"
                        value={data.error}
                    />
                </Grid>
            </Grid>

            <Card sx={{mt: 2}}>
                <ActionBar
                    reloadTable={reloadTable}
                    onSearchChange={setSearch}
                    search={search}
                />

                <TrapScrollBox>
                    <AsyncTable ref={tableRef} columns={columns} url={url} />
                </TrapScrollBox>
            </Card>
        </Box>
    );
};

export default SystemLogs;
