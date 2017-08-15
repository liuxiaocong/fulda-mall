import shopActionTypes from "../reducers/shop/shopActionTypes";
import userActionTypes from "../reducers/user/userActionTypes";
import { netFileUpload } from "../net/FileNet";

import { netMemberMe } from "../net/MemberNet";
import { netShopGet } from "../net/ShopNet";
import Util from "../util/Util";
import * as UtilConfig from "../configs/UtilConfig";


export function fileUpload( type, ownerId, path, callback ) {
    return ( dispatch ) => {
        netFileUpload( type, ownerId, path, ( err, resBody ) => {
            if ( !err ) {
                //0 null,1 user , 2 shop
                let updateType = 0;
                let userArray = [ UtilConfig.UPLOAD_TYPE.MemberLogo, UtilConfig.UPLOAD_TYPE.MemberIdPhoto ];
                let shopArray = [ UtilConfig.UPLOAD_TYPE.ShopBanner, UtilConfig.UPLOAD_TYPE.ShopIdPhoto, UtilConfig.UPLOAD_TYPE.ShopLicensePhoto, UtilConfig.UPLOAD_TYPE.ShopLogo, UtilConfig.UPLOAD_TYPE.ShopWx ];
                if ( Util.isArrayContains( userArray, type ) ) {
                    updateType = 1;
                } else if ( Util.isArrayContains( shopArray, type ) ) {
                    updateType = 2;
                }
                if ( updateType === 1 ) {
                    netMemberMe( ( err1, resBody1 ) => {
                        if ( !err1 ) {
                            dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                        }
                        callback && callback( err, resBody );
                    } );
                } else if ( updateType === 2 ) {
                    netShopGet( ownerId, ( err, resBody ) => {
                        if ( !err ) {
                            dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
                        }
                        callback && callback( err, resBody );
                    } )
                } else {
                    callback && callback( err, resBody );
                }
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

