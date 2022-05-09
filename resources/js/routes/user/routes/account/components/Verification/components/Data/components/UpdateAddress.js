import React, {useCallback, useMemo} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const messages = defineMessages({
    unit: {defaultMessage: "Unit"},
    address: {defaultMessage: "Address"},
    postcode: {defaultMessage: "Postcode"},
    city: {defaultMessage: "City"},
    state: {defaultMessage: "State"},
    addressUpdated: {defaultMessage: "Your address was updated."},
    required: {defaultMessage: "Required"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"},
    data: {defaultMessage: "Data"}
});

const UpdateAddress = ({data, expanded, expandedHandler, onChange}) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const {address} = data;

    const disabled = useMemo(() => {
        return ["pending", "approved"].includes(address?.status);
    }, [address]);

    const statusChip = useMemo(() => {
        switch (address?.status) {
            case "pending":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.pending)}
                        color="info"
                    />
                );
            case "approved":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.approved)}
                        color="primary"
                    />
                );
            case "rejected":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.rejected)}
                        color="error"
                    />
                );
            default:
                return (
                    <Chip
                        label={intl.formatMessage(messages.required)}
                        size="small"
                    />
                );
        }
    }, [intl, address]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.verification.update-address"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.addressUpdated));
                    onChange?.();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, onChange]
    );

    const initialValues = useMemo(
        () => ({
            address: address?.address,
            unit: address?.unit,
            city: address?.city,
            postcode: address?.postcode,
            state: address?.state
        }),
        [address]
    );

    return (
        <Accordion
            expanded={!disabled && expanded === "verified_address"}
            disabled={disabled}
            onChange={expandedHandler("verified_address")}
            className="no-border">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={3}>
                    {statusChip}
                    <span>
                        <FormattedMessage defaultMessage="Submit Address" />
                    </span>
                </Stack>
            </AccordionSummary>

            <AccordionDetails>
                <Form
                    form={form}
                    initialValues={initialValues}
                    onFinish={submitForm}>
                    <Stack spacing={2}>
                        <Typography
                            variant="overline"
                            sx={{color: "text.secondary"}}>
                            <FormattedMessage defaultMessage="Address" />
                        </Typography>

                        <Form.Item
                            name="address"
                            label={intl.formatMessage(messages.address)}
                            rules={[{required: true}]}>
                            <TextField fullWidth />
                        </Form.Item>

                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={{xs: 3, sm: 2}}>
                            <Form.Item
                                name="unit"
                                label={intl.formatMessage(messages.unit)}
                                rules={[{required: true}]}>
                                <TextField fullWidth />
                            </Form.Item>

                            <Form.Item
                                name="city"
                                label={intl.formatMessage(messages.city)}
                                rules={[{required: true}]}>
                                <TextField fullWidth />
                            </Form.Item>
                        </Stack>

                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={{xs: 3, sm: 2}}>
                            <Form.Item
                                name="state"
                                label={intl.formatMessage(messages.state)}
                                rules={[{required: true}]}>
                                <TextField fullWidth />
                            </Form.Item>

                            <Form.Item
                                name="postcode"
                                label={intl.formatMessage(messages.postcode)}
                                rules={[{required: true}]}>
                                <TextField fullWidth />
                            </Form.Item>
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end">
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                loading={formLoading}>
                                <FormattedMessage defaultMessage="Save Changes" />
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Form>
            </AccordionDetails>
        </Accordion>
    );
};

export default UpdateAddress;
