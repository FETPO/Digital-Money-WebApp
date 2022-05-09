import React, {useCallback, useMemo} from "react";
import {isEmpty, isNumber} from "lodash";
import {InputAdornment, Link, Stack} from "@mui/material";
import {TextField} from "components/Form";
import {usePaymentAccount} from "hooks/account";
import {FormattedMessage} from "react-intl";
import {Link as RouterLink} from "react-router-dom";
import {router} from "utils/index";

const InputPrice = ({value, onChange, onBlur, fee}) => {
    const {account} = usePaymentAccount();

    const updateAmount = useCallback(
        (e) => {
            return onChange?.(value?.clone(e.target.value, "price"));
        },
        [value, onChange]
    );

    const helperText = !account.isEmpty() && (
        <Stack
            direction="row"
            justifyContent="space-between"
            component="span"
            spacing={1}>
            <Stack
                direction="row"
                divider={<span>&bull;</span>}
                component="span"
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

            <span>
                <Link
                    component={RouterLink}
                    underline="none"
                    to={{
                        pathname: router.generatePath("user.account"),
                        state: {tab: "preferences"}
                    }}>
                    <FormattedMessage defaultMessage="Change" />
                </Link>
            </span>
        </Stack>
    );

    const content = useMemo(() => {
        return value?.scale === "price" ? value.amount : value?.priceValue;
    }, [value]);

    return (
        <TextField
            fullWidth={true}
            disabled={isEmpty(value)}
            value={content}
            onChange={updateAmount}
            InputLabelProps={{shrink: true}}
            helperText={helperText}
            type="number"
            onBlur={onBlur}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {account.symbolIcon()}
                    </InputAdornment>
                )
            }}
        />
    );
};

export default InputPrice;
