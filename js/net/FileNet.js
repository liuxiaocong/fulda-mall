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

export function netFileUpload( type, ownerId, path, callback ) {
    const photo = {
        uri: path,
        type: 'image/jpeg',
        name: path.substr( path.lastIndexOf( "/" ) + 1 ),
    };

    request
        .post( '/file/upload' )
        .type( 'multipart/form-data' )
        .field( 'type', type )
        .field( 'ownerId', ownerId )
        .attach( 'file', photo )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );

}

