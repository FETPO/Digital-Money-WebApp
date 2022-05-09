import {Card} from "@mui/material";
import {experimentalStyled as styled} from "@mui/material/styles";

const ResponsiveCard = styled(Card)(({theme}) => ({
    position: "relative",
    boxShadow: theme.customShadows.z12,
    overflow: "hidden",
    ".react-grid-item &": {
        height: "100%",
        flexDirection: "column",
        display: "flex"
    }
}));

export default ResponsiveCard;
