import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import Form, {TextField} from "components/Form";
import {Box, Divider, InputAdornment, Stack, Typography} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    token: {defaultMessage: "Token"},
    tokenPlaceholder: {defaultMessage: "Enter two factor code."},
    password: {defaultMessage: "Password"}
});

const Confirm = ({
    fee,
    tokenField,
    chargeFee,
    deductible,
    form,
    closeModal
}) => {
    const intl = useIntl();
    const account = useActiveWalletAccount();

    const submit = useCallback(() => {
        form.validateFields([tokenField])
            .then(() => {
                form.submit();
                closeModal?.();
            })
            .catch(() => null);
    }, [form, closeModal, tokenField]);

    return (
        <Form.Item shouldUpdate>
            {() => {
                const address = form.getFieldValue("address");
                const amount = Number(form.getFieldValue("amount"));

                return (
                    <Box sx={{mt: 2}}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                textTransform: "uppercase",
                                fontWeight: "normal"
                            }}>
                            <FormattedMessage defaultMessage="You are sending" />
                        </Typography>

                        <Typography variant="h3" sx={{lineHeight: 1}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                spacing={1}>
                                <span>{amount}</span>
                                <span>{account.wallet.coin.symbol}</span>
                            </Stack>
                        </Typography>

                        <Typography variant="h6" sx={{fontWeight: "normal"}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                divider={<span>/</span>}
                                spacing={1}>
                                <span>{account.formatted_price}</span>
                                <span>{account.wallet.coin.symbol}</span>
                            </Stack>
                        </Typography>

                        <Divider sx={{my: 2}} />

                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                <FormattedMessage defaultMessage="To Address" />
                            </Typography>

                            <Typography variant="h5" noWrap>
                                {address}
                            </Typography>
                        </Stack>

                        <Divider sx={{my: 2}} />

                        {chargeFee() && (
                            <Stack
                                sx={{mb: 1}}
                                justifyContent="space-between"
                                direction="row">
                                <Typography variant="caption">
                                    <FormattedMessage defaultMessage="Fee" />
                                </Typography>

                                <Box sx={{textAlign: "right"}}>
                                    <Typography variant="caption">
                                        <Stack
                                            direction="row"
                                            divider={<span>&#8776;</span>}
                                            spacing={1}>
                                            <span>{fee.value}</span>
                                            <span>
                                                {fee.formatted_value_price}
                                            </span>
                                        </Stack>
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        <Stack
                            sx={{mb: 3}}
                            justifyContent="space-between"
                            direction="row">
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Total" />
                            </Typography>

                            <Box sx={{textAlign: "right"}}>
                                <Typography variant="caption">
                                    {deductible()}
                                </Typography>
                            </Box>
                        </Stack>

                        {tokenField === "token" ? (
                            <Form.Item
                                name="token"
                                label={intl.formatMessage(messages.token)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    placeholder={intl.formatMessage(
                                        messages.tokenPlaceholder
                                    )}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
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
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Form.Item>
                        )}

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            sx={{my: 2}}>
                            <LoadingButton variant="contained" onClick={submit}>
                                <FormattedMessage defaultMessage="Send" />
                            </LoadingButton>
                        </Stack>
                    </Box>
                );
            }}
        </Form.Item>
    );
};

export default Confirm;
