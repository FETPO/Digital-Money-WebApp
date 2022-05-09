import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import React, {Fragment, useCallback} from "react";
import {Button, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    title: {defaultMessage: "Manage Locales"},
    name: {defaultMessage: "Name"},
    native: {defaultMessage: "Native"},
    code: {defaultMessage: "ISO-2 Code"},
    region: {defaultMessage: "Region"},
    addSuccess: {defaultMessage: "Locale was added."},
    importSuccess: {defaultMessage: "Import was successful."},
    removeSuccess: {defaultMessage: "Locale was removed."},
    addLocale: {defaultMessage: "Add Locale"},
    confirm: {defaultMessage: "Are you sure?"},
    selectGroup: {defaultMessage: "Select Group"},
    overwrite: {defaultMessage: "Overwrite"}
});

const Action = ({reloadTable}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addLocale = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addLocale),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [intl, reloadTable, modal]);

    return (
        <Fragment>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{whiteSpace: "nowrap"}}
                onClick={addLocale}>
                <FormattedMessage defaultMessage="Add Locale" />
            </Button>
            {modalElements}
        </Fragment>
    );
};

const CreateForm = ({reloadTable, closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.locale.add"), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.addSuccess));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Form.Item
                name="locale"
                label={intl.formatMessage(messages.code)}
                rules={[{required: true}]}>
                <TextField fullWidth />
            </Form.Item>

            <Stack direction="row" sx={{my: 2}} justifyContent="flex-end">
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

export default Action;
