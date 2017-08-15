import shopActionTypes from "./shopActionTypes";
import userActionTypes from "../user/userActionTypes";

const initialState = {
    shopInfo: {},
    pendingShopInfo: {},
};

export default function shopReducer( state = initialState, action ) {
    switch ( action.type ) {
        case shopActionTypes.SHOP_INFO_UPDATE:
            return {
                ...state,
                shopInfo: action.shopInfo,
            };
            break;
        case shopActionTypes.SHOP_CLEAR:
            return {
                ...state,
                shopInfo: {},
            };
            break;
        case shopActionTypes.PENDING_SHOP_INFO_UPDATE:
            return {
                ...state,
                pendingShopInfo: action.pendingShopInfo,
            };
            break;
        case shopActionTypes.PENDING_SHOP_CLEAR:
            return {
                ...state,
                pendingShopInfo: {},
            };
            break;
        case userActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                shopInfo: {},
                pendingShopInfo: {},
            };
        default:
            return state;
    }
}
