import React, {useCallback, useContext, useState, useEffect} from "react";
import {
    FormHelperText,
    Input,
    InputAdornment,
    Slider,
    Stack
} from "@mui/material";
import {isNull, isUndefined, isNumber, isEmpty} from "lodash";
import {FormInputContext} from "components/Form/contexts";

const InputAmount = ({
    value,
    onChange,
    currencySymbol,
    onBlur,
    step,
    minValue,
    maxValue,
    sx,
    ...otherProps
}) => {
    const {errors} = useContext(FormInputContext);
    const [inputWidth, setInputWidth] = useState(24);

    useEffect(() => {
        if (isNumber(value)) {
            const length = value.toString().length;
            setInputWidth(length * 22);
        }
    }, [value]);

    const normalize = useCallback((value) => {
        const parsedValue = parseInt(value);
        return isNaN(parsedValue) ? 0 : parsedValue;
    }, []);

    const handleSliderChange = useCallback(
        (e, value) => {
            onChange?.(normalize(value));
        },
        [onChange, normalize]
    );

    const handleInputChange = useCallback(
        (e) => {
            onChange?.(normalize(e.target.value));
        },
        [onChange, normalize]
    );

    const fixControlledValue = useCallback((value) => {
        return isUndefined(value) || isNull(value) ? "" : value;
    }, []);

    return (
        <Stack spacing={1} sx={sx} {...otherProps}>
            <Stack direction="row" justifyContent="center">
                <Input
                    disableUnderline
                    size="small"
                    onBlur={onBlur}
                    value={fixControlledValue(value)}
                    onChange={handleInputChange}
                    startAdornment={
                        <InputAdornment position="start">
                            {currencySymbol}
                        </InputAdornment>
                    }
                    sx={{
                        typography: "h3",
                        "& input": {
                            width: inputWidth,
                            textAlign: "center",
                            padding: 0
                        }
                    }}
                />
            </Stack>

            <Slider
                marks={true}
                step={step}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
                value={Number(value)}
                min={minValue}
                max={maxValue}
            />

            {!isEmpty(errors) && (
                <FormHelperText sx={{textAlign: "center"}} error>
                    {errors.join(" ")}
                </FormHelperText>
            )}
        </Stack>
    );
};

export default InputAmount;
