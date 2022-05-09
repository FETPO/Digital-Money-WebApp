import {createSlice} from "@reduxjs/toolkit";

export const layoutState = {collapsedSidebar: true};

const layout = createSlice({
    name: "layout",
    initialState: layoutState,
    reducers: {
        setCollapsedSidebar: (state, action) => {
            state.collapsedSidebar = action.payload;
        }
    }
});

export const {setCollapsedSidebar} = layout.actions;

export default layout.reducer;
