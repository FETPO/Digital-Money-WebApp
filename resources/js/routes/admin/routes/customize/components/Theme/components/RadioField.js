import React from "react";
import {FormControlLabel, Radio} from "@mui/material";

const RadioField = ({value}) => {
    return (
        <FormControlLabel
            value={value}
            control={<Radio sx={{display: "none"}} />}
            label={<span />}
            sx={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                margin: 0
            }}
        />
    );
};

export default RadioField;
