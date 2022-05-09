import React, {useCallback, useEffect, useState} from "react";
import Form, {ControlLabel} from "components/Form";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {isEmpty} from "lodash";
import {notify} from "utils/index";
import {CardHeader, Card, CardContent, Switch, Stack} from "@mui/material";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    title: {defaultMessage: "Payment Gateway"},
    paypal: {defaultMessage: "Enable paypal"},
    success: {defaultMessage: "Settings was updated."}
});

const UpdateGateway = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [settings, setSettings] = useState({});

    const fetchSettings = useCallback(() => {
        request
            .get(route("admin.settings.get-gateway"))
            .then((data) => setSettings(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.settings.update-gateway"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchSettings();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchSettings]
    );

    useEffect(() => {
        if (!isEmpty(settings)) {
            form.resetFields();
        }
    }, [settings, form]);

    return (
        <Card>
            <CardHeader title={intl.formatMessage(messages.title)} />
            <CardContent>
                <Form form={form} onFinish={submitForm}>
                    <Spin spinning={loading}>
                        <Stack>
                            <Form.Item
                                name="paypal"
                                initialValue={settings.paypal}
                                label={intl.formatMessage(messages.paypal)}
                                valuePropName="checked">
                                <ControlLabel>
                                    <Switch />
                                </ControlLabel>
                            </Form.Item>
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
                    </Spin>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UpdateGateway;
