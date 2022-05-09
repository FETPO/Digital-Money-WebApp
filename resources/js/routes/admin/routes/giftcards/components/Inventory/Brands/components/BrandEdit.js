import React, {Fragment, useCallback, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {isEmpty} from "lodash";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    success: {defaultMessage: "Brand was updated."},
    editBrand: {defaultMessage: "Edit Brand"},
    name: {defaultMessage: "Name"},
    description: {defaultMessage: "Description"}
});

const BrandEdit = ({brand, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editBrand = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editBrand),
            content: <EditForm brand={brand} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, brand, reloadTable]);

    return (
        <Fragment>
            <IconButton {...props} onClick={editBrand}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, brand, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const params = {brand: brand.id};
            const routeName = "admin.giftcard.brand.update";
            formRequest
                .put(route(routeName, params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, brand, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(brand)) {
            form.resetFields();
        }
    }, [brand, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Stack spacing={2} sx={{mb: 3}}>
                <Form.Item
                    name="name"
                    initialValue={brand.name}
                    label={intl.formatMessage(messages.name)}
                    rules={[{required: true}]}>
                    <TextField fullWidth />
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={brand.description}
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

export default BrandEdit;
