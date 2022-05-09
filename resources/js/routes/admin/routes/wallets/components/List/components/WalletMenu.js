import React, {Fragment, useCallback, useMemo} from "react";
import {useModal} from "utils/modal";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty, keys} from "lodash";
import Dropdown from "components/Dropdown";
import {Box, IconButton, MenuItem, Stack} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {notify} from "utils/index";
import Form, {TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import LoadingIcon from "components/LoadingIcon";
import AntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import CompressIcon from "@mui/icons-material/Compress";
import ArticleIcon from "@mui/icons-material/Article";
import Table from "components/Table";

const messages = defineMessages({
    value: {defaultMessage: "Value"},
    key: {defaultMessage: "Key"},
    webhookReset: {defaultMessage: "Wallet webhook was reset."},
    transactionRelayed: {defaultMessage: "Wallet transaction was relayed."},
    consolidate: {defaultMessage: "Consolidate"},
    properties: {defaultMessage: "Properties"},
    addressConsolidated: {defaultMessage: "Address was consolidated"},
    relayTransaction: {defaultMessage: "Relay Transaction"},
    hash: {defaultMessage: "Hash"},
    address: {defaultMessage: "Address"}
});

const WalletMenu = ({wallet, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();
    const [request, loading] = useRequest();

    const showProperties = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.properties),
            content: <Properties wallet={wallet} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, wallet, reloadTable]);

    const resetWebhook = useCallback(() => {
        const params = {
            identifier: wallet.coin.identifier
        };
        request
            .post(route("admin.wallet.reset-webhook", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.webhookReset));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, wallet, intl, reloadTable]);

    const relayTransaction = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.relayTransaction),
            content: (
                <RelayTransaction wallet={wallet} reloadTable={reloadTable} />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, wallet, intl, reloadTable]);

    const consolidate = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.consolidate),
            content: <Consolidate wallet={wallet} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, wallet, intl, reloadTable]);

    const menuItems = useMemo(() => {
        const items = [];

        items.push(
            <MenuItem key={0} onClick={resetWebhook}>
                <AntennaIcon sx={{mr: 2}} />
                <FormattedMessage defaultMessage="Reset Webhook" />
            </MenuItem>
        );

        items.push(
            <MenuItem key={1} onClick={relayTransaction}>
                <RssFeedIcon sx={{mr: 2}} />
                <FormattedMessage defaultMessage="Relay Transaction" />
            </MenuItem>
        );

        if (wallet.consolidates) {
            items.push(
                <MenuItem key={2} onClick={consolidate}>
                    <CompressIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Consolidate" />
                </MenuItem>
            );
        }

        if (wallet.properties) {
            items.push(
                <MenuItem key={3} onClick={showProperties}>
                    <ArticleIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Show Properties" />
                </MenuItem>
            );
        }

        return items;
    }, [wallet, showProperties, resetWebhook, relayTransaction, consolidate]);

    if (isEmpty(menuItems)) {
        return null;
    }

    return (
        <Fragment>
            <Dropdown menuItems={menuItems} component={IconButton} {...props}>
                <LoadingIcon component={MoreVertIcon} loading={loading} />
            </Dropdown>

            {modalElements}
        </Fragment>
    );
};

const RelayTransaction = ({closeModal, wallet, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const params = {identifier: wallet.coin.identifier};
            formRequest
                .post(route("admin.wallet.relay-transaction", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(
                        intl.formatMessage(messages.transactionRelayed)
                    );
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, wallet, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item name="hash" label={intl.formatMessage(messages.hash)}>
                <TextField fullWidth />
            </Form.Item>

            <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

const Properties = ({wallet}) => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "id",
                width: 150,
                headerName: intl.formatMessage(messages.key)
            },
            {
                field: "value",
                minWidth: 300,
                flex: 1,
                headerName: intl.formatMessage(messages.value)
            }
        ],
        [intl]
    );

    const data = keys(wallet.properties).map((key) => {
        return {id: key, value: wallet.properties[key]};
    });

    return (
        <Box sx={{mx: -3}}>
            <Table columns={columns} rows={data} />
        </Box>
    );
};

const Consolidate = ({closeModal, wallet, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const params = {identifier: wallet.coin.identifier};
            formRequest
                .post(route("admin.wallet.consolidate", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(
                        intl.formatMessage(messages.addressConsolidated)
                    );
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, wallet, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="address"
                label={intl.formatMessage(messages.address)}>
                <TextField fullWidth />
            </Form.Item>

            <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

export default WalletMenu;
