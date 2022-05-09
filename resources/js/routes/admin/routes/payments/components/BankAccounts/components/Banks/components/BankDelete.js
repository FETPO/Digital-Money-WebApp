import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    success: {defaultMessage: "Bank was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const BankDelete = ({bank, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const removeBank = useCallback(() => {
        const params = {bank: bank.id};
        const routeName = "admin.bank.delete";
        request
            .delete(route(routeName, params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, bank, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeBank}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default BankDelete;
