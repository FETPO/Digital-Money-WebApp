import React, {useCallback} from "react";
import {Box, Button, Link, Stack, Typography} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form from "components/Form";
import TokenInput from "components/TokenInput";
import {LoadingButton} from "@mui/lab";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";

const messages = defineMessages({
    emailVerified: {defaultMessage: "Email verified."}
});

const RequestToken = ({onReset, setToken, email}) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const submitForm = useCallback(
        (values) => {
            values.email = email;
            formRequest
                .post(route("auth.reset-password.request-token"), values)
                .then((data) => {
                    notify.success(intl.formatMessage(messages.emailVerified));
                    setToken?.(data.token);
                })
                .catch(errorHandler());
        },
        [intl, formRequest, email, setToken]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Button
                onClick={onReset}
                startIcon={<ArrowBackIosIcon />}
                size="small"
                sx={{mb: 3}}>
                <FormattedMessage defaultMessage="Back" />
            </Button>

            <Typography variant="h3" paragraph>
                <FormattedMessage defaultMessage="Please check your email." />
            </Typography>

            <Typography sx={{color: "text.secondary"}}>
                <FormattedMessage defaultMessage="We have sent a 6-digit confirmation code to the provided email, please enter the code below." />
            </Typography>

            <Stack spacing={3} sx={{mt: 5}}>
                <Form.Item
                    name="code"
                    rules={[{required: true, type: "string", len: 6}]}>
                    <TokenInput />
                </Form.Item>

                <LoadingButton
                    fullWidth
                    size="large"
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Verify Code" />
                </LoadingButton>
            </Stack>

            <Typography variant="body2" sx={{mt: 2}} align="center">
                <Box component="span" sx={{mr: 1}}>
                    <FormattedMessage defaultMessage="Don't have a code?" />
                </Box>

                <Link
                    variant="subtitle2"
                    sx={{cursor: "pointer"}}
                    underline="none"
                    onClick={onReset}>
                    <FormattedMessage defaultMessage="Resend code" />
                </Link>
            </Typography>
        </Form>
    );
};

export default RequestToken;
