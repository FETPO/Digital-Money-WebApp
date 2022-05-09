import React from "react";
import App from "./app";
import {HelmetProvider} from "react-helmet-async";
import {useIntl} from "react-intl";
import {getValidationMessages} from "utils/form";
import MuiBootstrap from "components/MuiBootstrap";
import Form from "components/Form";

const Bootstrap = () => {
    const intl = useIntl();

    return (
        <HelmetProvider>
            <MuiBootstrap>
                <Form.Provider validateMessages={getValidationMessages(intl)}>
                    <App />
                </Form.Provider>
            </MuiBootstrap>
        </HelmetProvider>
    );
};

export default Bootstrap;
