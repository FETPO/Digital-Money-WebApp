import React, {Fragment, useCallback, useEffect, useState} from "react";
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
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {SelectAdornment, TextField} from "components/Form";
import Spin from "components/Spin";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {isEmpty} from "lodash";
import Result from "components/Result";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";

const messages = defineMessages({
    updated: {defaultMessage: "Withdrawal Fees were updated."},
    withdrawal: {defaultMessage: "Withdrawal"}
});

const WithdrawalFee = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [data, setData] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchData = useCallback(() => {
        request
            .get(route("admin.wallet.get-withdrawal-fees"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.wallet.update-withdrawal-fees"), values)
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
            const fee = wallet.withdrawal_fee;

            const typeSelect = (
                <Form.Item
                    name={["fees", id, "type"]}
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

            return (
                <Stack key={wallet.id} spacing={2} sx={{mb: 3}}>
                    <Typography variant="overline">
                        {wallet.coin.name}
                    </Typography>

                    <Form.Item
                        name={["fees", id, "value"]}
                        label={intl.formatMessage(messages.withdrawal)}
                        initialValue={fee?.value || 0}
                        rules={[{required: true}]}>
                        <TextField
                            type="number"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {typeSelect}
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                </Stack>
            );
        },
        [intl]
    );

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Withdrawal Fees" />}
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
                                                defaultMessage="The withdrawal fees are sent to the most recent {operator} user. You should make sure that the {operator} role is only assigned to the account you have access to."
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

export default WithdrawalFee;
