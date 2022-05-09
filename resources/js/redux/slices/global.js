import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {route, thunkRequest} from "services/Http";

export const globalState = {
    wallets: {
        error: null,
        loading: false,
        data: []
    },
    supportedCurrencies: {
        error: null,
        loading: false,
        data: []
    },
    countries: {
        error: null,
        loading: false,
        data: []
    },
    operatingCountries: {
        error: null,
        loading: false,
        data: []
    }
};

export const fetchCountries = createAsyncThunk(
    "global/fetchCountries",
    (arg, api) => {
        return thunkRequest(api).get(route("global.countries"));
    }
);

export const fetchSupportedCurrencies = createAsyncThunk(
    "global/fetchSupportedCurrencies",
    (arg, api) => {
        return thunkRequest(api).get(route("global.supported-currencies"));
    }
);

export const fetchWallets = createAsyncThunk(
    "global/fetchWallets",
    (arg, api) => {
        return thunkRequest(api).get(route("global.wallets"));
    }
);

export const fetchOperatingCountries = createAsyncThunk(
    "global/fetchOperatingCountries",
    (arg, api) => {
        return thunkRequest(api).get(route("global.operating-countries"));
    }
);

const global = createSlice({
    name: "global",
    initialState: globalState,
    extraReducers: {
        // Fetch Wallets
        [fetchWallets.pending]: (state) => {
            state.wallets = {
                ...state.wallets,
                error: null,
                loading: true
            };
        },
        [fetchWallets.rejected]: (state, action) => {
            state.wallets = {
                ...state.wallets,
                error: action.error.message,
                loading: false
            };
        },
        [fetchWallets.fulfilled]: (state, action) => {
            state.wallets = {
                ...state.wallets,
                error: null,
                data: action.payload,
                loading: false
            };
        },

        // Fetch Supported Currencies
        [fetchSupportedCurrencies.pending]: (state) => {
            state.supportedCurrencies = {
                ...state.supportedCurrencies,
                error: null,
                loading: true
            };
        },
        [fetchSupportedCurrencies.rejected]: (state, action) => {
            state.supportedCurrencies = {
                ...state.supportedCurrencies,
                error: action.error.message,
                loading: false
            };
        },
        [fetchSupportedCurrencies.fulfilled]: (state, action) => {
            state.supportedCurrencies = {
                ...state.supportedCurrencies,
                error: null,
                data: action.payload,
                loading: false
            };
        },

        // Fetch Countries
        [fetchCountries.pending]: (state) => {
            state.countries = {
                ...state.countries,
                error: null,
                loading: true
            };
        },
        [fetchCountries.rejected]: (state, action) => {
            state.countries = {
                ...state.countries,
                error: action.error.message,
                loading: false
            };
        },
        [fetchCountries.fulfilled]: (state, action) => {
            state.countries = {
                ...state.countries,
                error: null,
                data: action.payload,
                loading: false
            };
        },

        // Fetch Supported Currencies
        [fetchOperatingCountries.pending]: (state) => {
            state.operatingCountries = {
                ...state.operatingCountries,
                error: null,
                loading: true
            };
        },
        [fetchOperatingCountries.rejected]: (state, action) => {
            state.operatingCountries = {
                ...state.operatingCountries,
                error: action.error.message,
                loading: false
            };
        },
        [fetchOperatingCountries.fulfilled]: (state, action) => {
            state.operatingCountries = {
                ...state.operatingCountries,
                error: null,
                data: action.payload,
                loading: false
            };
        }
    }
});

// export const {
//
// } = global.actions;

export default global.reducer;
