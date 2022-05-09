import React, {useCallback, useMemo} from "react";
import {Box, Stack, Typography} from "@mui/material";
import Form from "components/Form";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {LoadingButton} from "@mui/lab";
import InputAmount from "../InputAmount";
import InputMethod from "../InputMethod";
import {ceil, floor, round} from "lodash";
import {useDispatch} from "react-redux";
import Spin from "components/Spin";
import {errorHandler, route, useFormRequest} from "services/Http";
import {fetchPaymentAccount} from "redux/slices/payment";
import {notify} from "utils/index";
import {usePaymentAccount} from "hooks/account";

const messages = defineMessages({
    successful: {defaultMessage: "Deposit request was created."}
});

const Deposit = ({sx, ...otherProps}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const dispatch = useDispatch();

    const {account, loading} = usePaymentAccount();

    const minValue = useMemo(() => {
        return ceil(account?.min_transferable || 0, -1);
    }, [account]);

    const maxValue = useMemo(() => {
        return floor(account?.max_transferable || 1000, -1);
    }, [account]);

    const step = useMemo(() => {
        return round((maxValue - minValue) / 20, -1);
    }, [minValue, maxValue]);

    const getButtonText = useCallback(() => {
        switch (form.getFieldValue("method")) {
            case "transfer":
                return <FormattedMessage defaultMessage="Confirm Deposit" />;
            default:
                return <FormattedMessage defaultMessage="Continue" />;
        }
    }, [form]);

    const canSubmit = useCallback(() => {
        const amount = Number(form.getFieldValue("amount"));
        const method = form.getFieldValue("method");
        return amount >= minValue && amount <= maxValue && method;
    }, [form, minValue, maxValue]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("payment.deposit"), values)
                .then((data) => {
                    if (data?.redirect) {
                        window.location.replace(data.redirect);
                    } else {
                        dispatch(fetchPaymentAccount());
                        notify.success(intl.formatMessage(messages.successful));
                        form.resetFields();
                    }
                })
                .catch(errorHandler());
        },
        [intl, formRequest, dispatch, form]
    );

    return (
        <Box sx={{p: 3, overflow: "hidden", ...sx}} {...otherProps}>
            <Spin spinning={loading}>
                <Form form={form} onFinish={submitForm}>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    display: "block"
                                }}
                                variant="overline">
                                <FormattedMessage defaultMessage="Enter Amount" />
                            </Typography>

                            <Form.Item
                                name="amount"
                                rules={[
                                    {
                                        required: true,
                                        type: "number",
                                        min: minValue,
                                        max: maxValue
                                    }
                                ]}
                                initialValue={minValue}>
                                <InputAmount
                                    step={step}
                                    currencySymbol={account?.currency || "USD"}
                                    maxValue={maxValue}
                                    minValue={minValue}
                                />
                            </Form.Item>
                        </Stack>

                        <Stack spacing={1}>
                            <Typography
                                sx={{
                                    color: "text.secondary",
                                    display: "block"
                                }}
                                variant="overline">
                                <FormattedMessage defaultMessage="Deposit Method" />
                            </Typography>

                            <Form.Item
                                name="method"
                                rules={[{required: true, type: "string"}]}>
                                <InputMethod />
                            </Form.Item>
                        </Stack>

                        <Form.Item shouldUpdate>
                            {() => (
                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    loading={formLoading}
                                    size="large"
                                    disabled={!canSubmit()}>
                                    {getButtonText()}
                                </LoadingButton>
                            )}
                        </Form.Item>
                    </Stack>
                </Form>
            </Spin>
        </Box>
    );
};

export default Deposit;
