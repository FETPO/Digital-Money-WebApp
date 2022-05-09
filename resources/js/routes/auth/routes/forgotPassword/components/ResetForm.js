import React, {useCallback} from "react";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify, router} from "utils/index";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {InputAdornment, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import PasswordIcon from "@mui/icons-material/Password";
import {passwordConfirmation} from "utils/form";
import {useHistory} from "react-router-dom";

const messages = defineMessages({
    resetSuccess: {defaultMessage: "Password was reset."},
    password: {defaultMessage: "Password"},
    confirmPassword: {defaultMessage: "Confirm Password"}
});

const ResetForm = ({token, email}) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();
    const history = useHistory();

    const submitForm = useCallback(
        (values) => {
            values.token = token;
            values.email = email;

            formRequest
                .post(route("auth.reset-password.reset"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.resetSuccess));
                    history.replace(router.generatePath("auth.login"));
                    window.location.reload();
                })
                .catch(errorHandler());
        },
        [intl, token, email, formRequest, history]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Typography variant="h3" paragraph>
                <FormattedMessage defaultMessage="Set your new password." />
            </Typography>

            <Typography sx={{color: "text.secondary", mb: 5}}>
                <FormattedMessage defaultMessage="Please set a strong and unique password." />
            </Typography>

            <Stack spacing={3}>
                <Form.Item
                    name="password"
                    label={intl.formatMessage(messages.password)}
                    rules={[{required: true}]}>
                    <TextField
                        type="password"
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

                <Form.Item
                    name="password_confirmation"
                    label={intl.formatMessage(messages.confirmPassword)}
                    dependencies={["password"]}
                    rules={[
                        passwordConfirmation(intl, "password"),
                        {required: true}
                    ]}>
                    <TextField
                        type="password"
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

                <LoadingButton
                    fullWidth
                    loading={formLoading}
                    type="submit"
                    variant="contained"
                    size="large">
                    <FormattedMessage defaultMessage="Reset Password" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default ResetForm;
