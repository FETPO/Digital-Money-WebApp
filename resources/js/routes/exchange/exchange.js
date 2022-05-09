import React, {Fragment, useEffect} from "react";
import BaseRedirect from "components/BaseRedirect";
import {router} from "utils/index";
import ProtectedRoute from "components/ProtectedRoute";
import Result404 from "components/Result404";
import FallbackRoute from "components/FallbackRoute";
import Trade from "./routes/trade";
import {Switch} from "react-router-dom";
import Swap from "./routes/swap";
import {useWalletAccountSelector} from "hooks/account";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {useDispatch} from "react-redux";

const Exchange = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWalletAccounts());
        dispatch(fetchPaymentAccount());
    }, [dispatch]);

    useWalletAccountSelector();

    return (
        <Fragment>
            <BaseRedirect to={router.generatePath("exchange.trade")} />

            <Switch>
                <ProtectedRoute path={router.getPath("exchange.trade")}>
                    <Trade />
                </ProtectedRoute>

                <ProtectedRoute path={router.getPath("exchange.swap")}>
                    <Swap />
                </ProtectedRoute>

                <FallbackRoute>
                    <Result404 />
                </FallbackRoute>
            </Switch>
        </Fragment>
    );
};

export default Exchange;
