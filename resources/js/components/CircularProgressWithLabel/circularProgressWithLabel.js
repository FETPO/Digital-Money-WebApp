import React from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {experimentalStyled as styled} from "@mui/material/styles";

const CircularProgressWithLabel = ({value, thickness = 4, ...otherProps}) => {
    return (
        <Box sx={{position: "relative", display: "inline-flex"}}>
            <ProgressBackground
                variant="determinate"
                {...otherProps}
                thickness={thickness}
                value={100}
            />

            <StyledProgress
                variant="determinate"
                {...otherProps}
                thickness={thickness}
                value={value}
            />

            <TextContainer>
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </TextContainer>
        </Box>
    );
};

const StyledProgress = styled(CircularProgress)({});

const ProgressBackground = styled(StyledProgress)(({theme}) => ({
    position: "absolute",
    color: theme.palette.background.neutral,
    top: 0,
    left: 0
}));

const TextContainer = styled(Box)(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
}));

export default CircularProgressWithLabel;
