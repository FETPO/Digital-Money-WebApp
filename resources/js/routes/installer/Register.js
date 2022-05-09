import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import LogoLayout from "layouts/Auth/components/LogoLayout";
import {Box, Container, InputAdornment, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {experimentalStyled as styled} from "@mui/material/styles";
import Page from "components/Page";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import {passwordConfirmation} from "utils/form";

const messages = defineMessages({
    username: {defaultMessage: "Username"},
    email: {defaultMessage: "Email"},
    password: {defaultMessage: "Password"},
    confirmPassword: {defaultMessage: "Confirm Password"},
    token: {defaultMessage: "Token"},
    success: {defaultMessage: "Account registered."},
    title: {defaultMessage: "Register Account"}
});

const Register = () => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("installer.register"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    window.location.reload();
                })
                .catch(errorHandler());
        },
        [intl, formRequest]
    );

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <LogoLayout />

            <Container>
                <Box sx={{maxWidth: 480, mx: "auto"}}>
                    <Form form={form} onFinish={submitForm}>
                        <Typography variant="h3" paragraph>
                            <FormattedMessage defaultMessage="Register Account" />
                        </Typography>

                        <Typography sx={{color: "text.secondary", mb: 5}}>
                            <FormattedMessage defaultMessage="Thank you for your purchase! Its time to setup your account, and you are set for launch." />
                        </Typography>

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

                            <LoadingButton
                                fullWidth
                                variant="contained"
                                type="submit"
                                loading={formLoading}
                                size="large">
                                <FormattedMessage defaultMessage="Register" />
                            </LoadingButton>
                        </Stack>
                    </Form>
                </Box>
            </Container>
        </StyledPage>
    );
};

const StyledPage = styled(Page)(({theme}) => ({
    display: "flex",
    padding: theme.spacing(12, 0),
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%"
}));

export default Register;
