import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Grid, InputAdornment} from "@mui/material";
import Form, {TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import LockIcon from "@mui/icons-material/Lock";

const messages = defineMessages({token: {defaultMessage: "Token"}});

const EnableForm = ({form, onFinish, loading}) => {
    const intl = useIntl();
    return (
        <Form form={form} onFinish={onFinish}>
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={8} md={6}>
                    <Form.Item
                        name="token"
                        label={intl.formatMessage(messages.token)}
                        rules={[{required: true}]}>
                        <TextField
                            size="small"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                </Grid>
                <Grid item xs={4} md={2}>
                    <LoadingButton
                        variant="contained"
                        fullWidth
                        type="submit"
                        loading={loading}>
                        <FormattedMessage defaultMessage="Verify" />
                    </LoadingButton>
                </Grid>
            </Grid>
        </Form>
    );
};

export default EnableForm;
