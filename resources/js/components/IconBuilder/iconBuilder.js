import React from "react";
import {generateIcon} from "utils";
import {isEmpty, isObject, isString} from "lodash";
import {Box, SvgIcon} from "@mui/material";

const IconBuilder = ({icon: object, ...props}) => {
    if (isEmpty(object)) {
        return null;
    }

    if (isString(object.icon)) {
        return (
            <IconContainer color={object.color} {...props}>
                <Box
                    component={"img"}
                    src={object.icon}
                    alt={object.name}
                    sx={{
                        width: "1em",
                        height: "1em"
                    }}
                />
            </IconContainer>
        );
    } else if (isObject(object.icon)) {
        return (
            <IconContainer color={object.color} {...props}>
                <SvgIcon
                    component={() =>
                        generateIcon(object.icon, `svg-${object.name}`, {
                            width: "1em",
                            height: "1em",
                            "aria-hidden": "true",
                            "data-icon": object.name,
                            fill: "currentColor"
                        })
                    }
                />
            </IconContainer>
        );
    } else {
        return null;
    }
};

const IconContainer = ({sx, color, ...otherProps}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                color,
                ...sx
            }}
            {...otherProps}
        />
    );
};

export default IconBuilder;
