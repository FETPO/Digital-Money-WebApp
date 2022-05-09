import React, {Fragment, useCallback, useEffect, useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {Grid, IconButton, MenuItem, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {MultiSelect, TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {useDispatch} from "react-redux";
import {intersection, isEmpty, map} from "lodash";
import {fetchOperatingCountries} from "redux/slices/global";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import UploadPhoto from "components/UploadPhoto";
import {useOperatingCountries} from "hooks/global";

const messages = defineMessages({
    success: {defaultMessage: "Bank was updated."},
    editBank: {defaultMessage: "Edit Bank"},
    name: {defaultMessage: "Name"},
    operatingCountries: {defaultMessage: "Operating Countries"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    caption: {defaultMessage: "Allowed *.jpeg, *.jpg, *.png"},
    rate: {defaultMessage: "Rate"}
});

const BankEdit = ({bank, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editBank = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editBank),
            content: <EditForm bank={bank} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, bank, reloadTable]);

    return (
        <Fragment>
            <IconButton {...props} onClick={editBank}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, bank, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const dispatch = useDispatch();

    const {countries, loading} = useOperatingCountries();

    useEffect(() => {
        dispatch(fetchOperatingCountries());
    }, [dispatch]);

    const submitForm = useCallback(
        (values) => {
            const params = {bank: bank.id};
            const routeName = "admin.bank.update";
            formRequest
                .put(route(routeName, params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, bank, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(countries) && !isEmpty(bank)) {
            form.resetFields();
        }
    }, [bank, form, countries]);

    const initialOperatingCountries = useMemo(() => {
        return intersection(
            map(bank.operating_countries, "code"),
            map(countries, "code")
        );
    }, [bank, countries]);

    const editForm = (
        <Stack spacing={2} sx={{mb: 3}}>
            <Form.Item
                name="name"
                initialValue={bank.name}
                label={intl.formatMessage(messages.name)}
                rules={[{required: true}]}>
                <TextField fullWidth />
            </Form.Item>

            <Form.Item
                name="operating_countries"
                label={intl.formatMessage(messages.operatingCountries)}
                initialValue={initialOperatingCountries}
                rules={[{required: true}]}>
                <MultiSelect fullWidth>
                    {countries.map((country, key) => (
                        <MenuItem key={key} value={country.code}>
                            {country.name}
                        </MenuItem>
                    ))}
                </MultiSelect>
            </Form.Item>
        </Stack>
    );

    const uploadUrl = useMemo(() => {
        return route("admin.bank.set-logo", {bank: bank.id});
    }, [bank]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <UploadPhoto
                            action={uploadUrl}
                            caption={intl.formatMessage(messages.caption)}
                            preview={bank.logo}
                            onSuccess={reloadTable}
                            rounded={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        {editForm}
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

export default BankEdit;
