import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import mailCheckLine from "@iconify-icons/ri/mail-check-line";
import fingerprintLine from "@iconify-icons/ri/fingerprint-line";
import fileUserLine from "@iconify-icons/ri/file-user-line";
import StepsContent from "components/StepsContent";
import VerifyEmail from "./components/VerifyEmail";
import {fetchUser} from "redux/slices/auth";
import {useDispatch} from "react-redux";
import {Icon} from "@iconify/react";
import Page from "components/Page";
import {
    Box,
    Container,
    Grid,
    Step,
    StepConnector,
    StepLabel,
    Stepper
} from "@mui/material";
import {withStyles} from "@mui/styles";
import PropTypes from "prop-types";
import EnableTwoFactor from "./components/EnableTwoFactor";
import UpdateProfile from "./components/UpdateProfile";

const messages = defineMessages({title: {defaultMessage: "Account Setup"}});

const UserSetup = () => {
    const dispatch = useDispatch();
    const [current, setCurrent] = useState(0);
    const intl = useIntl();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const next = useCallback(() => {
        setCurrent((c) => c + 1);
    }, [setCurrent]);

    const renderStep = useCallback((label, icon) => {
        return (
            <Step>
                <StepLabel
                    StepIconProps={{icon}}
                    StepIconComponent={StepIcon}
                    sx={{
                        "& .MuiStepLabel-label": {
                            typography: "subtitle2",
                            color: "text.disabled"
                        }
                    }}>
                    {label}
                </StepLabel>
            </Step>
        );
    }, []);

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8} sx={{mb: 5}}>
                        <Stepper
                            alternativeLabel
                            activeStep={current}
                            connector={<Connector />}>
                            {renderStep(
                                <FormattedMessage defaultMessage="Verify Email" />,
                                mailCheckLine
                            )}
                            {renderStep(
                                <FormattedMessage defaultMessage="Enable Two Factor" />,
                                fingerprintLine
                            )}
                            {renderStep(
                                <FormattedMessage defaultMessage="Update Profile" />,
                                fileUserLine
                            )}
                        </Stepper>
                    </Grid>
                </Grid>

                <StepsContent current={current}>
                    <VerifyEmail next={next} />
                    <EnableTwoFactor next={next} />
                    <UpdateProfile />
                </StepsContent>
            </Container>
        </Page>
    );
};

const Connector = withStyles((theme) => ({
    alternativeLabel: {
        left: "calc(-50% + 20px)",
        right: "calc(50% + 20px)",
        top: 10
    },
    active: {"& $line": {borderColor: theme.palette.primary.main}},
    completed: {"& $line": {borderColor: theme.palette.primary.main}},
    line: {
        borderTopWidth: 2,
        borderColor: theme.palette.divider
    }
}))(StepConnector);

function StepIcon({active, completed, icon}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: active ? "primary.main" : "divider",
                bgcolor: "background.default",
                zIndex: 9,
                width: 24,
                height: 24
            }}>
            {completed || active ? (
                <Box
                    icon={icon}
                    component={Icon}
                    sx={{
                        zIndex: 1,
                        color: "primary.main",
                        width: 30,
                        height: 30
                    }}
                />
            ) : (
                <Box
                    component="span"
                    sx={{
                        borderRadius: "50%",
                        backgroundColor: "currentColor",
                        width: 8,
                        height: 8
                    }}
                />
            )}
        </Box>
    );
}

StepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool
};

export default UserSetup;
