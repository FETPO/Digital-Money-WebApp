import React, {Fragment, useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {isEmpty} from "lodash";
import IconBuilder from "components/IconBuilder";
import Wallet from "models/Wallet";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import Form, {TextField} from "components/Form";
import AddIcon from "@mui/icons-material/Add";
import {Box, Button, MenuItem, Stack} from "@mui/material";
import Spin from "components/Spin";
import {experimentalStyled as styled} from "@mui/material/styles";
import Result from "components/Result";
import {useModal} from "utils/modal";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    title: {defaultMessage: "Add Account"},
    coin: {defaultMessage: "Select Coin"},
    submit: {defaultMessage: "Submit"}
});

const AddAccount = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const showModal = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.title),
            content: <ModalContent />
        });
    }, [intl, modal]);

    return (
        <Fragment>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={showModal}>
                <FormattedMessage defaultMessage="Add Account" />
            </Button>
            {modalElements}
        </Fragment>
    );
};

const ModalContent = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();
    const [wallets, setWallets] = useState([]);
    const dispatch = useDispatch();

    const fetchWallets = useCallback(() => {
        request
            .get(route("wallet.unused"))
            .then((data) => setWallets(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const submitForm = useCallback(
        (values) => {
            const wallet = values.wallet;
            formRequest
                .post(route("wallet.create-account", {wallet}))
                .then(() => {
                    form.resetFields();
                    fetchWallets();
                    dispatch(fetchWalletAccounts());
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [dispatch, closeModal, formRequest, fetchWallets, form]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                {!isEmpty(wallets) ? (
                    <Form.Item
                        name="wallet"
                        label={intl.formatMessage(messages.coin)}
                        rules={[{required: true}]}>
                        <TextField fullWidth select sx={{minWidth: 200}}>
                            {wallets.map((record) => {
                                const wallet = Wallet.use(record);
                                const icon = wallet.coin.svgIcon();
                                return (
                                    <MenuItem key={wallet.id} value={wallet.id}>
                                        <CoinStyle>
                                            <IconBuilder
                                                sx={{fontSize: "25px"}}
                                                icon={icon}
                                            />

                                            <Box component="span" sx={{ml: 1}}>
                                                {wallet.coin.name}
                                            </Box>
                                        </CoinStyle>
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Form.Item>
                ) : (
                    <Result
                        title={
                            <FormattedMessage defaultMessage="No wallets!" />
                        }
                        description={
                            <FormattedMessage defaultMessage="There are no new wallets available." />
                        }
                        iconSize={130}
                        sx={{py: 4}}
                    />
                )}

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading || isEmpty(wallets)}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

export default AddAccount;
