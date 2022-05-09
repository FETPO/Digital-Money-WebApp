import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";
import LoadingIcon from "components/LoadingIcon";

const messages = defineMessages({
    success: {defaultMessage: "Currency was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const CurrencyDelete = ({currency, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const removeCurrency = useCallback(() => {
        const params = {currency: currency.code};
        request
            .delete(route("admin.payment.supported-currency.delete", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, currency, intl, reloadTable]);

    if (currency.default) {
        return null;
    }

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeCurrency}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default CurrencyDelete;
