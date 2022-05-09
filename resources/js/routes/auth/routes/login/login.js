import React, {Fragment, useCallback, useRef, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Link as RouterLink} from "react-router-dom";
import {notify, router} from "utils";
import {useAuth} from "models/Auth";
import {errorHandler, route, useFormRequest} from "services/Http";
import {
    Box,
    Checkbox,
    Container,
    InputAdornment,
    Link,
    Stack,
    Typography
} from "@mui/material";
import {has, upperFirst} from "lodash";
import Form, {ControlLabel, TextField} from "components/Form";
import ReCaptcha, {recaptchaSubmit} from "components/ReCaptcha";
import {ContentStyle, SectionCard, StyledPage} from "layouts/Auth/auth.style";
import HintLayout from "layouts/Auth/components/HintLayout";
import {MHidden} from "components/@material-extend";
import illustrationLogin from "static/login-illustration.png";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import {LoadingButton} from "@mui/lab";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import LockIcon from "@mui/icons-material/Lock";
import Typewriter from "typewriter-effect";
import context from "context";
import {useRecaptcha} from "hooks/settings";

const messages = defineMessages({
    username: {defaultMessage: "Username"},
    email: {defaultMessage: "Email"},
    password: {defaultMessage: "Password"},
    tokenTitle: {defaultMessage: "Two Factor Verification"},
    token: {defaultMessage: "Token"},
    success: {defaultMessage: "Login was successful."},
    rememberMe: {defaultMessage: "Remember me"},
    lineOne: {defaultMessage: "Start your Crypto Portfolio today!"},
    lineTwo: {defaultMessage: "Buy & Sell Crypto with Credit Card"},
    lineThree: {defaultMessage: "Get paid instantly via Bank Transfer"},
    lineFour: {defaultMessage: "Buy Giftcards with Crypto"},
    lineFive: {defaultMessage: "... and many more to come!"},
    title: {defaultMessage: "Login"}
});

const Login = () => {
    const [form] = Form.useForm();
    const [withToken, setWithToken] = useState(false);
    const [request, loading] = useFormRequest(form);
    const auth = useAuth();
    const recaptchaRef = useRef();
    const intl = useIntl();

    const recaptcha = useRecaptcha();

    const submitForm = useCallback(
        (values) => {
            request
                .post(route("auth.login"), values)
                .then((data) => {
                    notify.success(intl.formatMessage(messages.success));

                    if (data.intended) {
                        window.location.replace(data.intended);
                    } else {
                        window.location.reload();
                    }
                })
                .catch(
                    errorHandler((e) => {
                        if (has(e, "response.data.errors.token")) {
                            setWithToken(true);
                        }
                    })
                );
        },
        [request, intl]
    );

    const onSubmit = recaptchaSubmit(form, recaptchaRef);

    const tokenInput = (
        <Fragment>
            <Divider>
                <Chip label={intl.formatMessage(messages.tokenTitle)} />
            </Divider>

            <Form.Item
                name="token"
                rules={[{required: true}]}
                label={intl.formatMessage(messages.token)}>
                <TextField
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Form.Item>
        </Fragment>
    );

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <HintLayout>
                <FormattedMessage defaultMessage="Don't have an account?" />
                <Link
                    underline="none"
                    component={RouterLink}
                    variant="subtitle2"
                    to={router.generatePath("auth.register")}
                    sx={{ml: 1}}>
                    <FormattedMessage defaultMessage="Get started" />
                </Link>
            </HintLayout>

            <MHidden width="mdDown">
                <SectionCard>
                    <Stack sx={{p: 1, mb: 5}}>
                        <Typography variant="body2">
                            <FormattedMessage defaultMessage="Hi, welcome back." />
                        </Typography>

                        <Typography
                            sx={{minHeight: 100, fontWeight: 600}}
                            variant="h3">
                            <Typewriter
                                options={{
                                    strings: [
                                        intl.formatMessage(messages.lineOne),
                                        intl.formatMessage(messages.lineTwo),
                                        intl.formatMessage(messages.lineThree),
                                        intl.formatMessage(messages.lineFour),
                                        intl.formatMessage(messages.lineFive)
                                    ],
                                    autoStart: true,
                                    skipAddStyles: true,
                                    loop: true,
                                    pauseFor: 3000
                                }}
                            />
                        </Typography>
                    </Stack>

                    <Stack justifyContent="center" sx={{height: 440}}>
                        <img src={illustrationLogin} alt="login" />
                    </Stack>
                </SectionCard>
            </MHidden>

            <Container>
                <ContentStyle>
                    <Stack direction="row" alignItems="center" sx={{mb: 5}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage
                                    defaultMessage="Sign in to {name}"
                                    values={{name: upperFirst(context.name)}}
                                />
                            </Typography>
                            <Typography sx={{color: "text.secondary"}}>
                                <FormattedMessage defaultMessage="Enter your details below." />
                            </Typography>
                        </Box>
                    </Stack>

                    <Form form={form} onFinish={submitForm}>
                        <Stack spacing={3}>
                            {auth.credential() === "name" ? (
                                <Form.Item
                                    name="name"
                                    rules={[{required: true}]}
                                    label={intl.formatMessage(
                                        messages.username
                                    )}>
                                    <TextField
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="email"
                                    rules={[{required: true, type: "email"}]}
                                    label={intl.formatMessage(messages.email)}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Form.Item>
                            )}

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
                                                <PasswordIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>

                            {withToken && tokenInput}

                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{my: 2}}>
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    initialValue={true}
                                    label={intl.formatMessage(
                                        messages.rememberMe
                                    )}>
                                    <ControlLabel>
                                        <Checkbox />
                                    </ControlLabel>
                                </Form.Item>

                                <Link
                                    component={RouterLink}
                                    to={router.generatePath(
                                        "auth.forgot-password"
                                    )}
                                    variant="subtitle2">
                                    <FormattedMessage defaultMessage="Forgot password?" />
                                </Link>
                            </Stack>

                            {recaptcha.enable && (
                                <Form.Item
                                    rules={[{required: true}]}
                                    name="recaptcha">
                                    <ReCaptcha ref={recaptchaRef} />
                                </Form.Item>
                            )}

                            <LoadingButton
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={onSubmit}
                                loading={loading}>
                                <FormattedMessage defaultMessage="Login" />
                            </LoadingButton>
                        </Stack>
                    </Form>

                    <MHidden width="smUp">
                        <Typography variant="body2" align="center" sx={{mt: 3}}>
                            <FormattedMessage defaultMessage="Don't have an account?" />

                            <Link
                                to={router.generatePath("auth.register")}
                                sx={{ml: 1}}
                                component={RouterLink}>
                                <FormattedMessage defaultMessage="Get started" />
                            </Link>
                        </Typography>
                    </MHidden>
                </ContentStyle>
            </Container>
        </StyledPage>
    );
};

export default Login;
