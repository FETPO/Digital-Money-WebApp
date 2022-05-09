import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    success: {defaultMessage: "Country was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const OperatingCountryDelete = ({country, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const removeCountry = useCallback(() => {
        const params = {country: country.code};
        const routeName = "admin.bank.operating-country.delete";
        request
            .delete(route(routeName, params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, country, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeCountry}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default OperatingCountryDelete;
