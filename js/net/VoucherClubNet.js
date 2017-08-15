import { apiDomain } from "../env";
import request from "superagent";
import auth from "./auth/authRequest";
import header from "./header/headerRequest";
import parse from "./parse/fdParse";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";

auth( request );
header( request );
parse( request );

const prefix = superagent_prefix( apiDomain );

export function netVoucherClubReloadListProduct( callback ) {
    request
        .post( '/voucher-club/reload/list-product' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netVoucherClubReload( telco, number, amount, callback ) {
    request
        .post( '/voucher-club/reload' )
        .query( { telco: telco, number: number, amount: amount } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}
