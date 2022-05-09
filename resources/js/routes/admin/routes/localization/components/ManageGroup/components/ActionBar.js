import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import React, {useCallback} from "react";
import {notify} from "utils/index";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    searchPlaceholder: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    locales: {defaultMessage: "Locales"},
    editTranslation: {defaultMessage: "Edit Translation"}
});

const ActionBar = ({changed, group, search, onSearchChange, reloadTable}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const publish = useCallback(() => {
        request
            .post(route("admin.locale.group.export", {group}))
            .then(() => {
                notify.success(intl.formatMessage(messages.publishSuccess));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, reloadTable, intl, group]);

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />

            <Stack direction="row" alignItems="center" spacing={1}>
                {changed > 0 && (
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        sx={{whiteSpace: "nowrap"}}
                        onClick={publish}>
                        <FormattedMessage defaultMessage="Publish" />
                    </LoadingButton>
                )}
            </Stack>
        </StyledToolbar>
    );
};

export default ActionBar;
