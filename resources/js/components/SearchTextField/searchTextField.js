import React, {useCallback} from "react";
import {InputAdornment} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {StyledOutlinedInput} from "styles/toolbar.style";
import {isNull, isUndefined} from "lodash";

const SearchTextField = ({search, onSearchChange, ...otherProps}) => {
    const fixControlledValue = useCallback((value) => {
        return isUndefined(value) || isNull(value) ? "" : value;
    }, []);

    const updateSearch = useCallback(
        (e) => {
            onSearchChange(e.target.value);
        },
        [onSearchChange]
    );

    return (
        <StyledOutlinedInput
            {...otherProps}
            value={fixControlledValue(search)}
            onChange={updateSearch}
            startAdornment={
                <InputAdornment position="start">
                    <SearchIcon color="text.disabled" />
                </InputAdornment>
            }
        />
    );
};

export default SearchTextField;
