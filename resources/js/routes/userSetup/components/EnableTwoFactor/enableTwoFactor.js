import React, {useCallback, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import QRCode from "qrcode.react";
import {useAuth} from "models/Auth";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {useDispatch} from "react-redux";
import {fetchUser} from "redux/slices/auth";
import EnableForm from "./components/EnableForm";
import {TwoFactorIllustration} from "assets/index";
import {LoadingButton} from "@mui/lab";
import {
    Alert,
    Box,
    Card,
    CardHeader,
    Chip,
    Divider,
    Grid,
    Typography,
    CardContent
} from "@mui/material";
import {experimentalStyled as styled} from "@mui/material/styles";
import Spin from "components/Spin";
import Result from "components/Result";
import Form from "components/Form";

const EnableTwoFactor = ({next}) => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const [form] = Form.useForm();
    const [secret, setSecret] = useState("");
    const [url, setUrl] = useState("");
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

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

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.set-two-factor"), values)
                .then(() => {
                    dispatch(fetchUser());
                })
                .catch(errorHandler());
        },
        [formRequest, dispatch]
    );

    const resetToken = useCallback(() => {
        request
            .post(route("user.reset-two-factor-token"))
            .then((data) => {
                setSecret(data.secret);
                setUrl(data.url);
            })
            .catch(errorHandler());
    }, [request]);

    return (
        <BaseStyle>
            {!auth.user.enabledTwoFactor() ? (
                <Spin spinning={loading}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    p: 3,
                                    textAlign: "center"
                                }}>
                                <CodeBox
                                    component={QRCode}
                                    value={url}
                                    renderAs="svg"
                                />

                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        textAlign: "center",
                                        color: "text.secondary",
                                        my: 2,
                                        mx: "auto"
                                    }}>
                                    <FormattedMessage defaultMessage="Scan this code with your preferred, authenticator app." />
                                </Typography>

                                <LoadingButton
                                    variant="outlined"
                                    onClick={resetToken}
                                    loading={loading}>
                                    <FormattedMessage defaultMessage="Reset Token" />
                                </LoadingButton>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card sx={{p: 3}}>
                                <Alert severity="info" sx={{mb: 2}}>
                                    <FormattedMessage defaultMessage="To enable multi-factor authentication with time-based one time password (TOTP) generation, register your mobile device:" />
                                </Alert>

                                <Typography paragraph>
                                    <FormattedMessage
                                        defaultMessage="Install an authenticator app such as {authy} or {google}"
                                        values={{
                                            google: <b>Google Authenticator</b>,
                                            authy: <b>Authy</b>
                                        }}
                                    />
                                </Typography>

                                <Divider sx={{my: 3}} />

                                <Typography paragraph gutterBottom>
                                    <FormattedMessage defaultMessage="Scan the barcode on the left hand side, or manually enter your secret token." />
                                </Typography>

                                <Typography
                                    paragraph
                                    variant="h4"
                                    align="center">
                                    {secret}
                                </Typography>

                                <Divider sx={{my: 3}}>
                                    <Chip
                                        label={
                                            <FormattedMessage defaultMessage="Verify" />
                                        }
                                    />
                                </Divider>

                                <Typography paragraph gutterBottom>
                                    <FormattedMessage defaultMessage="Enter the verification code generated on your authenticator app." />
                                </Typography>

                                <EnableForm
                                    loading={formLoading}
                                    onFinish={submitForm}
                                    form={form}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Spin>
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader
                                title={
                                    <FormattedMessage defaultMessage="Two Factor" />
                                }
                            />

                            <CardContent>
                                <Result
                                    title={
                                        <FormattedMessage defaultMessage="Two Factor Enabled!" />
                                    }
                                    description={
                                        <FormattedMessage defaultMessage="You have enabled two factor." />
                                    }
                                    icon={TwoFactorIllustration}
                                    extra={
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => next()}
                                            loading={loading}>
                                            <FormattedMessage defaultMessage="Next" />
                                        </LoadingButton>
                                    }
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </BaseStyle>
    );
};

const CodeBox = styled(Box)(({theme}) => ({
    maxWidth: "256px",
    width: "80%",
    height: "auto",
    margin: "auto",
    borderRadius: "5px",
    padding: theme.spacing(1),
    border: `1px dashed ${theme.palette.grey[500_32]}`
}));

const BaseStyle = styled("div")({});

export default EnableTwoFactor;
