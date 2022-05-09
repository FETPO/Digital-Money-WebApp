import React, {useCallback, useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Form, {TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {isEmpty, upperCase} from "lodash";
import Spin from "components/Spin";
import Result from "components/Result";

const messages = defineMessages({
    title: {defaultMessage: "Feature Limit"},
    unverified: {defaultMessage: "Unverified"},
    basic: {defaultMessage: "Basic"},
    advanced: {defaultMessage: "Advanced"},
    period: {defaultMessage: "Period"},
    success: {defaultMessage: "Limit was updated"}
});

const UpdateLimit = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [limits, setLimits] = useState([]);

    const fetchLimits = useCallback(() => {
        request
            .get(route("admin.feature-limit.get"))
            .then((data) => setLimits(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchLimits();
    }, [fetchLimits]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.feature-limit.update"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchLimits();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchLimits]
    );

    useEffect(() => {
        if (!isEmpty(limits)) {
            form.resetFields();
        }
    }, [limits, form]);

    const renderLimitForm = (limit) => {
        const inputProps = limit.type === "amount" && {
            endAdornment: <InputAdornment position="end">USD</InputAdornment>
        };

        const inputField = (
            <TextField type="number" fullWidth InputProps={inputProps} />
        );

        const unverifiedInputField = (
            <Form.Item
                name={["limits", limit.name, "unverified_limit"]}
                initialValue={limit.unverified_limit}
                label={intl.formatMessage(messages.unverified)}
                rules={[{required: true}]}>
                {inputField}
            </Form.Item>
        );

        const basicInputField = (
            <Form.Item
                name={["limits", limit.name, "basic_limit"]}
                initialValue={limit.basic_limit}
                label={intl.formatMessage(messages.basic)}
                rules={[{required: true}]}>
                {inputField}
            </Form.Item>
        );

        const advancedInputField = (
            <Form.Item
                name={["limits", limit.name, "advanced_limit"]}
                initialValue={limit.advanced_limit}
                label={intl.formatMessage(messages.advanced)}
                rules={[{required: true}]}>
                {inputField}
            </Form.Item>
        );

        const selectPeriodField = (
            <Form.Item
                name={["limits", limit.name, "period"]}
                initialValue={limit.period}
                label={intl.formatMessage(messages.period)}
                rules={[{required: true}]}>
                <TextField fullWidth select>
                    <MenuItem value="day">
                        <FormattedMessage defaultMessage="Daily" />
                    </MenuItem>
                    <MenuItem value="month">
                        <FormattedMessage defaultMessage="Monthly" />
                    </MenuItem>
                    <MenuItem value="year">
                        <FormattedMessage defaultMessage="Yearly" />
                    </MenuItem>
                </TextField>
            </Form.Item>
        );

        return (
            <Stack key={limit.name}>
                <Typography variant="overline">
                    {upperCase(limit.name)}
                </Typography>

                <Box sx={{mt: 2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {selectPeriodField}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {unverifiedInputField}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {basicInputField}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {advancedInputField}
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        );
    };

    return (
        <Card>
            <CardHeader title={intl.formatMessage(messages.title)} />
            <CardContent>
                <Spin spinning={loading}>
                    <Form form={form} onFinish={submitForm}>
                        <Stack spacing={4}>
                            {!isEmpty(limits) ? (
                                limits.map(renderLimitForm)
                            ) : (
                                <Result sx={{py: 4}} />
                            )}
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            sx={{mt: 2}}>
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                loading={formLoading}>
                                <FormattedMessage defaultMessage="Save Changes" />
                            </LoadingButton>
                        </Stack>
                    </Form>
                </Spin>
            </CardContent>
        </Card>
    );
};

export default UpdateLimit;
