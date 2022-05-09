import React, {useCallback, useEffect, useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {assign, defaultTo} from "lodash";
import {notify} from "utils";
import UploadPhoto from "components/UploadPhoto";
import {errorHandler, route, useFormRequest} from "services/Http";
import {fetchUser} from "redux/slices/auth";
import {normalizeDates, parseDate} from "utils/form";
import {useAuth} from "models/Auth";
import {useDispatch} from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    MenuItem,
    Stack
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {experimentalStyled as styled} from "@mui/material/styles";
import Form, {DatePicker, TextField} from "components/Form";
import Result from "components/Result";
import {TwoFactorIllustration} from "assets/index";
import {useCountries} from "hooks/global";

const messages = defineMessages({
    lastName: {defaultMessage: "Last Name"},
    firstName: {defaultMessage: "First Name"},
    country: {defaultMessage: "Country"},
    dob: {defaultMessage: "Date of Birth"},
    bio: {defaultMessage: "Bio"},
    phone: {defaultMessage: "Phone"},
    profileUpdated: {defaultMessage: "Your profile was updated."},
    caption: {defaultMessage: "Allowed *.jpeg, *.jpg, *.png"}
});

const UpdateProfile = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const auth = useAuth();
    const intl = useIntl();
    const [request, loading] = useFormRequest(form);

    const {countries} = useCountries();

    useEffect(() => {
        if (auth.check()) {
            form.resetFields();
        }
    }, [auth, form]);

    const submitForm = useCallback(
        (values) => {
            normalizeDates(values, ["dob"]);
            request
                .post(route("user.update"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.profileUpdated));
                    dispatch(fetchUser());
                })
                .catch(errorHandler());
        },
        [intl, request, dispatch]
    );

    const initialValues = useMemo(() => {
        const values = {
            country: defaultTo(auth.user.country, "")
        };

        if (auth.user.profile) {
            assign(values, {
                last_name: auth.user.profile.last_name,
                first_name: auth.user.profile.first_name,
                dob: parseDate(defaultTo(auth.user.profile.dob, undefined)),
                bio: auth.user.profile.bio
            });
        }
        return values;
    }, [auth]);

    const onUploadSuccess = useCallback(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const start = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <BaseStyle>
            {!auth.user.isProfileComplete() ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{py: 10, px: 3}}>
                            <UploadPhoto
                                action={route("user.upload-picture")}
                                caption={intl.formatMessage(messages.caption)}
                                onSuccess={onUploadSuccess}
                                preview={auth.user.getProfilePicture()}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{p: 3}}>
                            <Form
                                form={form}
                                initialValues={initialValues}
                                onFinish={submitForm}>
                                <Stack spacing={3}>
                                    <Stack
                                        direction={{xs: "column", sm: "row"}}
                                        spacing={{xs: 3, sm: 2}}>
                                        <Form.Item
                                            name="first_name"
                                            label={intl.formatMessage(
                                                messages.firstName
                                            )}
                                            rules={[{required: true}]}>
                                            <TextField
                                                disabled={Boolean(
                                                    initialValues["first_name"]
                                                )}
                                                fullWidth
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="last_name"
                                            label={intl.formatMessage(
                                                messages.lastName
                                            )}
                                            rules={[{required: true}]}>
                                            <TextField
                                                disabled={Boolean(
                                                    initialValues["last_name"]
                                                )}
                                                fullWidth
                                            />
                                        </Form.Item>
                                    </Stack>
                                    <Stack
                                        direction={{xs: "column", sm: "row"}}
                                        spacing={{xs: 3, sm: 2}}>
                                        <Form.Item
                                            name="dob"
                                            label={intl.formatMessage(
                                                messages.dob
                                            )}
                                            rules={[{required: true}]}>
                                            <DatePicker fullWidth />
                                        </Form.Item>
                                        <Form.Item
                                            name="country"
                                            label={intl.formatMessage(
                                                messages.country
                                            )}
                                            rules={[{required: true}]}>
                                            <TextField
                                                disabled={Boolean(
                                                    initialValues["country"]
                                                )}
                                                select
                                                fullWidth>
                                                {countries.map((country) => (
                                                    <MenuItem
                                                        value={country.code}
                                                        key={country.code}>
                                                        {`${country.name}`}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Form.Item>
                                    </Stack>

                                    <Form.Item
                                        name="bio"
                                        label={intl.formatMessage(
                                            messages.bio
                                        )}>
                                        <TextField
                                            minRows={3}
                                            maxRows={6}
                                            multiline
                                            fullWidth
                                        />
                                    </Form.Item>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    sx={{mt: 3}}>
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        loading={loading}>
                                        <FormattedMessage defaultMessage="Save Changes" />
                                    </LoadingButton>
                                </Stack>
                            </Form>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardHeader
                                title={
                                    <FormattedMessage defaultMessage="Profile" />
                                }
                            />

                            <CardContent>
                                <Result
                                    title={
                                        <FormattedMessage defaultMessage="Profile Updated!" />
                                    }
                                    description={
                                        <FormattedMessage defaultMessage="You have updated your profile." />
                                    }
                                    icon={TwoFactorIllustration}
                                    extra={
                                        <LoadingButton
                                            variant="contained"
                                            onClick={start}
                                            loading={loading}>
                                            <FormattedMessage defaultMessage="Start" />
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

const BaseStyle = styled("div")({});

export default UpdateProfile;
