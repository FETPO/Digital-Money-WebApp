import React, {useContext} from "react";
import {FormInputContext} from "../contexts";
import {isEmpty, isNull, isUndefined} from "lodash";
import BaseDateTimePicker from "@mui/lab/DateTimePicker";
import {dayjs} from "utils/index";
import TextField from "@mui/material/TextField";

const DateTimePicker = ({value, onChange, helperText, ...props}) => {
    const {
        isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

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

    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? dayjs() : value;
    }

    return (
        <BaseDateTimePicker
            onChange={onChange}
            value={fixControlledValue(value)}
            label={label}
            renderInput={(renderParams) => (
                <TextField
                    {...renderParams}
                    {...baseProps}
                    helperText={isEmpty(errors) ? helperText : errors}
                    required={isRequired}
                />
            )}
        />
    );
};

export default DateTimePicker;
