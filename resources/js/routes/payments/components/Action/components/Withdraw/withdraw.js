import React, {useCallback, useMemo} from "react";
import {Alert, Box, Link, Stack, Typography} from "@mui/material";
import Form from "components/Form";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {LoadingButton} from "@mui/lab";
import InputBankAccount from "../InputBankAccount";
import InputAmount from "../InputAmount";
import {Link as RouterLink} from "react-router-dom";
import {notify, router} from "utils/index";
import {useAuth} from "models/Auth";
import {useDispatch} from "react-redux";
import {ceil, floor, round} from "lodash";
import Spin from "components/Spin";
import {errorHandler, route, useFormRequest} from "services/Http";
import {fetchPaymentAccount} from "redux/slices/payment";
import {usePaymentAccount} from "hooks/account";

const messages = defineMessages({
    successful: {defaultMessage: "Withdrawal request was created."}
});

const Withdraw = ({sx, ...otherProps}) => {
    const auth = useAuth();
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

    const canSubmit = useCallback(() => {
        const bankAccount = form.getFieldValue("bank_account");
        const amount = Number(form.getFieldValue("amount"));
        return (
            bankAccount && amount >= minValue && amount <= account?.available
        );
    }, [form, account, minValue]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("payment.withdraw"), values)
                .then((data) => {
                    dispatch(fetchPaymentAccount());
                    notify.success(intl.formatMessage(messages.successful));
                    form.resetFields();
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
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{mb: 1}}>
                                <Typography
                                    variant="overline"
                                    sx={{color: "text.secondary"}}>
                                    <FormattedMessage defaultMessage="Bank Account" />
                                </Typography>
                                <Link
                                    component={RouterLink}
                                    sx={{typography: "button"}}
                                    underline="none"
                                    to={{
                                        pathname:
                                            router.generatePath("user.account"),
                                        state: {tab: "bank-accounts"}
                                    }}>
                                    <FormattedMessage defaultMessage="Edit" />
                                </Link>
                            </Stack>

                            {auth.countryOperation() ? (
                                <Form.Item
                                    name="bank_account"
                                    rules={[{required: true}]}>
                                    <InputBankAccount />
                                </Form.Item>
                            ) : (
                                <Alert severity="warning">
                                    <FormattedMessage defaultMessage="We are not available in your country." />
                                </Alert>
                            )}
                        </Stack>

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

                        {account && (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">
                                <Typography
                                    sx={{color: "text.secondary"}}
                                    variant="subtitle2">
                                    <FormattedMessage defaultMessage="Your Balance" />
                                </Typography>
                                <Typography
                                    sx={{color: "text.primary"}}
                                    variant="subtitle1">
                                    {account?.formatted_available}
                                </Typography>
                            </Stack>
                        )}

                        <Form.Item shouldUpdate>
                            {() => (
                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    disabled={!canSubmit()}
                                    loading={formLoading}
                                    size="large">
                                    <FormattedMessage defaultMessage="Withdraw" />
                                </LoadingButton>
                            )}
                        </Form.Item>
                    </Stack>
                </Form>
            </Spin>
        </Box>
    );
};

export default Withdraw;
