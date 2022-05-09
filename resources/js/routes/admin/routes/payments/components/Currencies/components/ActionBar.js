import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import SearchTextField from "components/SearchTextField";
import {Box, Button, MenuItem, Stack, Switch, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {StyledToolbar} from "styles/toolbar.style";
import Form, {ControlLabel, TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import Spin from "components/Spin";
import {toUpper} from "lodash";
import {useExchangeBaseCurrency} from "hooks/settings";

const messages = defineMessages({
    success: {defaultMessage: "Currency was added."},
    searchPlaceholder: {defaultMessage: "Search currency..."},
    addCurrency: {defaultMessage: "Add Currency"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"},
    currency: {defaultMessage: "Currency"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addCurrency = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addCurrency),
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
                    onClick={addCurrency}>
                    <FormattedMessage defaultMessage="Add Currency" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [currencies, setCurrencies] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchCurrencies = useCallback(() => {
        request
            .get(route("admin.payment.get-currencies"))
            .then((data) => setCurrencies(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.payment.supported-currency.create"), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    const handleValuesChange = useCallback(
        (values) => {
            if (values.code) {
                const selected = currencies.find((currency) => {
                    return currency.code === values.code;
                });

                form.setFieldsValue({
                    exchange_rate: selected?.exchange_rate,
                    manual: selected?.type === "manual"
                });
            }
        },
        [form, currencies]
    );

    const baseCurrency = useExchangeBaseCurrency();

    const exchangeRate = useMemo(() => {
        return (
            <Fragment>
                <Box sx={{mt: 2}}>
                    <Typography
                        sx={{color: "text.secondary"}}
                        variant="overline">
                        <FormattedMessage defaultMessage="Exchange Rate" />
                    </Typography>
                </Box>

                <Stack spacing={2}>
                    <Form.Item
                        name="manual"
                        label={intl.formatMessage(messages.manual)}
                        getValueProps={(checked) => {
                            const code = form.getFieldValue("code");
                            const disabled = toUpper(baseCurrency) === code;
                            return {checked, disabled};
                        }}
                        valuePropName="checked">
                        <ControlLabel>
                            <Switch />
                        </ControlLabel>
                    </Form.Item>

                    <Form.Item
                        name="exchange_rate"
                        label={intl.formatMessage(messages.rate)}
                        getValueProps={(value) => {
                            const disabled = !form.getFieldValue("manual");
                            return {value, disabled};
                        }}
                        dependencies={["manual"]}
                        rules={[{required: true}]}>
                        <TextField type="number" fullWidth />
                    </Form.Item>
                </Stack>
            </Fragment>
        );
    }, [intl, form, baseCurrency]);

    return (
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={submitForm}>
            <Spin spinning={loading}>
                <Form.Item
                    name="code"
                    label={intl.formatMessage(messages.currency)}
                    rules={[{required: true}]}>
                    <TextField fullWidth select>
                        {currencies.map((currency, key) => (
                            <MenuItem value={currency.code} key={key}>
                                {`${currency.name} (${currency.code})`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Form.Item>

                {exchangeRate}

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
