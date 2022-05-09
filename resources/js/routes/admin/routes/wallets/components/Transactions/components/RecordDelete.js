import React, {Fragment, useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Alert, IconButton, InputAdornment, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PopConfirm from "components/PopConfirm";
import {useModal} from "utils/modal";
import {errorHandler, route, useFormRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import Form, {TextField} from "components/Form";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {useAuth} from "models/Auth";

const messages = defineMessages({
    success: {defaultMessage: "Record was removed."},
    confirm: {defaultMessage: "Are you sure?"},
    confirmAction: {defaultMessage: "Confirm Action"},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const RecordDelete = ({record, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const deleteRecord = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.confirmAction),
            content: (
                <ConfirmAction reloadTable={reloadTable} record={record} />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, record, reloadTable]);

    if (!record.removable) {
        return null;
    }

    return (
        <Fragment>
            <PopConfirm
                {...props}
                component={IconButton}
                content={intl.formatMessage(messages.confirm)}
                onClick={deleteRecord}>
                <DeleteIcon color="error" />
            </PopConfirm>

            {modalElements}
        </Fragment>
    );
};

const ConfirmAction = ({record, reloadTable, closeModal}) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const auth = useAuth();
    const intl = useIntl();

    const submitForm = useCallback(
        (values) => {
            const params = {record: record.id};
            const routeName = "admin.wallet.transfer-record.remove";
            formRequest
                .post(route(routeName, params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable, record]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Stack spacing={2}>
                <Alert severity="error">
                    <FormattedMessage defaultMessage="You should ONLY remove a transaction if you are absolutely sure it did not go through. Check the address on the blockchain explorer before you proceed!" />
                </Alert>

                {auth.requireTwoFactor() ? (
                    <Form.Item
                        name="token"
                        label={intl.formatMessage(messages.token)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="password"
                        label={intl.formatMessage(messages.password)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            type="password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Remove Transfer" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default RecordDelete;
