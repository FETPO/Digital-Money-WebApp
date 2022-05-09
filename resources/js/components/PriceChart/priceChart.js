import React, {useMemo, useState} from "react";
import CoinSelect from "./components/CoinSelect";
import Price from "./components/Price";
import Chart from "./components/Chart";
import RangeSelect from "./components/RangeSelect";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {experimentalStyled as styled} from "@mui/material/styles";
import {useWallets} from "hooks/global";
import {find, first} from "lodash";
import Wallet from "models/Wallet";

const PriceChart = () => {
    const {wallets} = useWallets();
    const [selected, setSelected] = useState();
    const [range, setRange] = useState("hour");

    const selectedWallet = useMemo(() => {
        if (selected) {
            return Wallet.use(find(wallets, {id: selected}));
        } else {
            return Wallet.use(first(wallets));
        }
    }, [selected, wallets]);

    return (
        <StyledResponsiveCard>
            <BaseStyle>
                <ContainerData>
                    <Price selectedWallet={selectedWallet} />
                    <CoinSelect
                        setSelected={setSelected}
                        selectedWallet={selectedWallet}
                    />
                </ContainerData>

                <ContainerChart>
                    <Chart selectedWallet={selectedWallet} range={range} />
                    <RangeSelect setRange={setRange} range={range} />
                </ContainerChart>
            </BaseStyle>
        </StyledResponsiveCard>
    );
};

const StyledResponsiveCard = styled(ResponsiveCard)(() => ({
    overflow: "hidden",
    padding: 0
}));

const BaseStyle = styled("div")(() => ({
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    flexDirection: "column"
}));

const ContainerData = styled("div")(() => ({
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    minHeight: 130
}));

const ContainerChart = styled("div")(() => ({
    flexGrow: 1,
    position: "relative",
    minHeight: 0
}));

PriceChart.dimensions = {
    lg: {w: 6, h: 3, isResizable: false},
    md: {w: 4, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default PriceChart;
