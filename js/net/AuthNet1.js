import header from "./header/headerRequest";
import parse from "./parse/fdParse";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";
import { apiDomain } from "../env";
import request from "superagent";

header( request );
parse( request );

const prefix = superagent_prefix( apiDomain );

export function netAuthLogin( account, password, callback ) {
    request
        .post( '/auth/login' )
        .query( { account: account, password: password } )
        .use( prefix )
        .use( logger )
        .headerRequest()
        .fdParse()
        .end( callback );
}
