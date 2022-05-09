import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import React, {Fragment, useCallback, useEffect} from "react";
import {IconButton, InputAdornment, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {castArray, isEmpty} from "lodash";
import FlagIcon from "components/FlagIcon";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    searchPlaceholder: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    locales: {defaultMessage: "Locales"},
    editTranslation: {defaultMessage: "Edit Translation"}
});

const TranslationEdit = ({
    locales,
    translation,
    reloadTable,
    group,
    ...props
}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editTranslation = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editTranslation),
            content: (
                <EditForm
                    locales={locales}
                    translation={translation}
                    reloadTable={reloadTable}
                    group={group}
                />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, translation, reloadTable, group, locales]);

    return (
        <Fragment>
            <IconButton {...props} onClick={editTranslation}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, translation, locales, group, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const routeName = "admin.locale.group.update";
            formRequest
                .patch(route(routeName, {group}), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.updateSuccess));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, group, reloadTable]
    );

    const getValue = useCallback(
        (code) => {
            return translation[code]?.[0]?.value;
        },
        [translation]
    );

    useEffect(() => {
        if (!isEmpty(translation)) {
            form.resetFields();
        }
    }, [translation, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Stack spacing={2} sx={{mb: 3}}>
                <Form.Item
                    name="key"
                    initialValue={translation.key}
                    label={intl.formatMessage(messages.key)}
                    rules={[{required: true}]}>
                    <TextField fullWidth disabled />
                </Form.Item>

                {castArray(locales).map((locale) => (
                    <Form.Item
                        key={locale.locale}
                        name={["locales", locale.locale]}
                        initialValue={getValue(locale.locale)}
                        label={locale.locale}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlagIcon code={locale.region} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                ))}
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

export default TranslationEdit;
