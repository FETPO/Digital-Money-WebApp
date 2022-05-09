import React, {useCallback, useEffect, useMemo} from "react";
import {
    Card,
    CardHeader,
    Grid,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {
    removeCartItem,
    selectCartItems,
    updateCartItems
} from "redux/slices/giftcards";
import Result from "components/Result";
import {EmptyCart} from "assets/index";
import Table from "components/Table";
import {get, isEmpty, round} from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import GiftcardThumbnail from "components/GiftcardThumbnail";
import Quantity from "./components/Quantity";
import Summary from "./components/Summary";

const messages = defineMessages({
    name: {defaultMessage: "Giftcard"},
    brand: {defaultMessage: "Brand"},
    title: {defaultMessage: "Title"},
    label: {defaultMessage: "Label"},
    description: {defaultMessage: "Description"},
    price: {defaultMessage: "Price"},
    quantity: {defaultMessage: "Quantity"},
    value: {defaultMessage: "Value"},
    stock: {defaultMessage: "Stock"},
    total: {defaultMessage: "Total"},
    giftcards: {defaultMessage: "Giftcards"}
});

const Checkout = () => {
    const dispatch = useDispatch();
    const intl = useIntl();

    const cartItems = useSelector(selectCartItems);

    const loading = useSelector((state) => {
        return get(state, "giftcards.cartItems.loading");
    });

    useEffect(() => {
        dispatch(updateCartItems());
    }, [dispatch]);

    const deleteItem = useCallback(
        (item) => {
            dispatch(removeCartItem(item.id));
        },
        [dispatch]
    );

    const columns = useMemo(
        () => [
            {
                field: "thumbnail",
                width: 80,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => (
                    <GiftcardThumbnail size={60} src={value} />
                )
            },
            {
                field: "title",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.title),
                renderCell: ({row}) => {
                    return (
                        <Stack sx={{minWidth: 0}}>
                            <Typography variant="subtitle2" noWrap>
                                {row.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                {row.label}
                            </Typography>
                        </Stack>
                    );
                }
            },
            {
                field: "formatted_price",
                width: 110,
                headerName: intl.formatMessage(messages.price)
            },
            {
                field: "stock",
                width: 110,
                headerName: intl.formatMessage(messages.quantity),
                renderCell: ({row}) => {
                    return <Quantity item={row} />;
                }
            },
            {
                field: "total",
                width: 110,
                headerName: intl.formatMessage(messages.total),
                renderCell: ({row}) => {
                    const quantity = Math.min(row.quantity, row.stock);
                    return round(quantity * row.price, 2);
                }
            },
            {
                field: "action",
                width: 70,
                renderHeader: () => <span />,
                renderCell: ({row}) => {
                    return (
                        <IconButton onClick={() => deleteItem(row)}>
                            <DeleteIcon />
                        </IconButton>
                    );
                }
            }
        ],
        [intl, deleteItem]
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Card sx={{mb: 3}}>
                    <CardHeader
                        title={<FormattedMessage defaultMessage="Your Cart" />}
                    />

                    {isEmpty(cartItems) ? (
                        <Result
                            title={
                                <FormattedMessage defaultMessage="Cart is empty." />
                            }
                            description={
                                <FormattedMessage defaultMessage="Look like you have no items in your shopping cart." />
                            }
                            icon={EmptyCart}
                        />
                    ) : (
                        <Table
                            columns={columns}
                            rowHeight={100}
                            rows={cartItems}
                            loading={loading}
                        />
                    )}
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Summary />
            </Grid>
        </Grid>
    );
};

export default Checkout;
