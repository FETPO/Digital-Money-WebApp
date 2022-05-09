import React, {useCallback} from "react";
import {IconButton, Stack, Tooltip, Typography} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Form, {DateTimePicker} from "components/Form";
import {normalizeDates} from "utils/form";
import {LoadingButton} from "@mui/lab";
import {useModal} from "utils/modal";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";

const messages = defineMessages({
    searchPlaceholder: {defaultMessage: "Search name..."},
    batchDeactivate: {defaultMessage: "Deactivate Users"},
    activate: {defaultMessage: "Activate"},
    deactivate: {defaultMessage: "Deactivate"},
    deactivated: {defaultMessage: "Users were deactivated."},
    activated: {defaultMessage: "Users were activated."},
    until: {defaultMessage: "Until"}
});

const ActionBar = ({search, onSearchChange, selection, reloadTable}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();
    const [request] = useRequest();

    const batchActivate = useCallback(() => {
        const values = {users: selection};
        request
            .post(route("admin.user.batch-activate"), values)
            .then(() => {
                notify.success(intl.formatMessage(messages.activated));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, selection, intl, reloadTable]);

    const batchDeactivate = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.batchDeactivate),
            content: (
                <DeactivateUsers
                    reloadTable={reloadTable}
                    selection={selection}
                />
            )
        });
    }, [modal, selection, intl, reloadTable]);

    return (
        <StyledToolbar>
            {selection.length > 0 ? (
                <Typography component="div" variant="subtitle1">
                    <FormattedMessage
                        defaultMessage="{selection} selected"
                        values={{selection: <b>{selection.length}</b>}}
                    />
                </Typography>
            ) : (
                <SearchTextField
                    onSearchChange={onSearchChange}
                    search={search}
                    placeholder={intl.formatMessage(messages.searchPlaceholder)}
                />
            )}

            {modalElements}

            {selection.length > 0 && (
                <Stack direction="row" spacing={1}>
                    <Tooltip title={intl.formatMessage(messages.deactivate)}>
                        <IconButton onClick={batchDeactivate}>
                            <GavelIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage(messages.activate)}>
                        <IconButton onClick={batchActivate}>
                            <SettingsBackupRestoreIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )}
        </StyledToolbar>
    );
};

const DeactivateUsers = ({closeModal, selection, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            normalizeDates(values, ["date"]);
            values.users = selection;
            formRequest
                .post(route("admin.user.batch-deactivate"), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.deactivated));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, selection, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="date"
                label={intl.formatMessage(messages.until)}
                rules={[{required: true}]}>
                <DateTimePicker fullWidth />
            </Form.Item>

            <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default ActionBar;
