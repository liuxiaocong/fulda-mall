import userActionTypes from "../reducers/user/userActionTypes";

import { isNeedAdditionalInformation } from "../actions/MemberAction";
import {
    netAuthBindAccount,
    netAuthFacebook,
    netAuthForgetPassword,
    netAuthLogin,
    netAuthLogout,
    netAuthMobileGetToken,
    netAuthMobileVerifyToken
} from "../net/AuthNet";
import { getStore } from "../setup";


export function authLogIn( account, password, callback ) {
    return ( dispatch ) => {
        netAuthLogin( account, password, ( err, resBody ) => {
            if ( !err ) {
                dispatch( {
                    'type': userActionTypes.LOGIN_SUCCESS,
                    isLoggedIn: !isNeedAdditionalInformation( resBody.data ),
                    account: {
                        account: account,
                        password: password
                    },
                } );

                dispatch( {
                    'type': userActionTypes.USER_UPDATE,
                    user: resBody.data
                } );
            }
            callback( err, resBody );
        } );
    };
}

export function authLogout( callback ) {
    return ( dispatch ) => {
        const store = getStore();

        netAuthLogout( store.getState().userStore.pushToken, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': userActionTypes.LOGOUT_SUCCESS } );
            }
            callback( err, resBody );
        } );
    };
}

export function authForgetPassword( email, callback ) {
    netAuthForgetPassword( email, '', '', '0', ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function authMobileGetToken( countryCode, mobile, forSignUp, type, callback ) {
    netAuthMobileGetToken( countryCode, mobile, forSignUp, type, ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function authMobileVerifyToken( mobileCode, mobile, token, callback ) {
    return ( dispatch ) => {
        netAuthMobileVerifyToken( mobileCode, mobile, token, ( err, resBody ) => {
            dispatch( {
                'type': userActionTypes.USER_UPDATE,
                user: resBody.data
            } );

            callback( err, resBody );
        } );
    }
}

export function authFacebook( token, createNewAccount, callback ) {
    return ( dispatch ) => {
        netAuthFacebook( token, createNewAccount, ( err, resBody ) => {
            if ( err ) {
                if ( err.message === 'account_not_exists' ) {
                    dispatch( {
                        'type': userActionTypes.LOGIN_BY_FACEBOOK,
                        isLoggedIn: false,
                        facebookToken: token
                    } );
                }
            } else {
                dispatch( {
                    'type': userActionTypes.LOGIN_BY_FACEBOOK,
                    isLoggedIn: !isNeedAdditionalInformation( resBody.data ),
                    facebookToken: token,
                } );

                dispatch( {
                    'type': userActionTypes.USER_UPDATE,
                    user: resBody.data
                } );
            }

            callback( err, resBody );
        } );
    };

}

export function authBindAccount( account, password, fbToken, callback ) {
    return ( dispatch ) => {
        netAuthBindAccount( account, password, fbToken, ( err, resBody ) => {
            if ( !err ) {
                dispatch( {
                    'type': userActionTypes.LOGIN_BY_FACEBOOK,
                    isLoggedIn: !isNeedAdditionalInformation( resBody.data ),
                    facebookToken: fbToken,
                } );

                dispatch( {
                    'type': userActionTypes.USER_UPDATE,
                    user: resBody.data
                } );
            }

            callback( err, resBody );
        } );
    };
}
