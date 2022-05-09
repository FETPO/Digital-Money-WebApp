import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";

const messages = defineMessages({
    success: {defaultMessage: "Brand was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const BrandDelete = ({brand, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteBrand = useCallback(() => {
        const params = {brand: brand.id};
        const routeName = "admin.giftcard.brand.delete";
        request
            .delete(route(routeName, params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, brand, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteBrand}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default BrandDelete;
