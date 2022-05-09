import React, {useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import LogoLayout from "layouts/Auth/components/LogoLayout";
import {Box, Container} from "@mui/material";
import {experimentalStyled as styled} from "@mui/material/styles";
import Page from "components/Page";
import RequestToken from "./components/RequestToken";
import SendEmailCode from "./components/SendEmailCode";
import ResetForm from "./components/ResetForm";

const messages = defineMessages({
    title: {defaultMessage: "Reset Password"}
});

const ForgotPassword = () => {
    const intl = useIntl();
    const [sent, setSent] = useState(false);
    const [email, setEmail] = useState();
    const [token, setToken] = useState();

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <LogoLayout />

            <Container>
                <Box sx={{maxWidth: 480, mx: "auto"}}>
                    {email && token ? (
                        <ResetForm email={email} token={token} />
                    ) : sent ? (
                        <RequestToken
                            onReset={() => setSent(false)}
                            email={email}
                            setToken={setToken}
                        />
                    ) : (
                        <SendEmailCode
                            onSuccess={() => setSent(true)}
                            email={email}
                            setEmail={setEmail}
                        />
                    )}
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

export default ForgotPassword;
