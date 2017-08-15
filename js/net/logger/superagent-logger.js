import url from "url";
import querystring from "querystring";
import superagent from "superagent";
'use strict';

export default function ( options ) {
    if ( !options ) options = {};
    if ( options instanceof superagent.Request )
        return attachSuperagentLogger( {}, options );

    return attachSuperagentLogger.bind( null, options );
};

function attachSuperagentLogger( options, req ) {
    const start = new Date().getTime();
    const timestamp = new Date().toISOString();

    const uri = url.parse( req.url );
    const method = req.method;

    if ( options.outgoing ) {
        console.log( '%s %s %s %s %s %s',
            (
                rightPad( uri.protocol.toUpperCase().replace( /[^\w]/g, '' ), 5 )
            ),
            (rightPad( method.toUpperCase(), 'delete'.length )),
            options.timestamp ? ('[' + timestamp + ']') : '',
            (' - '),
            (uri.href + (req.qs ? '' : '?' + querystring.encode( req.qs ))),
            ('(pending)')
        );
    }

    console.log( 'Start %s %s %s %s',
        (
            rightPad( uri.protocol.toUpperCase().replace( /[^\w]/g, '' ), 5 )
        ),
        (rightPad( method.toUpperCase(), 'delete'.length )),
        options.timestamp ? ('[' + timestamp + ']') : '',
        (uri.href + ' ' + ((req._query && req._query.length > 0) ? req._query[ 0 ] : '' )),
    );

    console.log( 'request header:' );
    console.log( req._header );

    req.on( 'response', function ( res ) {
        const now = new Date().getTime();
        const elapsed = now - start;

        let st = res.status;
        if ( st < 300 ) {
            st = (st);
        } else if ( st < 400 ) {
            st = (st);
        } else {
            st = (st);
        }

        console.log( 'Response %s %s %s %s %s %s',
            (
                rightPad( uri.protocol.toUpperCase().replace( /[^\w]/g, '' ), 5 )
            ),
            (rightPad( method.toUpperCase(), 'delete'.length )),
            options.timestamp ? ('[' + timestamp + ']') : '',
            st,
            (uri.href + ' ' + ((req._query && req._query.length > 0) ? req._query[ 0 ] : '' )),
            ('(') +
            (elapsed + 'ms') +
            (')')
        );

        console.log( 'response header:' );
        console.log( res.headers );
        console.log( 'response text:' );
        console.log( res.text );
    } );
}

function rightPad( str, len ) {
    const l = str.length;
    if ( l < len ) {
        for ( let i = 0, n = len - l; i < n; i++ ) {
            str += ' ';
        }
    }
    return str;
}
