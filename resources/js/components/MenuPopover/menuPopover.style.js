import {alpha, experimentalStyled as styled} from "@mui/material/styles";

export const ArrowStyle = styled("span")(({theme}) => ({
    [theme.breakpoints.up("sm")]: {
        top: -7,
        zIndex: 1,
        width: 12,
        right: 20,
        height: 12,
        content: "''",
        position: "absolute",
        borderRadius: "0 0 4px 0",
        transform: "rotate(-135deg)",
        background: theme.palette.background.paper,
        borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
        borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`
    }
}));
