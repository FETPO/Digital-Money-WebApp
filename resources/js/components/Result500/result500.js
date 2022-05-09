import React from "react";
import Page from "components/Page";
import {Link} from "react-router-dom";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, Button, Container, Typography} from "@mui/material";
import {SeverErrorIllustration} from "assets/index";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {router} from "utils";

const StyledPage = styled(Page)(({theme}) => ({
    display: "flex",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    minHeight: "100%",
    alignItems: "center"
}));

const messages = defineMessages({title: {defaultMessage: "Unexpected Error"}});

const Result500 = () => {
    const intl = useIntl();

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <Container>
                <Box
                    sx={{
                        maxWidth: 480,
                        margin: "auto",
                        textAlign: "center"
                    }}>
                    <Typography variant="h3" paragraph>
                        <FormattedMessage defaultMessage="Internal Error" />
                    </Typography>

                    <Typography sx={{color: "text.secondary"}}>
                        <FormattedMessage defaultMessage="There was an unexpected error, please try again later." />
                    </Typography>

                    <SeverErrorIllustration
                        sx={{
                            my: {xs: 5, sm: 10},
                            height: 250
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        to={router.generatePath("home")}
                        component={Link}>
                        <FormattedMessage defaultMessage="Go to Home" />
                    </Button>
                </Box>
            </Container>
        </StyledPage>
    );
};

export default Result500;
