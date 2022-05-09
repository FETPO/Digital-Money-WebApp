import React, {useCallback, useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {route} from "services/Http";
import {
    Box,
    Card,
    CardHeader,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import GiftcardThumbnail from "components/GiftcardThumbnail";
import CommonTable from "components/TableCells/CommonTable";
import Copyable from "components/Copyable";
import HelpIcon from "@mui/icons-material/Help";
import {useModal} from "utils/modal";

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
    stock: {defaultMessage: "Stock"},
    total: {defaultMessage: "Total"}
});

const Giftcards = () => {
    const [modal, modalElements] = useModal();
    const intl = useIntl();

    const showInstruction = useCallback(
        (content) => {
            modal.confirm({
                title: intl.formatMessage(messages.instruction),
                content: <Instruction content={content} />
            });
        },
        [intl, modal]
    );

    const columns = useMemo(
        () => [
            {
                field: "thumbnail",
                width: 80,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({row}) => (
                    <GiftcardThumbnail size={60} src={row.giftcard.thumbnail} />
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
                headerName: intl.formatMessage(messages.serial),
                renderCell: ({value}) => {
                    return (
                        <Stack direction="row" sx={{minWidth: 0}}>
                            <Copyable ellipsis>{value}</Copyable>
                        </Stack>
                    );
                }
            },
            {
                field: "code",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.code),
                renderCell: ({value}) => {
                    return (
                        <Stack direction="row" sx={{minWidth: 0}}>
                            <Copyable ellipsis>{value}</Copyable>
                        </Stack>
                    );
                }
            },
            {
                field: "bought_at",
                headerName: intl.formatMessage(messages.bought),
                width: 150,
                renderCell: CommonTable.date
            },
            {
                field: "action",
                width: 70,
                renderHeader: () => <span />,
                renderCell: ({row}) => {
                    return (
                        <IconButton
                            onClick={() => showInstruction(row.instruction)}>
                            <HelpIcon />
                        </IconButton>
                    );
                }
            }
        ],
        [intl, showInstruction]
    );

    const url = route("giftcard.content.paginate");

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Your Giftcards" />}
            />

            {modalElements}

            <TrapScrollBox sx={{mt: 3}}>
                <AsyncTable columns={columns} rowHeight={100} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

const Instruction = ({content}) => {
    return <Box sx={{mb: 2, whiteSpace: "pre-wrap"}}>{content}</Box>;
};

export default Giftcards;
