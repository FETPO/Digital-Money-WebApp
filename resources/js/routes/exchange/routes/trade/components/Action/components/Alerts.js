import React from "react";
import Alert from "components/Alert";
import {FormattedMessage} from "react-intl";
import {Stack} from "@mui/material";
import Form from "components/Form";

const Alerts = ({tokenField, insufficient}) => {
    return (
        <Stack spacing={2} sx={{mb: 3}}>
            <Form.Item shouldUpdate>
                {(form) => {
                    return form.getFieldError(tokenField).map((error, i) => (
                        <Alert key={i} severity="error">
                            {error}
                        </Alert>
                    ));
                }}
            </Form.Item>

            <Form.Item shouldUpdate>
                {(form) =>
                    insufficient(form) && (
                        <Alert severity="error">
                            <FormattedMessage defaultMessage="You don't have enough to trade." />
                        </Alert>
                    )
                }
            </Form.Item>
        </Stack>
    );
};

export default Alerts;
