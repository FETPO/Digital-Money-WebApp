import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {route, thunkRequest} from "services/Http";

export const paymentState = {
    account: {
        error: null,
        loading: false,
        data: null
    }
};

export const fetchPaymentAccount = createAsyncThunk(
    "payment/fetchAccount",
    (arg, api) => {
        return thunkRequest(api).get(route("payment.account"));
    }
);

const payment = createSlice({
    name: "payment",
    initialState: paymentState,
    extraReducers: {
        [fetchPaymentAccount.pending]: (state) => {
            state.account = {
                ...state.account,
                error: null,
                loading: true
            };
        },
        [fetchPaymentAccount.rejected]: (state, action) => {
            state.account = {
                ...state.account,
                error: action.error.message,
                loading: false
            };
        },
        [fetchPaymentAccount.fulfilled]: (state, action) => {
            state.account = {
                ...state.account,
                error: null,
                data: action.payload,
                loading: false
            };
        }
    }
});

// export const {
//
// } = payment.actions;

export default payment.reducer;
