import React, {useCallback, useRef} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest} from "services/Http";
import Form, {TextField} from "components/Form";
import {notify, router} from "utils";
import ReCaptcha, {recaptchaSubmit} from "components/ReCaptcha";
import {Link as RouterLink} from "react-router-dom";
import {ContentStyle, SectionCard, StyledPage} from "layouts/Auth/auth.style";
import HintLayout from "layouts/Auth/components/HintLayout";
import {MHidden} from "components/@material-extend";
import {
    Box,
    Container,
    InputAdornment,
    Link,
    Stack,
    Typography
} from "@mui/material";
import illustrationRegister from "static/register-illustration.png";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import {LoadingButton} from "@mui/lab";
import {passwordConfirmation} from "utils/form";
import {useBrand, useRecaptcha} from "hooks/settings";

const messages = defineMessages({
    username: {defaultMessage: "Username"},
    email: {defaultMessage: "Email"},
    password: {defaultMessage: "Password"},
    confirmPassword: {defaultMessage: "Confirm Password"},
    token: {defaultMessage: "Token"},
    success: {defaultMessage: "Registration was successful."},
    title: {defaultMessage: "Register"}
});

const Register = () => {
    const [form] = Form.useForm();
    const [request, loading] = useFormRequest(form);
    const intl = useIntl();
    const recaptchaRef = useRef();

    const recaptcha = useRecaptcha();

    const submitForm = useCallback(
        (values) => {
            request
                .post(route("auth.register"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    window.location.reload();
                })
                .catch(errorHandler());
        },
        [request, intl]
    );

    const onSubmit = recaptchaSubmit(form, recaptchaRef);

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <HintLayout>
                <FormattedMessage defaultMessage="Already have an account?" />
                <Link
                    underline="none"
                    component={RouterLink}
                    variant="subtitle2"
                    to={router.generatePath("auth.login")}
                    sx={{ml: 1}}>
                    <FormattedMessage defaultMessage="Login" />
                </Link>
            </HintLayout>

            <MHidden width="mdDown">
                <SectionCard>
                    <Stack sx={{p: 1, mb: 5}}>
                        <Typography variant="body2">
                            <FormattedMessage defaultMessage="Get Started" />
                        </Typography>

                        <Typography
                            sx={{minHeight: 100, fontWeight: 600}}
                            variant="h3">
                            <FormattedMessage defaultMessage="Create a new account, fast and easy." />
                        </Typography>
                    </Stack>

                    <Stack justifyContent="center" sx={{height: 440}}>
                        <img src={illustrationRegister} alt="register" />
                    </Stack>
                </SectionCard>
            </MHidden>

            <Container>
                <ContentStyle>
                    <Stack direction="row" alignItems="center" sx={{mb: 5}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h4" gutterBottom>
                                <FormattedMessage defaultMessage="Get started in few steps." />
                            </Typography>

                            <Typography sx={{color: "text.secondary"}}>
                                <FormattedMessage defaultMessage="We need some information" />
                            </Typography>
                        </Box>
                    </Stack>

                    <Form form={form} onFinish={submitForm}>
                        <Stack spacing={3}>
                            <Form.Item
                                name="name"
                                label={intl.formatMessage(messages.username)}
                                rules={[{required: true}]}>
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

                            <Form.Item
                                name="email"
                                label={intl.formatMessage(messages.email)}
                                rules={[{required: true, type: "email"}]}>
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

                            <Form.Item
                                name="password_confirmation"
                                label={intl.formatMessage(
                                    messages.confirmPassword
                                )}
                                dependencies={["password"]}
                                rules={[
                                    passwordConfirmation(intl, "password"),
                                    {required: true}
                                ]}>
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
                                <FormattedMessage defaultMessage="Register" />
                            </LoadingButton>
                        </Stack>
                    </Form>

                    <PrivacyPolicy />

                    <MHidden width="smUp">
                        <Typography variant="body2" align="center" sx={{mt: 3}}>
                            <FormattedMessage defaultMessage="Already have an account?" />

                            <Link
                                to={router.generatePath("auth.login")}
                                sx={{ml: 1}}
                                component={RouterLink}>
                                <FormattedMessage defaultMessage="Login" />
                            </Link>
                        </Typography>
                    </MHidden>
                </ContentStyle>
            </Container>
        </StyledPage>
    );
};

const PrivacyPolicy = () => {
    const brand = useBrand();

    return (
        <Typography
            variant="body2"
            sx={{color: "text.secondary", mt: 3}}
            align="center">
            <FormattedMessage defaultMessage="By registering, you agree to our" />

            <Link
                underline="always"
                sx={{color: "text.primary", mx: 1}}
                href={brand.termsUrl}
                target="_blank">
                <FormattedMessage defaultMessage="Terms of Service" />
            </Link>

            <FormattedMessage defaultMessage="and" />

            <Link
                underline="always"
                sx={{color: "text.primary", ml: 1}}
                href={brand.policyUrl}
                target="_blank">
                <FormattedMessage defaultMessage="Privacy Policy" />
            </Link>
        </Typography>
    );
};

export default Register;
