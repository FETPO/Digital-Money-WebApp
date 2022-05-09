import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Button, ButtonGroup} from "@mui/material";

const RangeSelect = ({range: value, setRange: setValue}) => {
    const renderButton = (key, label) => (
        <Button
            onClick={() => setValue?.(key)}
            variant={value === key ? "outlined" : "contained"}>
            {label}
        </Button>
    );

    return (
        <BaseStyle>
            <ButtonGroup size="small" color="inherit">
                {renderButton("hour", "H")}
                {renderButton("day", "D")}
                {renderButton("week", "W")}
                {renderButton("month", "M")}
                {renderButton("year", "Y")}
            </ButtonGroup>
        </BaseStyle>
    );
};

const BaseStyle = styled("div")(() => ({
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: "5px",
    zIndex: 4
}));

export default RangeSelect;
