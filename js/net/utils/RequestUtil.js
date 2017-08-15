export function executeMultiRequest( requests, callback ) {
    let currentIndex = 0;

    doExecuteMultiRequest( requests, currentIndex, callback );
}

function doExecuteMultiRequest( requests, currentIndex, callback ) {
    if ( currentIndex >= requests.length ) {
        return;
    }

    requests[ currentIndex ]
        .end( ( err, resBody, request ) => {
            callback && callback( err, resBody, request );

            if ( !err ) {
                doExecuteMultiRequest( requests, currentIndex + 1, callback );
            }
        } );
}