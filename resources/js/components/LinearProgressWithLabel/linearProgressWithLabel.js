import React from "react";
import {Box, LinearProgress, Typography} from "@mui/material";

const LinearProgressWithLabel = (props) => {
    return (
        <Box display="flex" alignItems="center" width="100%">
            <Box sx={{mr: 1, flexGrow: 1}}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box>
                <Typography color="text.secondary" variant="body2">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

export default LinearProgressWithLabel;
