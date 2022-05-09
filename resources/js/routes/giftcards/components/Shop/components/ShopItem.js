import React, {useCallback} from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Grid,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {defaultTo, isEmpty} from "lodash";
import {styled, useTheme} from "@mui/material/styles";
import coverImg from "static/giftcard-cover.png";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {FormattedMessage} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {addCartItem, selectCartItem} from "redux/slices/giftcards";
import CheckIcon from "@mui/icons-material/Check";

const ShopItem = ({item}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const cover = defaultTo(item.thumbnail, coverImg);

    const cartItem = useSelector((state) => {
        return selectCartItem(state, item.id);
    });

    const addToCart = useCallback(() => {
        dispatch(addCartItem({...item, quantity: 1}));
    }, [dispatch, item]);

    return (
        <Grid item xs={6} sm={4} md={3}>
            <Card className="animated slideInUp">
                <Box sx={{pt: "100%", position: "relative"}}>
                    <Tooltip title={item.description}>
                        <Chip
                            variant="filled"
                            size="small"
                            label={item.label}
                            color="default"
                            sx={{
                                position: "absolute",
                                backgroundColor: theme.palette.background.paper,
                                right: 16,
                                top: 16,
                                zIndex: 10
                            }}
                        />
                    </Tooltip>

                    <StyledImg alt={item.title} src={cover} />
                </Box>

                <Stack spacing={1} sx={{p: 2}}>
                    <Tooltip title={item.title}>
                        <Stack alignItems="center" direction="row" spacing={1}>
                            <LocalOfferIcon fontSize="inherit" />

                            <Typography variant="body2" noWrap>
                                {item.title}
                            </Typography>
                        </Stack>
                    </Tooltip>

                    <Stack alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                            {item.formatted_price}
                        </Typography>

                        {item.stock > 0 ? (
                            isEmpty(cartItem) ? (
                                <StyledButton
                                    variant="contained"
                                    size="small"
                                    onClick={addToCart}
                                    startIcon={<AddShoppingCartIcon />}
                                    color="primary">
                                    <FormattedMessage defaultMessage="Add to Cart" />
                                </StyledButton>
                            ) : (
                                <StyledButton
                                    variant="contained"
                                    size="small"
                                    startIcon={<CheckIcon />}
                                    disabled={true}>
                                    <FormattedMessage defaultMessage="Added" />
                                </StyledButton>
                            )
                        ) : (
                            <StyledButton
                                variant="contained"
                                size="small"
                                disabled={true}>
                                <FormattedMessage defaultMessage="Out of Stock" />
                            </StyledButton>
                        )}
                    </Stack>
                </Stack>
            </Card>
        </Grid>
    );
};

const StyledButton = styled(Button)({
    boxShadow: "none",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
});

const StyledImg = styled("img")({
    height: "100%",
    objectFit: "cover",
    width: "100%",
    position: "absolute",
    top: 0
});

export default ShopItem;
