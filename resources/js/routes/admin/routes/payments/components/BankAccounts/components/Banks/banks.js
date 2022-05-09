import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {route} from "services/Http";
import AsyncTable from "components/AsyncTable";
import TrapScrollBox from "components/TrapScrollBox";
import ActionBar from "./components/ActionBar";
import BankDelete from "./components/BankDelete";
import BankEdit from "./components/BankEdit";
import {Card, Chip, Stack, Typography} from "@mui/material";
import BankLogo from "components/BankLogo";

const messages = defineMessages({
    name: {defaultMessage: "Bank"},
    logo: {defaultMessage: "Logo"},
    countries: {defaultMessage: "Countries"},
    code: {defaultMessage: "Code"},
    banks: {defaultMessage: "Banks"}
});

const Banks = () => {
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
                field: "logo",
                width: 70,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <BankLogo src={value} />
            },
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "operating_countries",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.countries),
                renderCell: ({value: countries}) => {
                    if (countries?.length) {
                        const count = countries.length - 1;
                        const label = countries[0].name;

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
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: bank}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <BankDelete reloadTable={reloadTable} bank={bank} />
                            <BankEdit reloadTable={reloadTable} bank={bank} />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.bank.paginate");

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

export default Banks;
