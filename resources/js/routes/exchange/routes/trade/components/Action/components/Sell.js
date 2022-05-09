import React, {useCallback, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form from "components/Form";
import {useModal} from "utils/modal";
import {useFormRequest} from "services/Http";
import {useActiveWalletAccount} from "hooks/account";
import Value from "utils/classes/Value";
import {isNumber} from "lodash";
import Alerts from "./Alerts";
import {CardContent} from "@mui/material";
import InputValue from "./InputValue";
import InputDivider from "./InputDivider";
import InputPrice from "./InputPrice";
import Hidden from "./Hidden";
import {LoadingButton} from "@mui/lab";
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
    confirm: {defaultMessage: "You are selling"},
    action: {defaultMessage: "Sell Now"},
    success: {defaultMessage: "Sell order was created."},
    value: {defaultMessage: "Value"}
});

const Sell = () => {
    const [form] = Form.useForm();
    const [modal, modalElements] = useModal();
    const [formRequest, formLoading] = useFormRequest(form);
    const [summary, setSummary] = useState({});
    const account = useActiveWalletAccount();
    const intl = useIntl();
    const initialAmount = useInitialAmount("unit");
    const handleValuesChange = useValuesChangeHandler(setSummary);
    const tokenField = useTokenField();

    useAccountEffect(form);

    const symbol = account.wallet?.coin?.symbol;

    const calculate = useSummaryRequest(
        "exchange-trade.calculate-sell",
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
        "exchange-trade.sell",
        form,
        formRequest,
        setSummary
    );

    const insufficient = useCallback(
        (form) => {
            return (
                account.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                account.available < summary.deductible
            );
        },
        [summary, account]
    );

    const canSubmit = useCallback(
        (form) => {
            return (
                account.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                account.available >= summary.deductible
            );
        },
        [summary, account]
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
                    label={intl.formatMessage(messages.value)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputValue onBlur={calculate} fee={summary.fee} />
                </Form.Item>

                <InputDivider />

                <Form.Item
                    name="amount"
                    label={intl.formatMessage(messages.price)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputPrice onBlur={calculate} />
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

export default Sell;
