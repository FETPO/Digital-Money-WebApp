import React, {useCallback, useMemo} from "react";
import {useActiveWalletAccount, useWalletAccounts} from "hooks/account";
import Form, {SelectAdornment, TextField} from "components/Form";
import WalletAccount from "models/WalletAccount";
import IconBuilder from "components/IconBuilder";
import {Box, InputAdornment, MenuItem, Stack} from "@mui/material";
import {isEmpty, isNumber} from "lodash";
import {FormattedMessage} from "react-intl";

const InputValue = ({value, onChange, onBlur, fee}) => {
    const {data} = useWalletAccounts();
    const account = useActiveWalletAccount();

    const typeSelect = useMemo(
        () => (
            <Form.Item name="account" rules={[{required: true}]}>
                <SelectAdornment
                    renderValue={() => {
                        return (
                            !account.isEmpty() && (
                                <IconBuilder
                                    icon={account.wallet.coin.svgIcon()}
                                    sx={{fontSize: "25px"}}
                                />
                            )
                        );
                    }}>
                    {data.map((record) => {
                        const account = WalletAccount.use(record);
                        const icon = account.wallet.coin.svgIcon();
                        return (
                            <MenuItem value={account.id} key={account.id}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    display="flex">
                                    <IconBuilder
                                        sx={{fontSize: "25px"}}
                                        icon={icon}
                                    />

                                    <Box
                                        sx={{marginLeft: "10px"}}
                                        component="span">
                                        {account.wallet.coin.name}
                                    </Box>
                                </Stack>
                            </MenuItem>
                        );
                    })}
                </SelectAdornment>
            </Form.Item>
        ),
        [data, account]
    );

    const updateAmount = useCallback(
        (e) => {
            return onChange?.(value?.clone(e.target.value, "unit"));
        },
        [value, onChange]
    );

    const helperText = !account.isEmpty() ? (
        <Stack
            direction="row"
            component="span"
            divider={<span>&bull;</span>}
            spacing={1}>
            <span>
                <FormattedMessage
                    defaultMessage="Available: {available}"
                    values={{available: account.available}}
                />
            </span>
            {isNumber(fee) && (
                <span>
                    <FormattedMessage
                        defaultMessage="Fee: {fee}"
                        values={{fee}}
                    />
                </span>
            )}
        </Stack>
    ) : (
        <FormattedMessage defaultMessage="select account..." />
    );

    const content = useMemo(() => {
        return value?.scale === "unit" ? value.amount : value?.unitValue;
    }, [value]);

    return (
        <TextField
            fullWidth={true}
            value={content}
            disabled={isEmpty(value)}
            onChange={updateAmount}
            InputLabelProps={{shrink: true}}
            helperText={helperText}
            type="number"
            onBlur={onBlur}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">{typeSelect}</InputAdornment>
                )
            }}
        />
    );
};

export default InputValue;
