import {Stack, Tooltip, Typography} from "@mui/material";
import Copyable from "../Copyable";
import {FormattedMessage} from "react-intl";
import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

const WalletTable = {
    description: ({row: transaction}) => {
        return (
            <TxAbout>
                <Typography noWrap variant="caption">
                    {transaction.description}
                </Typography>

                {transaction.hash && (
                    <Copyable
                        text={transaction.hash}
                        buttonProps={{size: "small"}}
                        sx={{color: "text.secondary"}}
                        variant="caption"
                        ellipsis>
                        <FormattedMessage defaultMessage="Transaction Hash" />
                    </Copyable>
                )}
            </TxAbout>
        );
    },
    status: ({row: transaction}) => {
        const completed = transaction.confirmed;

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
    },
    value: ({row: transaction}) => {
        const negative = transaction.type === "send";
        return (
            <Tooltip title={transaction.value}>
                <Stack alignItems="flex-end" sx={{width: "100%"}}>
                    <Typography sx={{whiteSpace: "nowrap"}} variant="body2">
                        {negative && "-"}
                        {transaction.value}
                    </Typography>
                    <Typography
                        sx={{color: "text.secondary", whiteSpace: "nowrap"}}
                        variant="caption">
                        {negative && "-"}
                        {transaction.formatted_value_price}
                    </Typography>
                </Stack>
            </Tooltip>
        );
    }
};

const TxAbout = styled("div")({
    margin: "0 5px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    minWidth: "0"
});

export default WalletTable;
