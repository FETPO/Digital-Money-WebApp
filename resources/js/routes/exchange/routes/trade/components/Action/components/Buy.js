import React, {useCallback, useState} from "react";
import {CardContent} from "@mui/material";
import Form from "components/Form";
import InputValue from "./InputValue";
import {useActiveWalletAccount, usePaymentAccount} from "hooks/account";
import Value from "utils/classes/Value";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import InputDivider from "./InputDivider";
import InputPrice from "./InputPrice";
import Alerts from "./Alerts";
import {useFormRequest} from "services/Http";
import {isNumber} from "lodash";
import {LoadingButton} from "@mui/lab";
import {useModal} from "utils/modal";
import Hidden from "./Hidden";
import {
    useAccountEffect,
    useSummaryRequest,
    useConfirmation,
    useInitialAmount,
    useSubmitRequest,
    useTokenField,
    useValuesChangeHandler
} from "./hooks";

const messages = defineMessages({
    price: {defaultMessage: "Price"},
    fee: {defaultMessage: "Fee"},
    confirm: {defaultMessage: "You are buying"},
    action: {defaultMessage: "Buy Now"},
    success: {defaultMessage: "Buy order was created."},
    value: {defaultMessage: "Value"}
});

const Buy = () => {
    const [form] = Form.useForm();
    const [modal, modalElements] = useModal();
    const [formRequest, formLoading] = useFormRequest(form);
    const [summary, setSummary] = useState({});
    const {account: paymentAccount} = usePaymentAccount();
    const account = useActiveWalletAccount();
    const intl = useIntl();
    const initialAmount = useInitialAmount("price");
    const handleValuesChange = useValuesChangeHandler(setSummary);
    const tokenField = useTokenField();

    useAccountEffect(form);

    const symbol = paymentAccount.currency;

    const calculate = useSummaryRequest(
        "exchange-trade.calculate-buy",
        form,
        formRequest,
        setSummary
    );

    const confirm = useConfirmation(
        modal,
        messages.confirm,
        messages.action,
        form,
        summary,
        symbol
    );

    const submitForm = useSubmitRequest(
        "exchange-trade.buy",
        form,
        formRequest,
        setSummary
    );

    const insufficient = useCallback(
        (form) => {
            return (
                paymentAccount.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                paymentAccount.available < summary.deductible
            );
        },
        [summary, paymentAccount]
    );

    const canSubmit = useCallback(
        (form) => {
            return (
                paymentAccount.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                paymentAccount.available >= summary.deductible &&
                account.isNotEmpty()
            );
        },
        [summary, paymentAccount, account]
    );

    return (
        <CardContent>
            <Form
                form={form}
                onValuesChange={handleValuesChange}
                initialValues={{amount: initialAmount}}
                onFinish={submitForm}>
                <Alerts insufficient={insufficient} tokenField={tokenField} />

                <Form.Item
                    name="amount"
                    label={intl.formatMessage(messages.price)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputPrice onBlur={calculate} fee={summary.fee} />
                </Form.Item>

                <InputDivider />

                <Form.Item
                    name="amount"
                    label={intl.formatMessage(messages.value)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputValue onBlur={calculate} />
                </Form.Item>

                {modalElements}

                <Hidden tokenField={tokenField} />

                <Form.Item shouldUpdate>
                    {(form) => (
                        <LoadingButton
                            variant="contained"
                            onClick={confirm}
                            disabled={!canSubmit(form)}
                            sx={{mt: 3}}
                            loading={formLoading}
                            fullWidth>
                            <FormattedMessage defaultMessage="Confirm" />
                        </LoadingButton>
                    )}
                </Form.Item>
            </Form>
        </CardContent>
    );
};

export default Buy;
