import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {Button, MenuItem, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import Spin from "components/Spin";

const messages = defineMessages({
    success: {defaultMessage: "Country was added."},
    searchPlaceholder: {defaultMessage: "Search country..."},
    addCountry: {defaultMessage: "Add Country"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"},
    country: {defaultMessage: "Country"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addCountry = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addCountry),
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
                    onClick={addCountry}>
                    <FormattedMessage defaultMessage="Add Country" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [countries, setCountries] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchCountries = useCallback(() => {
        request
            .get(route("admin.bank.get-available-countries"))
            .then((data) => setCountries(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const submitForm = useCallback(
        (values) => {
            const routeName = "admin.bank.operating-country.create";
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
                <Form.Item
                    name="code"
                    label={intl.formatMessage(messages.country)}
                    rules={[{required: true}]}>
                    <TextField fullWidth select>
                        {countries.map((country, key) => (
                            <MenuItem value={country.code} key={key}>
                                {`${country.name} (${country.code})`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Form.Item>

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
