import { combineReducers } from "redux";


import navReducer from "./nav/navReducer.js";
import userReducer from "./user/userReducer.js";
import shopReducer from "./shop/shopReducer";
import orderReducer from "./order/orderReducer";
import walletReducer from "./wallet/walletReducer";
import metaReducer from "./meta/metaReducer";
import settingReducer from "./setting/settingReducer";

export default combineReducers( {
    nav: navReducer,
    userStore: userReducer,
    orderStore: orderReducer,
    walletStore: walletReducer,
    shopStore: shopReducer,
    metaStore: metaReducer,
    settingStore: settingReducer
} );
