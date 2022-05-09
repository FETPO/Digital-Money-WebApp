import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {
    Button,
    Chip,
    Divider,
    InputAdornment,
    MenuItem,
    Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Spin from "components/Spin";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LockIcon from "@mui/icons-material/Lock";
import PasswordIcon from "@mui/icons-material/Password";
import {useAuth} from "models/Auth";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {useSupportedCurrencies} from "hooks/global";

const messages = defineMessages({
    success: {defaultMessage: "Bank account was created."},
    searchPlaceholder: {defaultMessage: "Search by number..."},
    addBankAccount: {defaultMessage: "Add Bank Account"},
    name: {defaultMessage: "Name"},
    operatingCountries: {defaultMessage: "Operating Countries"},
    beneficiary: {defaultMessage: "Beneficiary"},
    number: {defaultMessage: "Number"},
    note: {defaultMessage: "Note"},
    bank: {defaultMessage: "Bank"},
    password: {defaultMessage: "Password"},
    token: {defaultMessage: "Token"},
    currency: {defaultMessage: "Currency"},
    country: {defaultMessage: "Country"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addBankAccount = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addBankAccount),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [intl, reloadTable, modal]);

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />

            {modalElements}

            <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{whiteSpace: "nowrap"}}
                    onClick={addBankAccount}>
                    <FormattedMessage defaultMessage="Add Account" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const auth = useAuth();
    const [banks, setBanks] = useState([]);
    const [countries, setCountries] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchBanks = useCallback(() => {
        request
            .get(route("admin.bank.get-operating-banks"))
            .then((data) => setBanks(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const handleValuesChange = useCallback(
        (values) => {
            if (values.bank_id) {
                const selected = banks.find((bank) => {
                    return bank.id === values.bank_id;
                });

                const operatingCountries = selected?.operating_countries;
                setCountries(operatingCountries);

                form.setFieldsValue({
                    country: operatingCountries[0]?.code
                });
            }
        },
        [form, banks]
    );

    const {currencies} = useSupportedCurrencies();

    const submitForm = useCallback(
        (values) => {
            const routeName = "admin.bank.account.create";
            formRequest
                .post(route(routeName), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={submitForm}>
            <Spin spinning={loading}>
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
                        </TextField>
                    </Form.Item>

                    <Stack direction="row" spacing={2}>
                        <Form.Item
                            name="currency"
                            label={intl.formatMessage(messages.currency)}
                            rules={[{required: true}]}>
                            <TextField fullWidth select>
                                {currencies.map((currency) => (
                                    <MenuItem
                                        value={currency.code}
                                        key={currency.code}>
                                        {`${currency.name} (${currency.code})`}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>

                        <Form.Item
                            name="country"
                            label={intl.formatMessage(messages.country)}
                            rules={[{required: true}]}>
                            <TextField select fullWidth>
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

                    <Divider>
                        <Chip
                            label={
                                <FormattedMessage defaultMessage="Account Details" />
                            }
                        />
                    </Divider>

                    <Form.Item
                        name="beneficiary"
                        label={intl.formatMessage(messages.beneficiary)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
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
                            label={intl.formatMessage(messages.token)}
                            rules={[{required: true}]}>
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
};

export default ActionBar;
