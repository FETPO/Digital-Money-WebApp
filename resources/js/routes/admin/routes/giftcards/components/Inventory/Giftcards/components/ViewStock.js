import React, {useCallback, useMemo, useRef} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import CommonTable from "components/TableCells/CommonTable";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton, Stack} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    serial: {defaultMessage: "Serial"},
    success: {defaultMessage: "Content was removed."},
    confirm: {defaultMessage: "Are you sure?"},
    added: {defaultMessage: "Added"}
});

const ViewStock = ({giftcard}) => {
    const tableRef = useRef();
    const intl = useIntl();

    const reloadTable = useCallback(() => {
        tableRef.current?.fetchData();
    }, []);

    const columns = useMemo(
        () => [
            {
                field: "serial",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.serial)
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.added),
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
                renderCell: ({row: content}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <ContentDelete
                                giftcard={giftcard}
                                reloadTable={reloadTable}
                                content={content}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, giftcard, reloadTable]
    );

    const url = route("admin.giftcard.content.paginate", {
        giftcard: giftcard.id
    });

    return (
        <TrapScrollBox sx={{mx: -3}}>
            <AsyncTable ref={tableRef} columns={columns} url={url} />
        </TrapScrollBox>
    );
};

const ContentDelete = ({giftcard, content, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteContent = useCallback(() => {
        const params = {
            giftcard: giftcard.id,
            content: content.id
        };
        const routeName = "admin.giftcard.content.delete";
        request
            .delete(route(routeName, params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, giftcard, content, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteContent}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default ViewStock;
