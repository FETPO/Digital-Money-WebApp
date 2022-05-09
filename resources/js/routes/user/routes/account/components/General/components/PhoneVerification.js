import React, {forwardRef, useCallback, useEffect} from "react";
import {Box, Link, Stack, Typography} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {useDispatch} from "react-redux";
import TokenInput from "components/TokenInput";
import {notify} from "utils/index";
import {fetchUser} from "redux/slices/auth";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {fetchVerification} from "redux/slices/user";

const messages = defineMessages({
    tokenSent: {defaultMessage: "Token was sent."}
});

const PhoneVerification = forwardRef(({phone, closeModal}, ref) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();
    const intl = useIntl();
    const dispatch = useDispatch();

    const resendToken = useCallback(() => {
        request
            .post(route("token.send-phone"))
            .then(() => {
                notify.success(intl.formatMessage(messages.tokenSent));
            })
            .catch(errorHandler());
    }, [request, intl]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.verify-phone-with-token"), values)
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
                    <FormattedMessage defaultMessage="Check your phone." />
                </Typography>
                <Typography sx={{color: "text.secondary"}}>
                    <FormattedMessage
                        defaultMessage="We have sent a 6-digit confirmation code to {phone}, please enter the code below."
                        values={{phone: <b>{phone}</b>}}
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

export default PhoneVerification;
