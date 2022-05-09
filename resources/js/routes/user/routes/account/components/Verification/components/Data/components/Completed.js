import React from "react";
import {SuccessIllustration} from "assets/index";
import {Box} from "@mui/material";
import {defineMessages, useIntl} from "react-intl";
import Result from "components/Result";

const messages = defineMessages({
    title: {defaultMessage: "Verification Complete."},
    description: {defaultMessage: "There are no further requirements for now."}
});

const Completed = (props) => {
    const intl = useIntl();
    return (
        <Box {...props}>
            <Result
                title={intl.formatMessage(messages.title)}
                description={intl.formatMessage(messages.description)}
                icon={SuccessIllustration}
                iconSize={130}
            />
        </Box>
    );
};

export default Completed;
