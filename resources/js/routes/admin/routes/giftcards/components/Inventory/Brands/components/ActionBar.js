import React, {useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {Button, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    success: {defaultMessage: "Brand was created."},
    searchPlaceholder: {defaultMessage: "Search brand..."},
    createBrand: {defaultMessage: "Create Brand"},
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const createBrand = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.createBrand),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [intl, reloadTable, modal]);

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
                    onClick={createBrand}>
                    <FormattedMessage defaultMessage="Create" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const routeName = "admin.giftcard.brand.create";
            formRequest
                .post(route(routeName), values)
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
            <Stack spacing={2} sx={{mb: 3}}>
                <Form.Item
                    name="name"
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={intl.formatMessage(messages.description)}
                    rules={[{required: true}]}>
                    <TextField fullWidth multiline rows={3} />
                </Form.Item>
            </Stack>

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

export default ActionBar;
