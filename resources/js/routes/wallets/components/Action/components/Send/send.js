import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import WalletAccount from "models/WalletAccount";
import IconBuilder from "components/IconBuilder";
import {useActiveWalletAccount, useWalletAccounts} from "hooks/account";
import {isEmpty, round} from "lodash";
import {fetchWalletAccounts, setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import InputAmount from "../InputAmount";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Confirm from "./components/Confirm";
import {useAuth} from "models/Auth";
import {CSSTransition} from "react-transition-group";
import Completed from "./components/Completed";
import {Box, InputAdornment, MenuItem, Stack, Typography} from "@mui/material";
import Form, {TextField} from "components/Form";
import {useModal} from "utils/modal";
import Spin from "components/Spin";
import Alert from "components/Alert";
import {experimentalStyled as styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import ContactsIcon from "@mui/icons-material/Contacts";
import Value from "utils/classes/Value";
import {useChangeDetect} from "models/Model";

const messages = defineMessages({
    address: {defaultMessage: "To"},
    fee: {defaultMessage: "Fee"},
    addressPlaceholder: {defaultMessage: "Email or coin address"},
    account: {defaultMessage: "Select Account"},
    accountPlaceholder: {defaultMessage: "Select account"},
    desc: {defaultMessage: "Description"},
    descPlaceholder: {
        defaultMessage: "What's this transaction for? (optional)"
    },
    confirm: {defaultMessage: "Confirm"},
    send: {defaultMessage: "Send"},
    amount: {defaultMessage: "Amount"},
    invalidToken: {defaultMessage: "Invalid token or password."}
});

const Send = ({sx, ...props}) => {
    const [form] = Form.useForm();
    const auth = useAuth();
    const {data, loading: loadingAccount} = useWalletAccounts();
    const account = useActiveWalletAccount();
    const accountChanged = useChangeDetect(account);
    const [fee, setFee] = useState();
    const [modal, modalElements] = useModal();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [lastSent, setLastSent] = useState();
    const dispatch = useDispatch();

    const isInternal = useCallback(() => {
        const address = form.getFieldValue("address");
        return RegExp("\\S+@\\S+").test(address);
    }, [form]);

    const getFeeEstimate = useCallback(() => {
        if (!account.isEmpty() && !isInternal()) {
            const amount = Number(form.getFieldValue("amount"));
            const routeName = "wallet.account.estimate-fee";
            request
                .post(route(routeName, {id: account.id}), {amount})
                .then((data) => setFee(data))
                .catch(errorHandler());
        }
    }, [request, form, account, isInternal]);

    useEffect(() => {
        if (account.get("id") && accountChanged) {
            form.resetFields();
            form.setFieldsValue({account: account.get("id")});
        }
    }, [account, form, accountChanged]);

    useEffect(() => {
        if (account.get("id")) {
            getFeeEstimate();
        }
    }, [account, getFeeEstimate]);

    const handleValuesChange = useCallback(
        (values) => {
            if (values.account) {
                dispatch(setActiveAccount(values.account));
            }
        },
        [dispatch]
    );

    const chargeFee = useCallback(() => {
        return !isEmpty(fee) && !isInternal();
    }, [fee, isInternal]);

    const deductible = useCallback(() => {
        if (!account.isEmpty()) {
            const amount = Number(form.getFieldValue("amount"));
            const coin = account.wallet.coin;
            const value = !chargeFee() ? amount : amount + fee.value;
            return round(value, coin.precision);
        }
    }, [account, fee, chargeFee, form]);

    const canSubmit = useCallback(() => {
        return (
            Number(form.getFieldValue("amount")) > 0 &&
            !account.isEmpty() &&
            deductible() <= account.available
        );
    }, [deductible, account, form]);

    const submitForm = useCallback(
        (values) => {
            values.amount = Number(values.amount);
            const routeName = "wallet.account.send";
            formRequest
                .post(route(routeName, {id: account.id}), values)
                .then((data) => {
                    form.resetFields(["amount", "address"]);
                    setLastSent(data);
                    setFee(undefined);
                })
                .catch(errorHandler());
        },
        [formRequest, account, form]
    );

    const tokenField = useMemo(() => {
        return auth.requireTwoFactor() ? "token" : "password";
    }, [auth]);

    const confirmSend = useCallback(() => {
        form.resetFields([tokenField]);
        form.validateFields()
            .then(() => {
                modal.confirm({
                    content: (
                        <Confirm
                            form={form}
                            deductible={deductible}
                            chargeFee={chargeFee}
                            tokenField={tokenField}
                            fee={fee}
                        />
                    )
                });
            })
            .catch(() => null);
    }, [modal, fee, form, chargeFee, deductible, tokenField]);

    const reset = useCallback(() => {
        dispatch(fetchWalletAccounts());
        setLastSent(undefined);
    }, [dispatch]);

    const alerts = (
        <Stack spacing={2} sx={{mb: 3}}>
            <Form.Item shouldUpdate>
                {() => {
                    return form.getFieldError(tokenField).map((error, i) => (
                        <Alert key={i} severity="error">
                            {error}
                        </Alert>
                    ));
                }}
            </Form.Item>

            <Form.Item shouldUpdate>
                {() => {
                    return (
                        Number(form.getFieldValue("amount")) > 0 &&
                        account.available < deductible() && (
                            <Alert severity="error">
                                <FormattedMessage
                                    defaultMessage="You don't have enough {coin} to send."
                                    values={{coin: <b>{account.coin.name}</b>}}
                                />
                            </Alert>
                        )
                    );
                }}
            </Form.Item>
        </Stack>
    );

    const renderInputAmount = (account) => {
        return (
            <InputAmount
                unitPrice={account.price}
                currencySymbol={account.user.currency}
                currencyPrecision={account.wallet.coin.currency_precision}
                unitPrecision={account.wallet.coin.precision}
                unitSymbol={account.wallet.coin.symbol}
                onBlur={getFeeEstimate}
            />
        );
    };

    return (
        <Box sx={{p: 3, ...sx}} {...props}>
            <Spin spinning={loading || loadingAccount}>
                <Form
                    form={form}
                    onValuesChange={handleValuesChange}
                    onFinish={submitForm}>
                    {!account.isEmpty() && (
                        <Fragment>
                            <Box sx={{mb: 1, width: "40%", mx: "auto"}}>
                                <Form.Item
                                    name="amount"
                                    label={intl.formatMessage(messages.amount)}
                                    rules={[
                                        Value.validate(intl),
                                        {required: true}
                                    ]}>
                                    {renderInputAmount(account)}
                                </Form.Item>
                            </Box>

                            {alerts}
                        </Fragment>
                    )}

                    <Box sx={{mb: 2}}>
                        <Form.Item
                            name="account"
                            label={intl.formatMessage(messages.account)}
                            rules={[{required: true}]}>
                            <TextField
                                placeholder={intl.formatMessage(
                                    messages.accountPlaceholder
                                )}
                                select
                                fullWidth>
                                {data.map((record) => {
                                    const account = WalletAccount.use(record);
                                    const icon = account.wallet.coin.svgIcon();
                                    return (
                                        <MenuItem
                                            value={account.id}
                                            key={account.id}>
                                            <CoinStyle>
                                                <IconBuilder
                                                    sx={{fontSize: "25px"}}
                                                    icon={icon}
                                                />
                                                <Box
                                                    component="span"
                                                    sx={{marginLeft: "10px"}}>
                                                    {account.wallet.coin.name}
                                                </Box>
                                            </CoinStyle>
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Form.Item>
                    </Box>

                    <Box sx={{mb: 3}}>
                        <Form.Item
                            name="address"
                            label={intl.formatMessage(messages.address)}
                            rules={[{required: true}]}>
                            <TextField
                                fullWidth
                                placeholder={intl.formatMessage(
                                    messages.addressPlaceholder
                                )}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactsIcon />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Box>

                    <Box sx={{mb: 2}}>
                        <Form.Item shouldUpdate>
                            {() =>
                                chargeFee() && (
                                    <Stack
                                        justifyContent="space-between"
                                        direction="row">
                                        <Typography variant="caption">
                                            {intl.formatMessage(messages.fee)}
                                        </Typography>
                                        <Box sx={{textAlign: "right"}}>
                                            <Stack
                                                direction="row"
                                                divider={<span>&#8776;</span>}
                                                spacing={1}>
                                                <Typography variant="caption">
                                                    {fee.value}
                                                </Typography>
                                                <Typography variant="caption">
                                                    {fee.formatted_value_price}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                )
                            }
                        </Form.Item>
                    </Box>

                    {modalElements}

                    <Box sx={{display: "none"}}>
                        {tokenField !== "token" ? (
                            <Form.Item name="password">
                                <TextField id="hidden-password" />
                            </Form.Item>
                        ) : (
                            <Form.Item name="token">
                                <TextField id="hidden-token" />
                            </Form.Item>
                        )}
                    </Box>

                    <Form.Item shouldUpdate>
                        {() => (
                            <LoadingButton
                                variant="contained"
                                onClick={confirmSend}
                                disabled={!canSubmit()}
                                loading={formLoading}
                                fullWidth>
                                <FormattedMessage defaultMessage="Confirm" />
                            </LoadingButton>
                        )}
                    </Form.Item>
                </Form>
            </Spin>

            <CSSTransition
                in={!isEmpty(lastSent)}
                timeout={1000}
                classNames={{
                    enterActive: "backInDown",
                    enter: "animated"
                }}>
                <Completed lastSent={lastSent} onReset={reset} />
            </CSSTransition>
        </Box>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

export default Send;
