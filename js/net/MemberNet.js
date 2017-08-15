/**
 *
 * @param memberId
 * @param callback
 * ignore member Id
 */
import { Platform } from "react-native";
import { apiDomain } from "../env";
import request from "superagent";
import auth from "./auth/authRequest";
import header from "./header/headerRequest";
import parse from "./parse/fdParse";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";
import DeviceInfo from "react-native-device-info";
import * as UtilConfig from "../configs/UtilConfig";

auth( request );
header( request );
parse( request );

const prefix = superagent_prefix( apiDomain );


export function netMemberMe( callback ) {
    request
        .post( '/member/me' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberBindMobile( countryCode, mobile, callback ) {
    request
        .post( '/member/bind-mobile' )
        .query( { countryCode: countryCode, mobile: mobile } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberMobileVerifyToken( token, type, callback ) {
    request
        .post( '/member/mobile/verify-token' )
        .query( { token: token, type: type } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function doNetMemberCompleteSignUp1( name, idNo ) {
    return request
        .post( '/member/complete-sign-up-1' )
        .query( { name: name, idNo: idNo } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse();
}

export function netMemberCompleteSignUp1( name, idNo, callback ) {
    doNetMemberCompleteSignUp1( name, idNo )
        .end( callback );
}

export function doNetMemberCompleteSignUp2( password, currency ) {
    return request
        .post( '/member/complete-sign-up-2' )
        .query( { password: password, currency: currency } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse();
}

export function netMemberCompleteSignUp2( password, currency, callback ) {
    doNetMemberCompleteSignUp2( password, currency )
        .end( callback );
}

export function doNetMemberSetName( name ) {
    return request
        .post( '/member/update-profile/name' )
        .query( { value: name } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse();
}

export function netMemberSetName( name, callback ) {
    doNetMemberSetName( name )
        .end( callback );
}
export function netMemberSetIdNo( idNo, callback ) {
    request
        .post( '/member/update-profile/idNo' )
        .query( { value: idNo } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetArea( area, callback ) {
    request
        .post( '/member/update-profile/area' )
        .query( { value: area } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetPostcode( postcode, callback ) {
    request
        .post( '/member/update-profile/postalCode' )
        .query( { value: postcode } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetAddress( address, callback ) {
    request
        .post( '/member/update-profile/address' )
        .query( { value: address } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetGender( gender, callback ) {
    request
        .post( '/member/update-profile/gender' )
        .query( { value: gender } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetDoB( dob, callback ) {
    request
        .post( '/member/update-profile/dob' )
        .query( { value: dob } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}


export function doNetMemberSetPassword( oldPassword, newPassword, type ) {
    const query = {};

    if ( oldPassword && oldPassword.length > 0 ) {
        query[ 'oldPassword' ] = oldPassword;
    }

    if ( newPassword && newPassword.length > 0 ) {
        query[ 'newPassword' ] = newPassword;
    }

    query[ 'type' ] = type;

    return request
        .post( '/member/change-password' )
        .query( query )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse();
}


export function netMemberSetPassword( oldPassword, newPassword, type, callback ) {
    doNetMemberSetPassword( oldPassword, newPassword, type )
        .end( callback );
}

export function netMemberForgotPassword( byType, callback ) {
    request
        .post( '/member/forgot-pay-password' )
        .query( { byType: byType } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberBindEmail( email, callback ) {
    request
        .post( '/member/bind-email' )
        .query( { email: email } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberGetDeliverAddress( callback ) {
    request
        .post( '/member/address/list' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}


export function netMemberUpdateDeliverAddressRecipient( id, recipient, callback ) {
    request
        .post( '/member/address/update/recipient' )
        .query( { id: id, recipient: recipient } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .fdParse()
        .end( callback );
}

export function netMemberUpdateDeliverAddressAddress( id, address, callback ) {
    request
        .post( '/member/address/update/address' )
        .query( { id: id, address: address } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberUpdateDeliverAddressPostalCode( id, postalCode, callback ) {
    request
        .post( '/member/address/update/postalCode' )
        .query( { id: id, postalCode: postalCode } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .fdParse()
        .end( callback );
}
export function netMemberUpdateDeliverAddressMobile( id, mobile, callback ) {
    request
        .post( '/member/address/update/mobile' )
        .query( { id: id, mobile: mobile } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberUpdateDeliverAddressArea( id, areaCode, callback ) {
    request
        .post( '/member/address/update/area3' )
        .query( { id: id, area3: areaCode } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberAddDeliverAddress( addressObj, callback ) {
    request
        .post( '/member/address/create' )
        .query( addressObj )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberUpdateDeliverAddress( addressObj, callback ) {
    request
        .post( '/member/address/update' )
        .query( addressObj )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberDeleteDeliverAddress( id, callback ) {
    request
        .post( '/member/address/delete/' + id )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberSetDefaultDeliverAddress( id, callback ) {
    request
        .post( '/member/address/set-default' )
        .query( { id: id } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberRegisterDevice( pushId, callback ) {
    const deviceName = DeviceInfo.getDeviceName();
    const platform = Platform.OS === 'ios' ? 'iOS' : 'Android';

    request
        .post( '/member/register-device' )
        .query( { pushId: pushId, deviceName: deviceName, platform: platform } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberUnregisterDevice( pushId, callback ) {
    request
        .post( '/member/unregister-device' )
        .query( { pushId: pushId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberEditFavorites( id, type, goodsType, remove, callback ) {
    request
        .post( '/member/fav/edit' )
        .query( { id: id, type: type, remove: remove, goodsType: goodsType } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberListFavorites( type, pageSize = UtilConfig.DEFAULT_PAGE_SIZE, pageNum = UtilConfig.DEFAULT_PAGE_START, callback ) {
    let data = {};
    data.type = type;
    data.pageNum = pageNum;
    data.pageSize = pageSize;
    request
        .post( '/member/fav/list' )
        .query( data )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberReferralList( memberId, callback ) {
    request
        .get( '/member/referral/list' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberGet( query, callback ) {
    request
        .get( '/member/get' )
        .query( query )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberChangeLanguage( pushId, language, callback ) {
    request
        .get( '/member/change-language' )
        .query( { pushId: pushId, language: language } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMemberGetFavoriteIds( callback ) {
    request
        .post( '/member/fav-id/list' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}
