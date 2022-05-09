import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Select as BaseSelect} from "@mui/material";
import {isNull, isUndefined} from "lodash";

const SelectAdornment = ({value, ...props}) => {
    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? "" : value;
    }

    return <StyledSelect value={fixControlledValue(value)} {...props} />;
};

const StyledSelect = styled(BaseSelect)({
    "& .MuiOutlinedInput-notchedOutline": {border: "none !important"},
    "& .MuiSvgIcon-root": {right: 0}
});
export default SelectAdornment;
