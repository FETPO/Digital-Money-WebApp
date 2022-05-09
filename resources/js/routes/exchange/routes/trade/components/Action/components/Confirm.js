import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import Form, {TextField} from "components/Form";
import {Divider, InputAdornment, Stack, Typography} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    token: {defaultMessage: "Token"},
    tokenPlaceholder: {defaultMessage: "Enter two factor code."},
    password: {defaultMessage: "Password"}
});

const Confirm = ({
    tokenField,
    title,
    action,
    symbol,
    deductible,
    fee,
    closeModal
}) => {
    const account = useActiveWalletAccount();
    const intl = useIntl();

    const submit = useCallback(
        (form) => {
            form.validateFields([tokenField])
                .then(() => {
                    form.submit();
                    closeModal?.();
                })
                .catch(() => null);
        },
        [closeModal, tokenField]
    );

    return (
        <Form.Item shouldUpdate>
            {(form) => {
                const amount = Number(form.getFieldValue("amount"));

                return (
                    <Stack sx={{mt: 2}}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                textTransform: "uppercase",
                                fontWeight: "normal"
                            }}>
                            {title}
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

                        <Stack
                            sx={{mb: 1}}
                            justifyContent="space-between"
                            direction="row">
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Fee" />
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{textAlign: "right"}}>
                                <FormattedMessage
                                    defaultMessage="{fee} ({symbol})"
                                    values={{fee, symbol}}
                                />
                            </Typography>
                        </Stack>

                        <Stack
                            sx={{mb: 3}}
                            justifyContent="space-between"
                            direction="row">
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Total" />
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{textAlign: "right"}}>
                                <FormattedMessage
                                    defaultMessage="{deductible} ({symbol})"
                                    values={{deductible, symbol}}
                                />
                            </Typography>
                        </Stack>

                        {tokenField === "token" ? (
                            <Form.Item
                                name="token"
                                label={intl.formatMessage(messages.token)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
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
                            <LoadingButton
                                onClick={() => submit(form)}
                                variant="contained">
                                {action}
                            </LoadingButton>
                        </Stack>
                    </Stack>
                );
            }}
        </Form.Item>
    );
};

export default Confirm;
