import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import OperatingCountryDelete from "./components/OperatingCountryDelete";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";

const messages = defineMessages({
    name: {defaultMessage: "Country"},
    code: {defaultMessage: "Code"},
    banks: {defaultMessage: "Banks"}
});

const OperatingCountries = () => {
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
                field: "code",
                width: 70,
                renderHeader: () => <span />
            },
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "banks_count",
                width: 100,
                headerName: intl.formatMessage(messages.banks)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: country}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <OperatingCountryDelete
                                reloadTable={reloadTable}
                                country={country}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.bank.operating-country.paginate");

    return (
        <Card>
            <ActionBar
                reloadTable={reloadTable}
                onSearchChange={setSearch}
                search={search}
            />

            <TrapScrollBox>
                <AsyncTable
                    ref={tableRef}
                    getRowId={(row) => row.code}
                    columns={columns}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default OperatingCountries;
