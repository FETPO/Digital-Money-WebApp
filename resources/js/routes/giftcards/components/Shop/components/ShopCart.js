import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {Badge} from "@mui/material";
import {styled} from "@mui/material/styles";
import {Link as RouterLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectTotalCartItems} from "redux/slices/giftcards";
import {router} from "utils/index";

const ShopCart = () => {
    const total = useSelector(selectTotalCartItems);
    return (
        <StyledRouterLink to={router.generatePath("giftcards.checkout")}>
            <Badge badgeContent={total} color="error" max={9}>
                <ShoppingCartIcon fontSize="large" />
            </Badge>
        </StyledRouterLink>
    );
};

const StyledRouterLink = styled(RouterLink)(({theme}) => ({
    zIndex: 999,
    position: "fixed",
    top: theme.spacing(16),
    height: theme.spacing(5),
    right: 0,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: theme.spacing(2),
    boxShadow: theme.customShadows.z8,
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.borderRadiusMd,
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    color: theme.palette.text.primary,
    transition: theme.transitions.create("opacity"),
    "&:hover": {opacity: 0.72}
}));

export default ShopCart;
