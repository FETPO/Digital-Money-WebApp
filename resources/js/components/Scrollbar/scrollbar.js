import React from "react";
import PropTypes from "prop-types";
import SimpleBarReact from "simplebar-react";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";

const StyledSimpleBar = styled(SimpleBarReact)(({theme}) => ({
    "& .simplebar-scrollbar": {
        "&:before": {backgroundColor: alpha(theme.palette.grey[600], 0.48)},
        "&.simplebar-visible:before": {opacity: 1}
    },
    "& .simplebar-content-wrapper::-webkit-scrollbar": {display: "none"},
    "& .simplebar-track.simplebar-vertical": {width: 10},
    "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {height: 6},
    "& .simplebar-mask": {zIndex: "inherit"},
    height: "100%"
}));

function Scrollbar({children, sx, ...other}) {
    return (
        <StyledSimpleBar timeout={500} clickOnTrack={false} sx={sx} {...other}>
            {children}
        </StyledSimpleBar>
    );
}

Scrollbar.propTypes = {
    children: PropTypes.node.isRequired,
    sx: PropTypes.object
};

export default Scrollbar;
