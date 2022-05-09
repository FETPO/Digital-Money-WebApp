import React, {useCallback, useMemo, useRef, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import BrandDelete from "./components/BrandDelete";
import BrandEdit from "./components/BrandEdit";

const messages = defineMessages({
    name: {defaultMessage: "Brand"},
    description: {defaultMessage: "Description"},
    giftcards: {defaultMessage: "Giftcards"}
});

const Brands = () => {
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
                flex: 0.5,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description)
            },
            {
                field: "giftcards_count",
                width: 100,
                headerName: intl.formatMessage(messages.giftcards)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: brand}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <BrandDelete
                                reloadTable={reloadTable}
                                brand={brand}
                            />
                            <BrandEdit
                                reloadTable={reloadTable}
                                brand={brand}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, reloadTable]
    );

    const url = route("admin.giftcard.brand.paginate");

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

export default Brands;
