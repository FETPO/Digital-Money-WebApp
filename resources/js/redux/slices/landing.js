import {createSlice} from "@reduxjs/toolkit";

export const landingState = {enable: false};

const landing = createSlice({
    name: "landing",
    initialState: landingState
});

export default landing.reducer;
