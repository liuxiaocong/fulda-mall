import metaActionTypes from "./metaActionTypes";

const initialState = {
    categoryList: [],
    areaList: {},
    voucherClubReloadListProduct: {}
};

export default function metaReducer( state = initialState, action ) {
    switch ( action.type ) {
        case metaActionTypes.META_CATEGORY_UPDATE:
            return {
                ...state,
                categoryList: action.categoryList,
            };
            break;
        case metaActionTypes.META_ALL_AREAS_UPDATE:
            return {
                ...state,
                areaList: action.areaList,
            };
        case metaActionTypes.META_VOUCHER_CLUB_RELOAD_LIST_PRODUCT:
            return {
                ...state,
                voucherClubReloadListProduct: action.voucherClubReloadListProduct,
            };
        default:
            return state;
    }
}
