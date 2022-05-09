import React, {useCallback, useEffect} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {Button, MenuItem, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {MultiSelect, TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {useDispatch} from "react-redux";
import {fetchOperatingCountries} from "redux/slices/global";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {useOperatingCountries} from "hooks/global";

const messages = defineMessages({
    success: {defaultMessage: "Bank was created."},
    searchPlaceholder: {defaultMessage: "Search bank..."},
    addBank: {defaultMessage: "Add Bank"},
    name: {defaultMessage: "Name"},
    operatingCountries: {defaultMessage: "Operating Countries"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addBank = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addBank),
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
                    onClick={addBank}>
                    <FormattedMessage defaultMessage="Add Bank" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
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
            const routeName = "admin.bank.create";
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
            <Spin spinning={loading}>
                <Stack spacing={2} sx={{mb: 3}}>
                    <Form.Item
                        name="name"
                        label={intl.formatMessage(messages.name)}
                        rules={[{required: true}]}>
                        <TextField fullWidth />
                    </Form.Item>

                    <Form.Item
                        name="operating_countries"
                        label={intl.formatMessage(messages.operatingCountries)}
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
