import React, {useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {fetchUser} from "redux/slices/auth";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils";
import {Card, CardHeader, Grid, CardContent} from "@mui/material";
import Result from "components/Result";
import {LoadingButton} from "@mui/lab";
import {
    MailUnverifiedIllustration,
    MailVerifiedIllustration
} from "assets/index";

const messages = defineMessages({
    emailSuccess: {defaultMessage: "Email was resent."}
});

const VerifyEmail = ({next}) => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const intl = useIntl();
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);
    const [request, loading] = useRequest();

    useEffect(() => {
        if (!auth.user.hasVerifiedEmail()) {
            const channel = "UserActivities.VerifiedEmail";

            broadcast.listen(channel, () => {
                dispatch(fetchUser());
            });
            return () => {
                broadcast.stopListening(channel);
            };
        }
    }, [dispatch, broadcast, auth]);

    const resendEmail = () => {
        request
            .post(route("email-verification.send"))
            .then(() => {
                notify.success(intl.formatMessage(messages.emailSuccess));
            })
            .catch(errorHandler());
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
                <Card>
                    <CardHeader
                        title={
                            <FormattedMessage defaultMessage="Email Verification" />
                        }
                    />

                    <CardContent>
                        {auth.user.hasVerifiedEmail() ? (
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="Email Verified!" />
                                }
                                description={
                                    <FormattedMessage defaultMessage="Your email has been verified." />
                                }
                                icon={MailVerifiedIllustration}
                                extra={
                                    <LoadingButton
                                        variant="contained"
                                        onClick={() => next()}
                                        loading={loading}>
                                        <FormattedMessage defaultMessage="Next" />
                                    </LoadingButton>
                                }
                            />
                        ) : (
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="Check your email." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="We sent you a verification link." />
                                }
                                icon={MailUnverifiedIllustration}
                                iconProps={{
                                    className: "animated infinite pulse"
                                }}
                                extra={
                                    <LoadingButton
                                        variant="outlined"
                                        onClick={resendEmail}
                                        loading={loading}>
                                        <FormattedMessage defaultMessage="Resend Email" />
                                    </LoadingButton>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default VerifyEmail;
