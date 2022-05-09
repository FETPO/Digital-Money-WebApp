import React, {useCallback, useEffect, useState} from "react";
import {Button, Grid, MenuItem, Stack} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import AddIcon from "@mui/icons-material/Add";
import {useModal} from "utils/modal";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";

const messages = defineMessages({
    success: {defaultMessage: "Wallet was added."},
    searchPlaceholder: {defaultMessage: "Search coin..."},
    addWallet: {defaultMessage: "Add Wallet"},
    confirmations: {defaultMessage: "Confirmations"},
    adapter: {defaultMessage: "Adapter"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addWallet = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addWallet),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, reloadTable]);

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />

            {modalElements}

            <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{whiteSpace: "nowrap"}}
                    onClick={addWallet}>
                    <FormattedMessage defaultMessage="Add Wallet" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [adapters, setAdapters] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchAdapters = useCallback(() => {
        request
            .get(route("admin.wallet.get-adapters"))
            .then((data) => setAdapters(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchAdapters();
    }, [fetchAdapters]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.wallet.create"), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Form.Item
                            name="adapter"
                            label={intl.formatMessage(messages.adapter)}
                            rules={[{required: true}]}>
                            <TextField fullWidth select>
                                {adapters.map((adapter, key) => (
                                    <MenuItem value={adapter.class} key={key}>
                                        {adapter.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Form.Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Form.Item
                            name="min_conf"
                            initialValue={3}
                            rules={[{required: true, type: "number"}]}
                            label={intl.formatMessage(messages.confirmations)}
                            normalize={(v) => parseInt(v) || 0}>
                            <TextField fullWidth />
                        </Form.Item>
                    </Grid>
                </Grid>

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

export default ActionBar;
