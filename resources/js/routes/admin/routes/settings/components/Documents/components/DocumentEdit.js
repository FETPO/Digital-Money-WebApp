import React, {Fragment, useCallback, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {isEmpty} from "lodash";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";

const messages = defineMessages({
    success: {defaultMessage: "Requirement was updated."},
    editDocument: {defaultMessage: "Edit Document"},
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"}
});

const DocumentEdit = ({document, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editDocument = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editDocument),
            content: <EditForm document={document} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, document, reloadTable]);

    return (
        <Fragment>
            <IconButton {...props} onClick={editDocument}>
                <EditIcon />
            </IconButton>
            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, document, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    useEffect(() => {
        if (!isEmpty(document)) {
            form.resetFields();
        }
    }, [document, form]);

    const submitForm = useCallback(
        (values) => {
            const params = {document: document.id};
            formRequest
                .put(route("admin.required-document.update", params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, document, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Stack spacing={2}>
                <Form.Item
                    name="name"
                    initialValue={document.name}
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={document.description}
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

export default DocumentEdit;
