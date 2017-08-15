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

export function netMetaGetCategory( parentId, callback ) {
    request
        .post( '/meta/category' )
        .query( { parentId: parentId } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}


export function netMetaGetCategoryDetail( cid, callback ) {
    request
        .post( '/meta/category/' + cid )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netMetaGetAllAreas( callback ) {
    request
        .post( '/meta/area?parentCode=_all_' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}