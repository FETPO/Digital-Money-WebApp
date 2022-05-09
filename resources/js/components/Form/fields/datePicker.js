import React, {useContext} from "react";
import TextField from "@mui/material/TextField";
import {FormInputContext} from "../contexts";
import BaseDatePicker from "@mui/lab/DatePicker";
import {isEmpty, isNull, isUndefined} from "lodash";
import {dayjs} from "utils/index";

const DatePicker = ({
    inputFormat = "L",
    value,
    onChange,
    helperText,
    ...props
}) => {
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
        <BaseDatePicker
            inputFormat={inputFormat}
            label={label}
            onChange={onChange}
            value={fixControlledValue(value)}
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

export default DatePicker;
