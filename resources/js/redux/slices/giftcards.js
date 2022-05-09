import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice
} from "@reduxjs/toolkit";
import {route, thunkRequest} from "services/Http";
import {isEmpty, omit} from "lodash";

const cartAdapter = createEntityAdapter();

export const giftcardsState = {
    cartItems: cartAdapter.getInitialState({
        error: null,
        loading: false
    })
};

export const {
    selectIds: selectCartItemIds,
    selectAll: selectCartItems,
    selectById: selectCartItem,
    selectTotal: selectTotalCartItems
} = cartAdapter.getSelectors(({giftcards}) => {
    return giftcards.cartItems;
});

export const updateCartItems = createAsyncThunk(
    "giftcards/updateCartItems",
    (arg, api) => {
        const params = {ids: selectCartItemIds(api.getState())};
        return thunkRequest(api).get(route("giftcard.get", params));
    },
    {
        condition: (arg, api) => {
            return !isEmpty(selectCartItemIds(api.getState()));
        }
    }
);

const giftcards = createSlice({
    name: "giftcards",
    initialState: giftcardsState,
    reducers: {
        addCartItem: (state, {payload: item}) => {
            state.cartItems = cartAdapter.addOne(state.cartItems, item);
        },
        updateCartItem: (state, {payload: update}) => {
            state.cartItems = cartAdapter.updateOne(state.cartItems, update);
        },
        removeCartItem: (state, {payload: id}) => {
            state.cartItems = cartAdapter.removeOne(state.cartItems, id);
        },
        clearCartItems: (state) => {
            state.cartItems = cartAdapter.removeAll(state.cartItems);
        }
    },
    extraReducers: {
        [updateCartItems.pending]: (state) => {
            state.cartItems = {
                ...state.cartItems,
                error: null,
                loading: true
            };
        },
        [updateCartItems.rejected]: (state, {error}) => {
            state.cartItems = {
                ...state.cartItems,
                error: error.message,
                loading: false
            };
        },
        [updateCartItems.fulfilled]: (state, {payload: items}) => {
            const cartItems = cartAdapter.updateMany(
                state.cartItems,
                items.map((item) => ({
                    changes: omit(item, "id"),
                    id: item.id
                }))
            );

            state.cartItems = {
                ...cartItems,
                error: null,
                loading: false
            };
        }
    }
});

export const {addCartItem, updateCartItem, removeCartItem, clearCartItems} =
    giftcards.actions;

export default giftcards.reducer;
