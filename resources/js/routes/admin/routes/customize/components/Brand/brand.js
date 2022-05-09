import React, {useCallback} from "react";
import {
    Box,
    Card,
    CardHeader,
    Grid,
    InputAdornment,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import UploadFile from "components/UploadFile";
import {errorHandler, route, useFormRequest} from "services/Http";
import Form, {TextField} from "components/Form";
import SupportIcon from "@mui/icons-material/Support";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import RuleIcon from "@mui/icons-material/Rule";
import {useBrand} from "hooks/settings";

const messages = defineMessages({
    success: {defaultMessage: "Your settings was saved"},
    supportUrl: {defaultMessage: "Support Url"},
    termsUrl: {defaultMessage: "Terms Url"},
    policyUrl: {defaultMessage: "Policy Url"}
});

const Brand = () => {
    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Change Brand" />}
            />

            <Grid container spacing={3} sx={{p: 3}} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Upload Favicon" />
                        </Typography>

                        <UploadFile
                            caption={
                                <FormattedMessage
                                    defaultMessage="png, width: {width}px, ratio: 1"
                                    values={{width: <b>32</b>}}
                                />
                            }
                            action={route("admin.brand.upload-favicon")}
                            maxSize={10}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Upload Logo" />
                        </Typography>

                        <UploadFile
                            caption={
                                <FormattedMessage
                                    defaultMessage="png, width: {width}px, ratio: 1"
                                    values={{width: <b>100</b>}}
                                />
                            }
                            action={route("admin.brand.upload-logo")}
                            maxSize={50}
                        />
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Stack spacing={1}>
                        <Typography variant="overline">
                            <FormattedMessage defaultMessage="Update Social Links" />
                        </Typography>

                        <UpdateSocialLinks />
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    );
};

const UpdateSocialLinks = (props) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.brand.update-social-links"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                })
                .catch(errorHandler());
        },
        [formRequest, intl]
    );

    const brand = useBrand();

    return (
        <Box {...props}>
            <Form form={form} onFinish={submitForm}>
                <Stack spacing={2} sx={{mt: 1}}>
                    <Form.Item
                        name="support_url"
                        label={intl.formatMessage(messages.supportUrl)}
                        initialValue={brand.supportUrl}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SupportIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="terms_url"
                        label={intl.formatMessage(messages.termsUrl)}
                        initialValue={brand.termsUrl}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FactCheckIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="policy_url"
                        label={intl.formatMessage(messages.policyUrl)}
                        initialValue={brand.policyUrl}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <RuleIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                </Stack>

                <Stack direction="row" sx={{mt: 3}} justifyContent="flex-end">
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Save Changes" />
                    </LoadingButton>
                </Stack>
            </Form>
        </Box>
    );
};

export default Brand;
