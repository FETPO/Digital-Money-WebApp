import React, {Fragment, useCallback, useEffect, useMemo} from "react";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {useModal} from "utils/modal";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {notify} from "utils/index";
import {
    Box,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {isEmpty, toUpper} from "lodash";
import Dropdown from "components/Dropdown";
import LoadingIcon from "components/LoadingIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Form, {ControlLabel, TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarRateIcon from "@mui/icons-material/StarRate";
import {useExchangeBaseCurrency} from "hooks/settings";

const messages = defineMessages({
    defaultSuccess: {defaultMessage: "Currency was set as default."},
    updateSuccess: {defaultMessage: "Currency was updated successfully."},
    updateRate: {defaultMessage: "Update {currency} Rate"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"},
    currency: {defaultMessage: "Currency"}
});

const CurrencyMenu = ({currency, reloadTable, ...props}) => {
    const [request, loading] = useRequest();
    const [modal, modalElements] = useModal();
    const intl = useIntl();

    const baseCurrency = useExchangeBaseCurrency();

    const makeDefault = useCallback(() => {
        const params = {currency: currency.code};
        request
            .post(
                route("admin.payment.supported-currency.make-default", params)
            )
            .then(() => {
                notify.success(intl.formatMessage(messages.defaultSuccess));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, currency, intl, reloadTable]);

    const updateRate = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.updateRate, {
                currency: currency.code
            }),
            content: (
                <UpdateForm currency={currency} reloadTable={reloadTable} />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, currency, intl, reloadTable]);

    const menuItems = useMemo(() => {
        const items = [];

        if (toUpper(baseCurrency) !== toUpper(currency.code)) {
            items.push(
                <MenuItem key={1} onClick={updateRate}>
                    <TrendingUpIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Update Rate" />
                </MenuItem>
            );
        }

        if (!currency.default) {
            items.push(
                <MenuItem key={0} onClick={makeDefault}>
                    <StarRateIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Make Default" />
                </MenuItem>
            );
        }

        return items;
    }, [makeDefault, currency, updateRate, baseCurrency]);

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

const UpdateForm = ({closeModal, currency, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);

    const submitForm = useCallback(
        (values) => {
            const params = {currency: currency.code};
            formRequest
                .post(
                    route("admin.payment.supported-currency.update", params),
                    values
                )
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.updateSuccess));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable, currency]
    );

    useEffect(() => {
        if (!isEmpty(currency)) {
            form.resetFields();
        }
    }, [currency, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Box sx={{mt: 0}}>
                <Typography sx={{color: "text.secondary"}} variant="overline">
                    <FormattedMessage defaultMessage="Exchange Rate" />
                </Typography>
            </Box>

            <Stack spacing={2}>
                <Form.Item
                    name="manual"
                    label={intl.formatMessage(messages.manual)}
                    initialValue={currency.exchange_type === "manual"}
                    valuePropName="checked">
                    <ControlLabel>
                        <Switch />
                    </ControlLabel>
                </Form.Item>

                <Form.Item
                    name="exchange_rate"
                    label={intl.formatMessage(messages.rate)}
                    getValueProps={(value) => {
                        const disabled = !form.getFieldValue("manual");
                        return {value, disabled};
                    }}
                    dependencies={["manual"]}
                    initialValue={currency.exchange_rate}
                    rules={[{required: true}]}>
                    <TextField type="number" fullWidth />
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

export default CurrencyMenu;
