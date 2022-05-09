import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    success: {defaultMessage: "Giftcard was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const GiftcardDelete = ({giftcard, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteGiftcard = useCallback(() => {
        const params = {giftcard: giftcard.id};
        const routeName = "admin.giftcard.delete";
        request
            .delete(route(routeName, params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, giftcard, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteGiftcard}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default GiftcardDelete;
