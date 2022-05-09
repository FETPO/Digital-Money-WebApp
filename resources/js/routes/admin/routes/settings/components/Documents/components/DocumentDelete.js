import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    success: {defaultMessage: "Requirement was deleted."},
    confirm: {defaultMessage: "Are you sure?"}
});

const DocumentDelete = ({document, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteRequirement = useCallback(() => {
        const params = {document: document.id};
        request
            .delete(route("admin.required-document.delete", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, document, intl, reloadTable]);

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteRequirement}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default DocumentDelete;
