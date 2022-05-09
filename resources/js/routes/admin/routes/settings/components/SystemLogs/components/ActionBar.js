import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {errorHandler, route, useRequest} from "services/Http";
import BeenHereIcon from "@mui/icons-material/Beenhere";
import {notify} from "utils/index";

const messages = defineMessages({
    success: {defaultMessage: "Operation was successful."},
    searchPlaceholder: {defaultMessage: "Search message..."}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const markAllAsSeen = useCallback(() => {
        request
            .post(route("admin.system-logs.mark-all-as-seen"))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [intl, request, reloadTable]);

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />

            <Stack direction="row" alignItems="center" spacing={1}>
                <LoadingButton
                    variant="contained"
                    startIcon={<BeenHereIcon />}
                    sx={{whiteSpace: "nowrap"}}
                    loading={loading}
                    onClick={markAllAsSeen}>
                    <FormattedMessage defaultMessage="Mark As Seen" />
                </LoadingButton>
            </Stack>
        </StyledToolbar>
    );
};

export default ActionBar;
