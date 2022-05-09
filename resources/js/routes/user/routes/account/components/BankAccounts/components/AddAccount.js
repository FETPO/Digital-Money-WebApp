import React, {forwardRef, useCallback, useEffect, useState} from "react";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {
    Box,
    Chip,
    Divider,
    InputAdornment,
    MenuItem,
    Stack
} from "@mui/material";
import Spin from "components/Spin";
import PersonIcon from "@mui/icons-material/Person";
import {useAuth} from "models/Auth";
import LockIcon from "@mui/icons-material/Lock";
import PasswordIcon from "@mui/icons-material/Password";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    successful: {defaultMessage: "Bank account was added."},
    bank: {defaultMessage: "Select Bank"},
    bankName: {defaultMessage: "Bank Name"},
    beneficiary: {defaultMessage: "Beneficiary"},
    number: {defaultMessage: "Number"},
    note: {defaultMessage: "Note"},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const AddAccount = forwardRef(({closeModal, fetchAccounts}, ref) => {
    const [form] = Form.useForm();
    const auth = useAuth();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [banks, setBanks] = useState([]);
    const intl = useIntl();

    const fetchBanks = useCallback(() => {
        request
            .get(route("bank.get"))
            .then((data) => setBanks(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("bank.create-account"), values)
                .then(() => {
                    fetchAccounts();
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, fetchAccounts, formRequest]
    );

    const bankNameField = (
        <Form.Item shouldUpdate>
            {() =>
                form.getFieldValue("bank_id") === "other" && (
                    <Form.Item
                        name="bank_name"
                        label={intl.formatMessage(messages.bankName)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{mt: 1}}
                        />
                    </Form.Item>
                )
            }
        </Form.Item>
    );

    const currency = <b>{auth.user.currency}</b>;

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Box sx={{mt: 3}}>
                    <Stack spacing={2}>
                        <Form.Item
                            name="bank_id"
                            label={intl.formatMessage(messages.bank)}
                            rules={[{required: true}]}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalanceIcon />
                                        </InputAdornment>
                                    )
                                }}
                                select>
                                {banks.map((bank) => (
                                    <MenuItem value={bank.id} key={bank.id}>
                                        {bank.name}
                                    </MenuItem>
                                ))}
                                <MenuItem value={"other"}>
                                    <FormattedMessage defaultMessage="Other" />
                                </MenuItem>
                            </TextField>
                        </Form.Item>

                        {bankNameField}

                        <Divider>
                            <Chip
                                label={
                                    <FormattedMessage
                                        defaultMessage="Account ({currency})"
                                        values={{currency}}
                                    />
                                }
                            />
                        </Divider>

                        <Form.Item
                            name="beneficiary"
                            label={intl.formatMessage(messages.beneficiary)}
                            initialValue={auth.user.profile?.full_name}>
                            <TextField
                                fullWidth
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="number"
                            label={intl.formatMessage(messages.number)}
                            rules={[{required: true}]}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <QrCodeIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="note"
                            label={intl.formatMessage(messages.note)}>
                            <TextField fullWidth multiline rows={3} />
                        </Form.Item>

                        <Divider>
                            <Chip
                                label={
                                    <FormattedMessage defaultMessage="Verification" />
                                }
                            />
                        </Divider>

                        {auth.requireTwoFactor() ? (
                            <Form.Item
                                name="token"
                                rules={[{required: true}]}
                                label={intl.formatMessage(messages.token)}>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name="password"
                                label={intl.formatMessage(messages.password)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PasswordIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>
                        )}
                    </Stack>
                </Box>

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
});

export default AddAccount;
