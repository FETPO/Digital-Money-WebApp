import React, {useEffect} from "react";
import Assets from "./components/Assets";
import Transaction from "./components/Transaction";
import Action from "./components/Action";
import {defineMessages, useIntl} from "react-intl";
import Page from "components/Page";
import {Container, Grid} from "@mui/material";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import SelectAccount from "components/SelectAccount";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {useWalletAccountSelector} from "hooks/account";

const messages = defineMessages({
    title: {defaultMessage: "Wallets"}
});

const Wallets = () => {
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        dispatch(fetchWalletAccounts());
    }, [dispatch]);

    useWalletAccountSelector();

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs action={<SelectAccount />} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Assets />
                            </Grid>
                            <Grid item xs={12}>
                                <Action />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Transaction />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Wallets;
