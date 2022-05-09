import React, {useCallback, useContext, useMemo, Fragment} from "react";
import {FormInputContext} from "../Form/contexts";
import {isString, isEmpty, toString, min} from "lodash";
import {FormHelperText, OutlinedInput, Stack} from "@mui/material";

const TokenInput = ({value, onChange}) => {
    const {validateStatus, errors = []} = useContext(FormInputContext);

    const baseProps = {};

    switch (validateStatus) {
        case "error":
            baseProps.error = true;
            break;
        case "success":
            baseProps.color = "success";
            break;
        default:
            baseProps.color = "info";
    }

    const control = useMemo(() => {
        const base = !isString(value) ? "" : value;
        return [
            base.charAt(0),
            base.charAt(1),
            base.charAt(2),
            base.charAt(3),
            base.charAt(4),
            base.charAt(5)
        ];
    }, [value]);

    const getFieldId = useCallback((index) => {
        return `token-${index}`;
    }, []);

    const changeControl = useCallback(
        (e, index) => {
            let value = toString(e.target.value);
            let currentIndex = index;

            if (value.startsWith(control[index])) {
                value = value.slice(control[index].length);
            }

            if (!isNaN(value.charAt(0))) {
                control[index] = value.charAt(0);
            }

            for (let p = 1; p < min([value.length, 6 - index]); p++) {
                if (!isNaN(value.charAt(p))) {
                    control[(currentIndex = index + p)] = value.charAt(p);
                }
            }

            if (value.length && currentIndex < 5) {
                const id = getFieldId(currentIndex + 1);
                document?.getElementById(id)?.focus();
            } else if (!value.length && currentIndex > 0) {
                const id = getFieldId(currentIndex - 1);
                document?.getElementById(id)?.focus();
            }

            onChange?.(control.join(""));
        },
        [control, getFieldId, onChange]
    );

    return (
        <Fragment>
            <Stack direction="row" justifyContent="center" spacing={2}>
                {control.map((controlValue, index) => (
                    <OutlinedInput
                        placeholder="-"
                        {...baseProps}
                        autoComplete="off"
                        key={index}
                        id={getFieldId(index)}
                        onChange={(e) => changeControl(e, index)}
                        value={controlValue}
                        type="number"
                        sx={{
                            width: {
                                xs: 36,
                                sm: 56
                            },
                            height: {
                                xs: 36,
                                sm: 56
                            }
                        }}
                        inputProps={{
                            sx: {
                                textAlign: "center",
                                padding: 0
                            }
                        }}
                    />
                ))}
            </Stack>

            {!isEmpty(errors) && (
                <FormHelperText error sx={{textAlign: "center"}}>
                    {errors.join(" ")}
                </FormHelperText>
            )}
        </Fragment>
    );
};

export default TokenInput;
