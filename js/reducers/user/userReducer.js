import { getStore } from "../../setup";
import userActionTypes from "./userActionTypes";

import { paymentAccountBalance, paymentCreditCardList } from "../../actions/PaymentAction";
import { memberMe } from "../../actions/MemberAction";
import { voucherClubReloadListProduct } from "../../actions/VoucherClubAction";
import { shopGet } from "../../actions/ShopAction";
import * as UtilConfig from "../../configs/UtilConfig";


const initialState = {
    isLoggedIn: false,
    facebookToken: null,
    account: null,
    // {
    //     account: '91763195',
    //     password: 'shangyu'
    // },
    user: null,
    business: null,
    searchHistory: [],
    pushToken: null,
    httpRequestCookie: {},
    favoriteShopIds: [],
    favoriteGoodsIds: [],
    loginHistoryForDebug: [
        {
            account: '651231312',
            password: 'uuhello123'
        },
        {
            account: '6591763195',
            password: 'shangyu'
        } ],
};

export default function userReducer( state = initialState, action ) {
    switch ( action.type ) {
        case userActionTypes.LOGIN_SUCCESS:
            onLoginSuccess();

            const account = action.account ? action.account : state.account;

            return {
                ...state,
                isLoggedIn: action.isLoggedIn,
                account: account,
                loginHistoryForDebug: recordLoginHistory( account )
            };

        case userActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                facebookToken: null,
                account: null,
                user: null,
                business: null,
                // httpRequestCookie: {},
                favoriteIds: []
            };
        case userActionTypes.LOGIN_BY_FACEBOOK:
            return {
                ...state,
                isLoggedIn: action.isLoggedIn,
                facebookToken: action.facebookToken,
                account: action.account,
            };
        case userActionTypes.USER_UPDATE:
            // if (action.user) {
            //     action.user.payPassSet = false;
            // }
            return {
                ...state,
                user: action.user
            };
        case userActionTypes.SEARCH_HISTORY_UPDATE: {
            return {
                ...state,
                searchHistory: action.searchHistory
            };
        }
        case userActionTypes.PUSH_TOKEN_UPDATE: {
            return {
                ...state,
                pushToken: action.pushToken
            };
        }
        case userActionTypes.UPDATE_REQUEST_COOKIE: {
            return {
                ...state,
                httpRequestCookie: action.cookie
            };
        }
        case userActionTypes.USER_FAVORITE_IDS_UPDATE: {
            let shopIds = [];
            let goodsIds = [];
            if ( action.favoriteIds && action.favoriteIds.length > 0 ) {
                action.favoriteIds.forEach( function ( obj ) {
                    if ( obj ) {
                        if ( obj.type === UtilConfig.FAV_TYPE_GOODS ) {
                            goodsIds.push( obj.objectId );
                        } else if ( obj.type === UtilConfig.FAV_TYPE_SHOP ) {
                            shopIds.push( obj.objectId );
                        }
                    }
                } )
            }
            return {
                ...state,
                favoriteShopIds: shopIds,
                favoriteGoodsIds: goodsIds
            };
        }
        case userActionTypes.APP_ACTIVE:
            onLoginSuccess();

            return state;
        default:
            return state;
    }
}

function onLoginSuccess() {
    const store = getStore();

    if ( !store.getState().userStore.isLoggedIn ) {
        return;
    }

    store.dispatch( paymentAccountBalance( ( err, res ) => {
        if ( err ) {
            console.log( err.message )
        }
    } ) );

    store.dispatch( memberMe( ( err, res ) => {
        if ( err ) {
            console.log( err.message )
        } else {
            const store = getStore();

            if ( res.data.id )
                store.dispatch( shopGet( res.data.id, ( err, res ) => {
                    if ( err ) {
                        console.log( err.message )
                    }
                } ) );
        }
    } ) );

    store.dispatch( voucherClubReloadListProduct( ( err, res ) => {
        if ( err ) {
            console.log( err.message )
        }
    } ) );

    store.dispatch( paymentCreditCardList( ( err, res ) => {
        if ( err ) {
            console.log( err.message )
        }
    } ) );
}


function recordLoginHistory( account ) {
    const store = getStore();

    const loginHistoryForDebug = store.getState().userStore.loginHistoryForDebug.slice();

    for ( let index = 0; index < loginHistoryForDebug.length; index++ ) {
        if ( account.account === loginHistoryForDebug[ index ].account ) {
            loginHistoryForDebug.splice( index, 1 );
            break;
        }
    }

    loginHistoryForDebug.unshift( account );

    return loginHistoryForDebug;
}
