import React, {memo, useCallback} from "react";
import WalletAccount from "models/WalletAccount";
import IconBuilder from "../IconBuilder";
import {useWalletAccounts, useActiveWalletAccount} from "hooks/account";
import {defineMessages, useIntl} from "react-intl";
import {setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, MenuItem, TextField} from "@mui/material";

const messages = defineMessages({
    placeholder: {defaultMessage: "Select account"}
});

const SelectAccount = memo(() => {
    const {data} = useWalletAccounts();
    const activeAccount = useActiveWalletAccount();
    const intl = useIntl();
    const dispatch = useDispatch();

    const updateAccount = useCallback(
        (e) => {
            dispatch(setActiveAccount(e.target.value));
        },
        [dispatch]
    );

    return (
        <Box sx={{minWidth: "200px"}}>
            <TextField
                size="small"
                fullWidth
                value={activeAccount.id || ""}
                label={intl.formatMessage(messages.placeholder)}
                onChange={updateAccount}
                select>
                {data.map((record) => {
                    const account = WalletAccount.use(record);
                    const icon = account.wallet.coin.svgIcon();
                    return (
                        <MenuItem value={account.id} key={account.id}>
                            <CoinStyle>
                                <IconBuilder
                                    sx={{fontSize: "25px"}}
                                    icon={icon}
                                />

                                <Box component="span" sx={{marginLeft: "10px"}}>
                                    {account.wallet.coin.name}
                                </Box>
                            </CoinStyle>
                        </MenuItem>
                    );
                })}
            </TextField>
        </Box>
    );
});

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

export default SelectAccount;
