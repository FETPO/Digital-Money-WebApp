import React from "react";
import Page from "components/Page";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, Button, Container, Typography} from "@mui/material";
import {MotionContainer, varBounceIn} from "components/Animate";
import {PageNotFoundIllustration} from "assets/index";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {router} from "utils";

const StyledPage = styled(Page)(({theme}) => ({
    display: "flex",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    minHeight: "100%",
    alignItems: "center"
}));

const messages = defineMessages({title: {defaultMessage: "Page Not Found"}});

const Result404 = () => {
    const intl = useIntl();

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <Container>
                <MotionContainer initial="initial" open>
                    <Box
                        sx={{
                            maxWidth: 480,
                            textAlign: "center",
                            margin: "auto"
                        }}>
                        <motion.div variants={varBounceIn}>
                            <Typography variant="h3" paragraph>
                                <FormattedMessage defaultMessage="Sorry, page not found!" />
                            </Typography>
                        </motion.div>

                        <Typography sx={{color: "text.secondary"}}>
                            <FormattedMessage defaultMessage="Sorry, we could not find the page you’re looking for." />
                        </Typography>

                        <motion.div variants={varBounceIn}>
                            <PageNotFoundIllustration
                                sx={{
                                    my: {xs: 5, sm: 10},
                                    height: 250
                                }}
                            />
                        </motion.div>

                        <Button
                            variant="contained"
                            size="large"
                            to={router.generatePath("home")}
                            component={Link}>
                            <FormattedMessage defaultMessage="Go to Home" />
                        </Button>
                    </Box>
                </MotionContainer>
            </Container>
        </StyledPage>
    );
};

export default Result404;
