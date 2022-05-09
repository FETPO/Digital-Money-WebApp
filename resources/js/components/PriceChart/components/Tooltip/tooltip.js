import React from "react";
import {get, isEmpty} from "lodash";
import {dayjs} from "utils";
import {Paper, Typography} from "@mui/material";

const Tooltip = ({active, payload}) => {
    const data = get(payload, "[0].payload");

    if (active && !isEmpty(data)) {
        const date = dayjs.utc(data.timestamp).local();
        return (
            <Paper elevation={3} sx={{textAlign: "center", p: 1}}>
                <Typography variant="subtitle2" sx={{color: "text.primary"}}>
                    {`${data.formatted_price}`}
                </Typography>
                <Typography variant="caption" sx={{color: "text.secondary"}}>
                    {date.format("lll")}
                </Typography>
            </Paper>
        );
    } else {
        return null;
    }
};

export default Tooltip;
