import React, {useCallback, useMemo, useRef, useState} from "react";
import {route} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import {Card, Stack, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import GiftcardThumbnail from "components/GiftcardThumbnail";
import CommonTable from "components/TableCells/CommonTable";
import UserTable from "components/TableCells/UserTable";

const messages = defineMessages({
    name: {defaultMessage: "Giftcard"},
    brand: {defaultMessage: "Brand"},
    title: {defaultMessage: "Title"},
    bought: {defaultMessage: "Bought At"},
    label: {defaultMessage: "Label"},
    description: {defaultMessage: "Description"},
    instruction: {defaultMessage: "Instruction"},
    price: {defaultMessage: "Price"},
    quantity: {defaultMessage: "Quantity"},
    serial: {defaultMessage: "Serial"},
    code: {defaultMessage: "Code"},
    value: {defaultMessage: "Value"},
    buyer: {defaultMessage: "Buyer"},
    total: {defaultMessage: "Total"}
});

const routeName = "admin.giftcard.content.purchased-paginate";

const Purchases = () => {
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
                field: "buyer",
                width: 200,
                headerName: intl.formatMessage(messages.buyer),
                renderCell: ({value: user}) => UserTable.render(user)
            },
            {
                field: "thumbnail",
                width: 70,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({row}) => (
                    <GiftcardThumbnail src={row.giftcard.thumbnail} />
                )
            },
            {
                field: "title",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.title),
                renderCell: ({row}) => {
                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography variant="subtitle2" noWrap>
                                {row.giftcard.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {row.giftcard.label}
                            </Typography>
                        </Stack>
                    );
                }
            },
            {
                field: "serial",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.serial)
            },
            {
                field: "bought_at",
                headerName: intl.formatMessage(messages.bought),
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

export default Purchases;
