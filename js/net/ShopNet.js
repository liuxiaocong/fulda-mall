import { apiDomain } from "../env";
import request from "superagent";
import auth from "./auth/authRequest";
import header from "./header/headerRequest";
import parse from "./parse/fdParse";
import qs from "qs";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";

auth( request );
header( request );
parse( request );
const prefix = superagent_prefix( apiDomain );

export function netShopGet( shopId, callback ) {
    request
        .post( '/shop/get' )
        .query( { shopId: shopId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopCreate( shopInfoObj, callback ) {
    request
        .post( '/shop/create' )
        .query( shopInfoObj )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopClose( reason, callback ) {
    request
        .post( '/shop/close' )
        .query( { reason: reason } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopReopen( callback ) {
    request
        .post( '/shop/reopen' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateName( name, callback ) {
    request
        .post( '/shop/update/name' )
        .query( { value: name } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateAddress( address, callback ) {
    request
        .post( '/shop/update/address' )
        .query( { value: address } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateArea( area, callback ) {
    request
        .post( '/shop/update/area' )
        .query( { value: area } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateBusiness( business, callback ) {
    request
        .post( '/shop/update/business' )
        .query( { value: business } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateIntro( intro, callback ) {
    request
        .post( '/shop/update/intro' )
        .query( { value: intro } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateTelephone( telephone, callback ) {
    request
        .post( '/shop/update/telephone' )
        .query( { value: telephone } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateMobile( mobile, callback ) {
    request
        .post( '/shop/update/mobile' )
        .query( { value: mobile } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateLocation( lat, lng, callback ) {
    request
        .post( '/shop/update/location' )
        .query( { value: '' + lat + ',' + lng } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopAddWithdrawAccount( accountNo, bankName, holderName, type, callback ) {
    request
        .post( '/shop/withdraw-account/add' )
        .query( { type: type, accountNo: accountNo, extraInfo: bankName, memberName: holderName } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateWithdrawAccount( pendingWithdrawAccount, callback ) {
    request
        .post( '/shop/withdraw-account/update' )
        .query( pendingWithdrawAccount )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopGetWithdrawAccount( callback ) {
    request
        .post( '/shop/withdraw-account/list' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopSearch( query, callback ) {
    request
        .post( '/shop/search' )
        .query( query )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopGoodsSearch( query, callback ) {
    request
        .post( '/shop/goods/search' )
        .query( query )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopWithdrawAccountSetDefault( id, callback ) {
    request
        .post( '/shop/withdraw-account/set-default' )
        .query( { id: id } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopDeleteWithdrawAccount( id, callback ) {
    request
        .post( '/shop/withdraw-account/delete/' + id )
        .query()
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

/**
 *
 * @param goodsId
 * @param type 1->good, 0->average, -1->bad
 * @param pageSize
 * @param pageNum
 * @param callback
 */
export function netShopGoodsCommentList( goodsId, type, pageSize, pageNum, callback ) {
    request
        .post( '/shop/goods/comment/list' )
        .query( { goodsId: goodsId, type: type, pageSize: pageSize, pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopGoodsList( shopId, goodsCategory, pageSize, pageNum, callback ) {
    const queryData = {};
    queryData[ 'shopId' ] = shopId;
    if ( goodsCategory !== null && goodsCategory !== undefined ) {
        queryData[ 'goodsCategory' ] = goodsCategory;
    }

    queryData[ 'pageSize' ] = pageSize;
    queryData[ 'pageNum' ] = pageNum;

    request
        .post( '/shop/goods/list' )
        .query( queryData )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopGoodsOrderList( goodsId, pageSize, pageNum, callback ) {
    request
        .post( '/shop/goods/order/list' )
        .query( { goodsId: goodsId, pageSize: pageSize, pageNum: pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netShopUpdateDiscount( discount, callback ) {
    request
        .post( '/shop/update/discount' )
        .query( { value: discount } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}
export function netShopGoodsGet( goodsId, callback ) {
    if ( Array.isArray( goodsId ) ) {
        const data = {
            goodsIds: goodsId,
        };

        request
            .post( '/shop/goods/get' )
            .send( qs.stringify( data, { allowDots: true } ) )
            .use( prefix )
            .use( logger )
            .authRequest()
            .headerRequest()
            .fdParse()
            .end( callback );
    } else {
        request
            .post( '/shop/goods/get' )
            .query( { goodsId: goodsId } )
            .use( prefix )
            .use( logger )
            .authRequest()
            .headerRequest()
            .fdParse()
            .end( callback );
    }
}






