import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import {FormattedMessage} from "react-intl";
import {Stack, Typography} from "@mui/material";

const PaymentTable = {
    status: ({row: transaction}) => {
        if (transaction.status !== "canceled") {
            const completed = transaction.status === "completed";

            switch (transaction.type) {
                case "receive":
                    return (
                        <ArrowCircleDownIcon
                            color={completed ? "success" : "disabled"}
                            fontSize="large"
                        />
                    );
                case "send":
                    return (
                        <ArrowCircleUpIcon
                            color={completed ? "error" : "disabled"}
                            fontSize="large"
                        />
                    );
            }
        } else {
            return <HighlightOffIcon color="disabled" fontSize="large" />;
        }
    },
    value: ({row: transaction}) => {
        const negative = transaction.type === "send";
        let statusMessage;

        switch (transaction.status) {
            case "canceled":
                statusMessage = <FormattedMessage defaultMessage="Canceled" />;
                break;
            case "pending-gateway":
            case "pending-transfer":
                statusMessage = <FormattedMessage defaultMessage="Pending" />;
                break;
            case "completed":
                statusMessage = <FormattedMessage defaultMessage="Completed" />;
                break;
        }

        return (
            <Stack alignItems="flex-end" sx={{width: "100%"}}>
                <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                    {negative && "-"}
                    {transaction.formatted_value}
                </Typography>
                <Typography
                    sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                    variant="caption">
                    {statusMessage}
                </Typography>
            </Stack>
        );
    }
};

export default PaymentTable;
