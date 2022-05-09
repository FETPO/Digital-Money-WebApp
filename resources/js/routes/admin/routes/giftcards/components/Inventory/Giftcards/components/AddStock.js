import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {InputAdornment, Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PasswordIcon from "@mui/icons-material/Password";

const messages = defineMessages({
    success: {defaultMessage: "Content was added."},
    code: {defaultMessage: "Code"},
    serial: {defaultMessage: "Serial"}
});

const AddStock = ({giftcard, closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const params = {giftcard: giftcard.id};
            const routeName = "admin.giftcard.content.create";
            formRequest
                .post(route(routeName, params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [giftcard, closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Stack spacing={2} sx={{mb: 3}}>
                <Form.Item
                    name="serial"
                    label={intl.formatMessage(messages.serial)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="code"
                    label={intl.formatMessage(messages.code)}
                    rules={[{required: true}]}>
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Form.Item>
            </Stack>

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

export default AddStock;
