import React, {useCallback, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Alert, Box, Stack} from "@mui/material";
import {isEmpty} from "lodash";
import UpdateAddress from "./UpdateAddress";
import UploadDocument from "./UploadDocument";

const Advanced = ({data, onChange, ...props}) => {
    const [expanded, setExpanded] = useState();

    const expandedHandler = useCallback((panel) => {
        return (event, toggle) => {
            setExpanded(toggle && panel);
        };
    }, []);

    const renderVerification = (item) => {
        switch (item.name) {
            case "verified_address":
                return (
                    <UpdateAddress
                        onChange={onChange}
                        expandedHandler={expandedHandler}
                        data={item}
                        expanded={expanded}
                    />
                );
            case "verified_documents":
                return (
                    <UploadDocument
                        onChange={onChange}
                        expandedHandler={expandedHandler}
                        data={item}
                        expanded={expanded}
                    />
                );
        }
    };

    return (
        <Box {...props}>
            <Alert severity="warning">
                <FormattedMessage defaultMessage="This stage requires a manual verification by our support agents. Your data is kept private and encrypted within the system." />
            </Alert>

            {!isEmpty(data) && (
                <Stack spacing={3} sx={{pt: 3}}>
                    {data.map((item) => {
                        return (
                            <Box key={item.name}>
                                {renderVerification(item)}
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};

export default Advanced;
