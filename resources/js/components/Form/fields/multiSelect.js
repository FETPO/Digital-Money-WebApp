import React, {useContext, useState} from "react";
import {FormInputContext} from "../contexts";
import {
    FormControl,
    FormHelperText,
    Select as BaseSelect,
    InputLabel
} from "@mui/material";
import {isEmpty, isNull, isUndefined, random} from "lodash";

const MultiSelect = ({
    value,
    fullWidth,
    sx,
    disabled,
    size,
    variant,
    ...otherProps
}) => {
    const {
        // isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    const [id] = useState(() => random(0, 500));
    const controlProps = {fullWidth, sx, disabled, size, variant};

    switch (validateStatus) {
        case "error":
            controlProps.error = true;
            break;
        case "success":
            controlProps.color = "primary";
            break;
        default:
            controlProps.color = "info";
    }

    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? [] : value;
    }

    const labelId = `label-${id}`;

    return (
        <FormControl {...controlProps}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <BaseSelect
                {...otherProps}
                multiple
                value={fixControlledValue(value)}
                label={label}
                labelId={labelId}
            />

            {!isEmpty(errors) && (
                <FormHelperText>{errors.join(" ")}</FormHelperText>
            )}
        </FormControl>
    );
};

export default MultiSelect;
