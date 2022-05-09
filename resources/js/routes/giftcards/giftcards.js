import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {defineMessages, useIntl} from "react-intl";
import {fetchPaymentAccount} from "redux/slices/payment";
import Page from "components/Page";
import {Container} from "@mui/material";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {router} from "utils/index";
import BaseRedirect from "components/BaseRedirect";
import {Switch} from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import FallbackRoute from "components/FallbackRoute";
import Result404 from "components/Result404";
import Shop from "./components/Shop";
import Checkout from "./components/Checkout";

const messages = defineMessages({
    title: {defaultMessage: "Giftcards"}
});

const Giftcards = () => {
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        dispatch(fetchPaymentAccount());
    }, [dispatch]);

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs />
                <BaseRedirect to={router.generatePath("giftcards.shop")} />

                <Switch>
                    <ProtectedRoute path={router.getPath("giftcards.checkout")}>
                        <Checkout />
                    </ProtectedRoute>

                    <ProtectedRoute path={router.getPath("giftcards.shop")}>
                        <Shop />
                    </ProtectedRoute>

                    <FallbackRoute>
                        <Result404 />
                    </FallbackRoute>
                </Switch>
            </Container>
        </Page>
    );
};

export default Giftcards;
