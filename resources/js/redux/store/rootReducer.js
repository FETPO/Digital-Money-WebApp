import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slices/auth";
import giftcardsReducer from "../slices/giftcards";
import globalReducer from "../slices/global";
import paymentReducer from "../slices/payment";
import settingsReducer from "../slices/settings";
import layoutReducer from "../slices/layout";
import landingReducer from "../slices/landing";
import userReducer from "../slices/user";
import walletReducer from "../slices/wallet";

export default combineReducers({
    auth: authReducer,
    giftcards: giftcardsReducer,
    global: globalReducer,
    payment: paymentReducer,
    settings: settingsReducer,
    layout: layoutReducer,
    landing: landingReducer,
    user: userReducer,
    wallet: walletReducer
});
