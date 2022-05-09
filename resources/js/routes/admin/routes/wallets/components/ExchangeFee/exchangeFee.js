import React, {Fragment, useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {SelectAdornment, TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {
    Alert,
    Card,
    CardContent,
    CardHeader,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import Spin from "components/Spin";
import {isEmpty} from "lodash";
import {LoadingButton} from "@mui/lab";
import Result from "components/Result";

const messages = defineMessages({
    updated: {defaultMessage: "Exchange Fees were updated."},
    buy: {defaultMessage: "Buy"},
    sell: {defaultMessage: "Sell"}
});

const ExchangeFee = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [data, setData] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchData = useCallback(() => {
        request
            .get(route("admin.wallet.get-exchange-fees"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.wallet.update-exchange-fees"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.updated));
                    fetchData();
                })
                .catch(errorHandler());
        },
        [intl, formRequest, fetchData]
    );

    const renderInput = useCallback(
        (wallet) => {
            const id = wallet.coin.identifier;

            const sellFee = wallet.exchange_fees.find((o) => {
                return o.category === "sell";
            });

            const buyFee = wallet.exchange_fees.find((o) => {
                return o.category === "buy";
            });

            const typeSelect = (fee, category) => (
                <Form.Item
                    name={["fees", id, category, "type"]}
                    initialValue={fee?.type || "percent"}>
                    <SelectAdornment>
                        <MenuItem value="fixed">
                            <FormattedMessage defaultMessage="Fixed" />
                        </MenuItem>
                        <MenuItem value="percent">
                            <FormattedMessage defaultMessage="Percent" />
                        </MenuItem>
                    </SelectAdornment>
                </Form.Item>
            );

            const textField = (fee, category) => (
                <TextField
                    type="number"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {typeSelect(fee, category)}
                            </InputAdornment>
                        )
                    }}
                />
            );

            return (
                <Stack key={wallet.id} spacing={2} sx={{mb: 3}}>
                    <Typography variant="overline">
                        {wallet.coin.name}
                    </Typography>

                    <Stack spacing={2} direction="row">
                        <Form.Item
                            name={["fees", id, "buy", "value"]}
                            label={intl.formatMessage(messages.buy)}
                            initialValue={buyFee?.value || 0}
                            rules={[{required: true}]}>
                            {textField(buyFee, "buy")}
                        </Form.Item>

                        <Form.Item
                            name={["fees", id, "sell", "value"]}
                            label={intl.formatMessage(messages.sell)}
                            initialValue={sellFee?.value || 0}
                            rules={[{required: true}]}>
                            {textField(sellFee, "sell")}
                        </Form.Item>
                    </Stack>
                </Stack>
            );
        },
        [intl]
    );

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Exchange Fees" />}
            />

            <CardContent>
                <Form form={form} onFinish={submitForm}>
                    <Spin spinning={loading}>
                        {!isEmpty(data) ? (
                            <Fragment>
                                <Grid
                                    container
                                    justifyContent="center"
                                    spacing={2}>
                                    <Grid item xs={12}>
                                        <Alert severity="warning" sx={{mb: 3}}>
                                            <FormattedMessage
                                                defaultMessage="Exchange transactions are executed by the most recent {operator} user. You should make sure that the {operator} role is only assigned to the account you have access to."
                                                values={{
                                                    operator: <b>Operator</b>
                                                }}
                                            />
                                        </Alert>

                                        {data.map(renderInput)}
                                    </Grid>
                                </Grid>

                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    sx={{mt: 3}}>
                                    <LoadingButton
                                        variant="contained"
                                        type="submit"
                                        loading={formLoading}>
                                        <FormattedMessage defaultMessage="Save Changes" />
                                    </LoadingButton>
                                </Stack>
                            </Fragment>
                        ) : (
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="No wallets yet." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="You have not added any wallet." />
                                }
                            />
                        )}
                    </Spin>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ExchangeFee;
