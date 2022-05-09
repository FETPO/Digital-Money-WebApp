import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {route, thunkRequest} from "services/Http";

export const walletState = {
    activeAccount: null,
    accounts: {
        error: null,
        loading: false,
        data: []
    }
};

export const fetchWalletAccounts = createAsyncThunk(
    "wallet/fetchAccounts",
    (arg, api) => {
        return thunkRequest(api).get(route("wallet.account.all"));
    }
);

const wallet = createSlice({
    name: "wallet",
    initialState: walletState,
    reducers: {
        setActiveAccount: (state, action) => {
            state.activeAccount = action.payload;
        }
    },
    extraReducers: {
        // Fetch Accounts
        [fetchWalletAccounts.pending]: (state) => {
            state.accounts = {
                ...state.accounts,
                error: null,
                loading: true
            };
        },
        [fetchWalletAccounts.rejected]: (state, action) => {
            state.accounts = {
                ...state.accounts,
                error: action.error.message,
                loading: false
            };
        },
        [fetchWalletAccounts.fulfilled]: (state, action) => {
            state.accounts = {
                ...state.accounts,
                error: null,
                data: action.payload,
                loading: false
            };
        }
    }
});

export const {setActiveAccount} = wallet.actions;

export default wallet.reducer;
