import React, {useContext} from "react";
import {FormInputContext} from "../contexts";
import {FormControl, FormControlLabel, FormHelperText} from "@mui/material";
import {isEmpty, isNull, isUndefined} from "lodash";

const ControlLabel = ({children, control, checked, ...props}) => {
    const {
        isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? false : value;
    }

    const baseProps = {...props};

    switch (validateStatus) {
        case "error":
            baseProps.error = true;
            break;
        case "success":
            baseProps.color = "primary";
            break;
        default:
            baseProps.color = "info";
    }

    return (
        <FormControl {...baseProps} required={isRequired}>
            <FormControlLabel
                control={control ?? children}
                checked={fixControlledValue(checked)}
                label={label}
            />

            {!isEmpty(errors) && (
                <FormHelperText>{errors.join(" ")}</FormHelperText>
            )}
        </FormControl>
    );
};

export default ControlLabel;
