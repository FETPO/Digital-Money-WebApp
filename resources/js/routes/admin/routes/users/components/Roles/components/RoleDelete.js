import React, {useCallback} from "react";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {defineMessages, useIntl} from "react-intl";
import PopConfirm from "components/PopConfirm";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import LoadingIcon from "components/LoadingIcon";

const messages = defineMessages({
    success: {defaultMessage: "Role was deleted."},
    confirm: {defaultMessage: "Are you sure?"}
});

const RoleDelete = ({role, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteRole = useCallback(() => {
        const params = {role: role.id};
        request
            .delete(route("admin.role.delete", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, role, intl, reloadTable]);

    if (role.protected) {
        return null;
    }

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteRole}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default RoleDelete;
