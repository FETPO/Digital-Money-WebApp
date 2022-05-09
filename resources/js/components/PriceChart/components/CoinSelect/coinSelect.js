import React from "react";
import IconBuilder from "components/IconBuilder";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, MenuItem, TextField} from "@mui/material";
import {useWallets} from "hooks/global";
import Wallet from "models/Wallet";

const CoinSelect = ({selectedWallet, setSelected}) => {
    const {wallets} = useWallets();
    return (
        <BaseStyle>
            <TextField
                size="small"
                value={selectedWallet.id || ""}
                onChange={(e) => setSelected(e.target.value)}
                variant="outlined"
                select>
                {wallets.map((record) => {
                    const wallet = Wallet.use(record);
                    const icon = wallet.coin.svgIcon();

                    return (
                        <MenuItem value={wallet.id} key={wallet.id}>
                            <CoinStyle>
                                <IconBuilder
                                    sx={{fontSize: "25px"}}
                                    icon={icon}
                                />

                                <Box component="span" sx={{marginLeft: "10px"}}>
                                    {wallet.coin.name}
                                </Box>
                            </CoinStyle>
                        </MenuItem>
                    );
                })}
            </TextField>
        </BaseStyle>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

const BaseStyle = styled("div")(() => ({
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column"
}));

export default CoinSelect;
