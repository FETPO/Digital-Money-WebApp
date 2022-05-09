import React, {useContext} from "react";
import {TextField as BaseTextField} from "@mui/material";
import {FormInputContext} from "../contexts";
import {isEmpty, isNull, isUndefined} from "lodash";

const TextField = ({value, helperText, ...props}) => {
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
        return isUndefined(value) || isNull(value) ? "" : value;
    }

    return (
        <BaseTextField
            {...baseProps}
            label={label}
            value={fixControlledValue(value)}
            helperText={isEmpty(errors) ? helperText : errors}
            required={isRequired}
        />
    );
};

export default TextField;
