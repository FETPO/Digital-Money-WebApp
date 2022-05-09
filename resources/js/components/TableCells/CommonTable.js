import {experimentalStyled as styled} from "@mui/material/styles";
import {parseDate} from "utils/form";
import {Stack, Typography} from "@mui/material";
import {dayjs} from "utils/index";
import {isString} from "lodash";
import React from "react";

const CommonTable = {
    compactDate: ({value}) => {
        const date = parseDate(value);
        return (
            <TxDate>
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1.1,
                        color: "text.secondary",
                        fontWeight: "normal"
                    }}>
                    {date.format("MMM")}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "normal",
                        lineHeight: 1.2
                    }}>
                    {date.format("DD")}
                </Typography>
                {date.isBefore(dayjs().startOf("year")) && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontWeight: "normal",
                            lineHeight: 1.1
                        }}>
                        {date.format("YYYY")}
                    </Typography>
                )}
            </TxDate>
        );
    },
    date: ({value}) => {
        if (!isString(value)) {
            return null;
        }
        const date = parseDate(value);
        return (
            <Stack spacing={0.3} sx={{minWidth: 0}}>
                <Typography variant="body2">{date.fromNow()}</Typography>
                <Typography variant="caption" sx={{color: "text.secondary"}}>
                    {date.format("lll")}
                </Typography>
            </Stack>
        );
    }
};

const TxDate = styled("div")({
    margin: "0 2px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    textAlign: "center"
});

export default CommonTable;
