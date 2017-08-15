import userActionTypes from "../user/userActionTypes";
import shopActionTypes from "../shop/shopActionTypes";
import walletActionTypes from "./walletActionTypes";

const initialState = {
    balance: null,
    withdrawAccounts: [],
    pendingWithdrawAccount: {},
    payCreditCardData: []
};

export default function walletReducer( state = initialState, action ) {
    switch ( action.type ) {
        case walletActionTypes.WITHDRAW_ACCOUNT_UPDATE:
            return {
                ...state,
                withdrawAccounts: action.withdrawAccounts,
            };
            break;
        case walletActionTypes.PENDING_WITHDRAW_ACCOUNT_UPDATE:
            return {
                ...state,
                pendingWithdrawAccount: action.pendingWithdrawAccount,
            };
            break;
        case walletActionTypes.BALANCE_UPDATE: {
            return {
                ...state,
                balance: action.balance
            };
        }
        case walletActionTypes.PAY_CREDIT_CARD_UPDATE:
            return {
                ...state,
                payCreditCardData: action.payCreditCardData,
            };
            break;
        case shopActionTypes.SHOP_CLEAR:
            return {
                ...state,
                withdrawAccounts: [],
            };
            break;
        case shopActionTypes.PENDING_SHOP_CLEAR:
            return {
                ...state,
                pendingWithdrawAccount: {},
            };
            break;
        case userActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                balance: null,
                withdrawAccounts: [],
                pendingWithdrawAccount: {},
            };
        default:
            return state;
    }
}
