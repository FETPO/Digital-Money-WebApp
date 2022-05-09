import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {route, thunkRequest} from "services/Http";

export const userState = {
    verification: {
        loading: false,
        error: null,
        status: "unverified",
        basic: [],
        advanced: []
    }
};

export const fetchVerification = createAsyncThunk(
    "user/fetchVerification",
    (arg, api) => {
        return thunkRequest(api).get(route("user.verification.get"));
    }
);

const user = createSlice({
    name: "user",
    initialState: userState,
    extraReducers: {
        [fetchVerification.pending]: (state) => {
            state.verification = {
                ...state.verification,
                error: null,
                loading: true
            };
        },
        [fetchVerification.fulfilled]: (state, action) => {
            state.verification = {
                ...state.verification,
                loading: false,
                error: null,
                basic: action.payload.basic,
                advanced: action.payload.advanced,
                status: action.payload.status
            };
        },
        [fetchVerification.rejected]: (state, action) => {
            state.verification = {
                ...state.verification,
                error: action.error.message,
                loading: false
            };
        }
    }
});

export default user.reducer;
