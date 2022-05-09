import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import React, {useCallback} from "react";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";

const messages = defineMessages({
    title: {defaultMessage: "Manage Locales"},
    name: {defaultMessage: "Name"},
    native: {defaultMessage: "Native"},
    code: {defaultMessage: "ISO-2 Code"},
    region: {defaultMessage: "Region"},
    addSuccess: {defaultMessage: "Locale was added."},
    importSuccess: {defaultMessage: "Import was successful."},
    removeSuccess: {defaultMessage: "Locale was removed."},
    addLocale: {defaultMessage: "Add Locale"},
    confirm: {defaultMessage: "Are you sure?"},
    selectGroup: {defaultMessage: "Select Group"},
    overwrite: {defaultMessage: "Overwrite"}
});

const LocaleDelete = ({locale, reloadTable}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const removeLocale = useCallback(() => {
        const values = {locale: locale.locale};
        request
            .post(route("admin.locale.remove"), values)
            .then(() => {
                notify.success(intl.formatMessage(messages.removeSuccess));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, locale, intl, reloadTable]);

    if (locale.locale === "en") {
        return null;
    }

    return (
        <PopConfirm
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={removeLocale}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default LocaleDelete;
