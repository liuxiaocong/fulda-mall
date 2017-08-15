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

export function netLuckyWheelListRewards( callback ) {
    request
        .post( '/lucky-wheel/list-rewards' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netLuckyWheelDraw( callback ) {
    request
        .post( '/lucky-wheel/draw' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}
