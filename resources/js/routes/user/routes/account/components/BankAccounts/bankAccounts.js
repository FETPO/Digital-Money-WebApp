import React, {useCallback, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAuth} from "models/Auth";
import {isEmpty} from "lodash";
import Result from "components/Result";
import {CountryIllustration} from "assets/index";
import {parseDate} from "utils/form";
import {useModal} from "utils/modal";
import AddAccount from "./components/AddAccount";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";
import PopConfirm from "components/PopConfirm";
import AddIcon from "@mui/icons-material/Add";
import BankLogo from "components/BankLogo";

const messages = defineMessages({
    submit: {defaultMessage: "Submit"},
    addAccount: {defaultMessage: "Add Account"}
});

const BankAccounts = () => {
    const auth = useAuth();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [accounts, setAccounts] = useState([]);
    const [modal, modalElements] = useModal();

    const fetchAccounts = useCallback(() => {
        request
            .get(route("bank.get-accounts"))
            .then((data) => setAccounts(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        if (auth.countryOperation()) {
            fetchAccounts();
        }
    }, [fetchAccounts, auth]);

    const deleteAccount = useCallback(
        (id) => {
            request
                .delete(route("bank.account.delete", {id}))
                .then(() => fetchAccounts())
                .catch(errorHandler());
        },
        [request, fetchAccounts]
    );

    const addAccount = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addAccount),
            content: <AddAccount fetchAccounts={fetchAccounts} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, fetchAccounts]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Bank Accounts" />}
                action={
                    auth.countryOperation() && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addAccount}>
                            <FormattedMessage defaultMessage="Add" />
                        </Button>
                    )
                }
            />

            {modalElements}

            <CardContent>
                <Spin spinning={loading}>
                    {auth.countryOperation() ? (
                        isEmpty(accounts) ? (
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="Nothing here!" />
                                }
                                description={
                                    <FormattedMessage defaultMessage="You have not added a bank account yet." />
                                }
                            />
                        ) : (
                            <Grid container spacing={3}>
                                {accounts.map((account, key) => {
                                    const added = parseDate(account.created_at);

                                    const bankInfo = (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                my: 1,
                                                minWidth: 0
                                            }}>
                                            <Typography
                                                variant="subtitle1"
                                                noWrap>
                                                {account.bank_name}
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                {`${account.number} (${account.currency})`}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                spacing={2}>
                                                <Typography
                                                    noWrap
                                                    color="text.disabled"
                                                    variant="caption">
                                                    <FormattedMessage
                                                        defaultMessage="added {date}"
                                                        values={{
                                                            date: added.fromNow()
                                                        }}
                                                    />
                                                </Typography>

                                                <PopConfirm
                                                    component={IconButton}
                                                    content={
                                                        <FormattedMessage defaultMessage="Are you sure?" />
                                                    }
                                                    onClick={() =>
                                                        deleteAccount(
                                                            account.id
                                                        )
                                                    }
                                                    size="small">
                                                    <DeleteIcon fontSize="inherit" />
                                                </PopConfirm>
                                            </Stack>
                                        </Box>
                                    );

                                    const bankIcon = (
                                        <BankLogo src={account.bank_logo} />
                                    );

                                    return (
                                        <Grid
                                            key={key}
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}>
                                            <Paper
                                                variant="outlined"
                                                sx={{p: 1.5}}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}>
                                                    {bankIcon}
                                                    {bankInfo}
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        )
                    ) : (
                        <Result
                            title={
                                <FormattedMessage defaultMessage="Country Unsupported" />
                            }
                            icon={CountryIllustration}
                            description={
                                <FormattedMessage defaultMessage="We are currently not available in your country." />
                            }
                        />
                    )}
                </Spin>
            </CardContent>
        </Card>
    );
};

export default BankAccounts;
