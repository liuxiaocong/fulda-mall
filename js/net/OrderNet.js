import { apiDomain } from "../env";
import request from "superagent";
import auth from "./auth/authRequest";
import header from "./header/headerRequest";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";
import qs from "qs";

auth( request );
header( request );

const prefix = superagent_prefix( apiDomain );

export function netOrderCreate( data, callback ) {
    request
        .post( '/order/create' )
        .query( data )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netOrderGet( type, forShop, callback ) {
    request
        .post( '/order/list' )
        .query( { status: type, forShop: forShop } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netOrderCancel( orderId, callback ) {
    request
        .post( '/order/cancel' )
        .query( { orderId: orderId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netOrderShip( orderId, callback ) {
    request
        .post( '/order/ship' )
        .query( { orderId: orderId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netOrderReceive( orderId, callback ) {
    request
        .post( '/order/receive' )
        .query( { orderId: orderId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netOrderComment( orderId, goodsComments, goodsMatchRate, deliverySpeedRate, customerServiceRate, callback ) {
    const data = {
        orderId: orderId,
        goodsMatchRate: goodsMatchRate,
        deliverySpeedRate: deliverySpeedRate,
        customerServiceRate: customerServiceRate,
        goodsComments: goodsComments
    };

    request
        .post( '/order/comment' )
        .send( qs.stringify( data, { allowDots: true } ) )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}