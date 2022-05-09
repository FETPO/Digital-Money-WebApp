import React, {useCallback} from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import Page from "components/Page";
import LogoLayout from "layouts/Auth/components/LogoLayout";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Box, Container, InputAdornment, Stack, Typography} from "@mui/material";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    code: {defaultMessage: "Code"},
    success: {defaultMessage: "Purchase verified."},
    title: {defaultMessage: "Verify Purchase"}
});

const Install = () => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("installer.install"), values)
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
                            <FormattedMessage defaultMessage="Verify Purchase" />
                        </Typography>

                        <Typography sx={{color: "text.secondary", mb: 5}}>
                            <FormattedMessage defaultMessage="Please enter your purchase code here. You will find it in the receipt of your purchase." />
                        </Typography>

                        <Stack spacing={3}>
                            <Form.Item
                                name="code"
                                label={intl.formatMessage(messages.code)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
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
                                <FormattedMessage defaultMessage="Verify Code" />
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

export default Install;
