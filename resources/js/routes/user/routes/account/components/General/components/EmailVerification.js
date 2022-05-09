import React, {forwardRef, useCallback, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useDispatch} from "react-redux";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {fetchUser} from "redux/slices/auth";
import {notify} from "utils/index";
import Form from "components/Form";
import Spin from "components/Spin";
import {Box, Link, Stack, Typography} from "@mui/material";
import TokenInput from "components/TokenInput";
import {LoadingButton} from "@mui/lab";
import {fetchVerification} from "redux/slices/user";

const messages = defineMessages({
    tokenSent: {defaultMessage: "Token was sent."}
});

const EmailVerification = forwardRef(({email, closeModal}, ref) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();
    const intl = useIntl();
    const dispatch = useDispatch();

    const resendToken = useCallback(() => {
        request
            .post(route("token.send-email"))
            .then(() => {
                notify.success(intl.formatMessage(messages.tokenSent));
            })
            .catch(errorHandler());
    }, [request, intl]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.verify-email-with-token"), values)
                .then(() => {
                    dispatch(fetchUser());
                    dispatch(fetchVerification());
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [dispatch, closeModal, formRequest]
    );

    useEffect(() => {
        resendToken();
    }, [resendToken]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading} sx={{mt: 2}}>
                <Typography variant="h3" paragraph>
                    <FormattedMessage defaultMessage="Check your email." />
                </Typography>
                <Typography sx={{color: "text.secondary"}}>
                    <FormattedMessage
                        defaultMessage="We have sent a 6-digit confirmation code to {email}, please enter the code below."
                        values={{email: <b>{email}</b>}}
                    />
                </Typography>
                <Box sx={{mt: 5, mb: 3}}>
                    <Form.Item
                        name="token"
                        rules={[{required: true, type: "string", len: 6}]}>
                        <TokenInput />
                    </Form.Item>
                </Box>
                <Typography variant="body2" align="center">
                    <Box component="span" sx={{mr: 1}}>
                        <FormattedMessage defaultMessage="Don't have a code?" />
                    </Box>

                    <Link
                        variant="subtitle2"
                        sx={{cursor: "pointer"}}
                        underline="none"
                        onClick={resendToken}>
                        <FormattedMessage defaultMessage="Resend code" />
                    </Link>
                </Typography>
                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Verify" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
});

export default EmailVerification;
