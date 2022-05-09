import React, {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useDispatch} from "react-redux";
import {Box, InputAdornment, Stack, Typography} from "@mui/material";
import {fetchUser} from "redux/slices/auth";
import {experimentalStyled as styled} from "@mui/material/styles";
import QRCode from "qrcode.react";
import Copyable from "components/Copyable";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {useAuth} from "models/Auth";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    token: {defaultMessage: "Token"},
    verifyWithToken: {defaultMessage: "Verify with token."},
    completeWithToken: {defaultMessage: "Complete with token."},
    password: {defaultMessage: "Password"}
});

const AddDevice = forwardRef(({closeModal}, ref) => {
    const [form] = Form.useForm();
    const auth = useAuth();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [url, setUrl] = useState("");
    const [secret, setSecret] = useState("");
    const intl = useIntl();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!auth.user.enabledTwoFactor()) {
            request
                .post(route("user.get-two-factor"))
                .then((data) => {
                    setSecret(data.secret);
                    setUrl(data.url);
                })
                .catch(errorHandler());
        }
    }, [auth, request]);

    const requestSecret = useCallback(
        (values) => {
            formRequest
                .post(route("user.get-two-factor"), values)
                .then((data) => {
                    form.resetFields();
                    setSecret(data.secret);
                    setUrl(data.url);
                })
                .catch(errorHandler());
        },
        [formRequest, form]
    );

    const confirmSecret = useCallback(
        (values) => {
            formRequest
                .post(route("user.set-two-factor"), values)
                .then(() => {
                    form.resetFields();
                    dispatch(fetchUser());
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [formRequest, form, dispatch, closeModal]
    );

    const loaded = useMemo(() => {
        return Boolean(url.length && secret.length);
    }, [secret, url]);

    return (
        <Form onFinish={loaded ? confirmSecret : requestSecret} form={form}>
            <Spin spinning={loading} sx={{mt: 2}}>
                {!loaded ? (
                    <Fragment>
                        <Typography variant="h5" paragraph>
                            <FormattedMessage defaultMessage="Verify your identity." />
                        </Typography>

                        <Box sx={{mt: 3}}>
                            <Form.Item
                                name="token"
                                label={intl.formatMessage(messages.token)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    placeholder={intl.formatMessage(
                                        messages.verifyWithToken
                                    )}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>
                        </Box>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Typography variant="h5" paragraph>
                            <FormattedMessage defaultMessage="Scan QR Code." />
                        </Typography>

                        <Box sx={{mt: 3, textAlign: "center"}}>
                            <CodeBox
                                component={QRCode}
                                value={url}
                                renderAs="svg"
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "text.secondary",
                                    textAlign: "center",
                                    my: 2,
                                    mx: "auto"
                                }}>
                                <FormattedMessage defaultMessage="Scan this code with your preferred, authenticator app." />
                            </Typography>

                            <Copyable
                                containerProps={{justifyContent: "center"}}
                                ellipsis>
                                {secret}
                            </Copyable>
                        </Box>

                        <Box sx={{mt: 3}}>
                            <Form.Item
                                name="token"
                                label={intl.formatMessage(messages.token)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    placeholder={intl.formatMessage(
                                        messages.completeWithToken
                                    )}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>
                        </Box>
                    </Fragment>
                )}
                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        {loaded ? (
                            <FormattedMessage defaultMessage="Confirm" />
                        ) : (
                            <FormattedMessage defaultMessage="Request" />
                        )}
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
});

const CodeBox = styled(Box)(({theme}) => ({
    maxWidth: "256px",
    width: "80%",
    height: "auto",
    margin: "auto",
    borderRadius: "5px",
    padding: theme.spacing(1),
    border: `1px dashed ${theme.palette.grey[500_32]}`
}));

export default AddDevice;
