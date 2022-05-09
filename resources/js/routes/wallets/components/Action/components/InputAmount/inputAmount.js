import React, {useCallback} from "react";
import {SelectAdornment, TextField} from "components/Form";
import {InputAdornment, MenuItem} from "@mui/material";
import Value from "utils/classes/Value";

const InputAmount = ({
    value,
    onChange = () => {},
    unitPrecision,
    unitSymbol,
    onBlur,
    currencyPrecision = 2,
    currencySymbol,
    unitPrice
}) => {
    if (!(value instanceof Value)) {
        value = new Value(
            0,
            "price",
            unitPrice,
            unitPrecision,
            currencyPrecision
        );
    }

    const updateScale = useCallback(
        (e) => {
            switch (e.target.value) {
                case "price":
                    return onChange(value.toPrice());
                case "unit":
                    return onChange(value.toUnit());
            }
        },
        [value, onChange]
    );

    const updateAmount = useCallback(
        (e) => {
            return onChange(value.clone(e.target.value));
        },
        [value, onChange]
    );

    return (
        <TextField
            type="number"
            sx={{textAlign: "left"}}
            value={value.amount}
            onChange={updateAmount}
            fullWidth
            InputProps={{
                onBlur,
                endAdornment: (
                    <InputAdornment position="end">
                        <SelectAdornment
                            onChange={updateScale}
                            value={value.scale}>
                            <MenuItem value="price">{currencySymbol}</MenuItem>
                            <MenuItem value="unit">{unitSymbol}</MenuItem>
                        </SelectAdornment>
                    </InputAdornment>
                )
            }}
        />
    );
};

export default InputAmount;
