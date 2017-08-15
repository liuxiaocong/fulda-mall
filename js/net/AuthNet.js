import logger from "./logger/superagent-logger";
import superagent_prefix from "superagent-prefix";
import request from "superagent";
import { apiDomain } from "../env";
import parse from "./parse/fdParse";
import header from "./header/headerRequest";
import auth from "./auth/authRequest";
import { netAuthLogin } from "../net/AuthNet1";

auth( request );
header( request );
parse( request );

const prefix = superagent_prefix( apiDomain );

module.exports.netAuthLogin = netAuthLogin;

export function netAuthLogout( pushId, callback ) {
    request
        .post( '/auth/logout' )
        .query( { pushId: pushId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netAuthForgetPassword( email, countryCode, mobile, type, callback ) {
    const query = {};

    if ( email ) {
        query[ 'email' ] = email;
    }

    if ( countryCode ) {
        query[ 'countryCode' ] = countryCode;
    }

    if ( mobile ) {
        query[ 'mobile' ] = mobile;
    }

    request
        .post( '/auth/forgot-password' )
        .query( query )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netAuthMobileGetToken( countryCode, mobile, forSignUp, type, callback ) {
    request
        .post( '/auth/mobile/get-token' )
        .query( { countryCode: countryCode, mobile: mobile, forSignUp: forSignUp, type: type } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netAuthMobileVerifyToken( mobileCode, mobile, token, callback ) {
    request
        .post( '/auth/mobile/verify-token' )
        .query( { mobileCode: mobileCode, mobile: mobile, token: token } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netAuthFacebook( token, createNewAccount, callback ) {
    request
        .post( '/auth/facebook' )
        .query( { token: token, createNewAccount: createNewAccount } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse( ( err, res ) => {
            let error;
            if ( !createNewAccount && res && res.body && res.body.status === 0 && res.body.error && res.body.error.code === 'account_not_exists' ) {
                error = Error( 'account_not_exists' );
            } else {
                error = err;
            }

            return { err: error, res: res }
        } )
        .end( callback );
}

export function netAuthBindAccount( account, password, fbToken, callback ) {
    request
        .post( '/auth/bind-account' )
        .query( { account: account, password: password, fbToken: fbToken } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}
