import React from "react";
import {Checkbox as BaseCheckbox} from "@mui/material";
import {isNull, isUndefined} from "lodash";

const Checkbox = ({checked, ...props}) => {
    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? false : value;
    }

    return <BaseCheckbox checked={fixControlledValue(checked)} {...props} />;
};

export default Checkbox;
