import React, {useCallback} from "react";
import {IconButton, Box, Chip} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {styled} from "@mui/material/styles";
import {updateCartItem} from "redux/slices/giftcards";
import {useDispatch} from "react-redux";
import {FormattedMessage} from "react-intl";

const Quantity = ({item}) => {
    const dispatch = useDispatch();

    const getPayload = useCallback(
        (quantity) => ({id: item.id, changes: {quantity}}),
        [item]
    );

    const quantity = Math.min(item.quantity, item.stock);

    const increase = useCallback(() => {
        const payload = getPayload(quantity + 1);
        dispatch(updateCartItem(payload));
    }, [dispatch, quantity, getPayload]);

    const decrease = useCallback(() => {
        const payload = getPayload(quantity - 1);
        dispatch(updateCartItem(payload));
    }, [dispatch, quantity, getPayload]);

    return (
        <Box sx={{width: 100}}>
            {item.stock > 0 ? (
                <IncrementerStyle>
                    <IconButton
                        color="inherit"
                        disabled={quantity <= 1}
                        size="small"
                        onClick={decrease}>
                        <RemoveIcon fontSize="small" />
                    </IconButton>

                    {quantity}

                    <IconButton
                        color="inherit"
                        disabled={quantity >= item.stock}
                        size="small"
                        onClick={increase}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                </IncrementerStyle>
            ) : (
                <Chip
                    color="error"
                    label={<FormattedMessage defaultMessage="Out of Stock" />}
                    size="small"
                />
            )}
        </Box>
    );
};

const IncrementerStyle = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
    lineHeight: 1
}));

export default Quantity;
