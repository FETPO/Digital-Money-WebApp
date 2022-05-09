import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import CancelIcon from "@mui/icons-material/Cancel";

const messages = defineMessages({
    success: {defaultMessage: "Trade was canceled."},
    confirm: {defaultMessage: "Are you sure?"}
});

const CancelPending = ({trade, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const cancelPending = useCallback(() => {
        const params = {trade: trade.id};
        request
            .patch(route("admin.exchange-trade.cancel-pending", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, trade, intl, reloadTable]);

    if (trade.status !== "pending") {
        return null;
    }

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={cancelPending}>
            <LoadingIcon
                component={CancelIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default CancelPending;
