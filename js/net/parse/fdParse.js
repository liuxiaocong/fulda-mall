/**
 * Add to the request prototype.
 */

import I18n from "../../I18n";
import Keys from "../../configs/Keys";


export default function ( superagent ) {
    const Request = superagent.Request;
    Request.prototype.fdParse = fdParse;
    return superagent;
};

function fdParse( manualParse ) {
    const self = this;
    const oldEnd = this.end;

    this.end = function ( fn ) {
        function attemptParse() {
            return oldEnd.call( self, function ( errTmp, resTmp ) {
                let err1 = errTmp;
                let res1 = resTmp;

                if ( manualParse ) {
                    let { err, res } = manualParse( err1, res1 );

                    err1 = err;
                    res1 = res;
                }

                return fn && fn(
                        parseError( err1, res1 ),
                        res1 ? res1.body : res1,
                        self
                    );
            } );
        }

        return attemptParse();
    };

    return this;
}

function parseError( err, res ) {
    if ( err ) {
        if ( err.status === 404 ) {
            return Error( I18n.t( Keys.no_internet_connection ) );
        }

        return err;
    }

    if ( !res ) {
        return err;
    }

    if ( !res.body ) {
        return Error( res.error );
    } else {
        if ( res.body.status === 0 ) {
            return Error( res.body.error.text );
        }
    }

    console.log( err );
    console.log( res.body );

    return null;
}
