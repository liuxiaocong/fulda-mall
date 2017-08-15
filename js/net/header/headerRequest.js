import { getStore } from "../../setup";
import userActionTypes from "../../reducers/user/userActionTypes";


export default function ( superagent ) {
    const Request = superagent.Request;
    Request.prototype.headerRequest = headerRequest;
    return superagent;
};

function headerRequest() {
    const store = getStore();

    if ( store.getState().settingStore.displayCurrency ) {
        this.set( 'view-currency', store.getState().settingStore.displayCurrency.code );
    }

    if ( store.getState().settingStore.language ) {
        this.set( 'accept-language', store.getState().settingStore.language );
    }

    if ( store.getState().userStore.httpRequestCookie !== null ) {
        const { session, remember_me } = store.getState().userStore.httpRequestCookie;

        let cookie = '';
        if ( session && session.length > 0 ) {
            cookie += ('SESSION=' + session)
        }

        if ( cookie.length > 0 && remember_me && remember_me.length > 0 ) {
            cookie += '; '
        }

        if ( remember_me && remember_me.length > 0 ) {
            cookie += ('remember-me=' + remember_me)
        }

        this.set( 'Cookie', cookie );
    }

    const self = this;
    const oldEnd = this.end;

    this.end = function ( fn ) {
        function recordCookie() {
            return oldEnd.call( self, function ( err, res ) {
                if ( res.header ) {
                    const cookie = res.header[ 'set-cookie' ];
                    if ( cookie ) {
                        const store = getStore();

                        const { session, remember_me } = store.getState().userStore.httpRequestCookie;

                        let newSession = session;
                        let newRememberMe = remember_me;

                        const cookieArray = res.header[ 'set-cookie' ].split( '; ' );
                        for ( let index = 0; index < cookieArray.length; index++ ) {
                            if ( cookieArray[ index ].indexOf( 'SESSION=' ) === 0 ) {
                                newSession = cookieArray[ index ].substring( 'SESSION='.length );
                            }

                            if ( cookieArray[ index ].indexOf( 'remember-me=' ) === 0 ) {
                                newRememberMe = cookieArray[ index ].substring( 'remember-me='.length );
                            }
                        }

                        if ( newSession !== session || newRememberMe !== remember_me ) {
                            store.dispatch( ( dispatch ) => {
                                dispatch( {
                                    'type': userActionTypes.UPDATE_REQUEST_COOKIE,
                                    cookie: {
                                        session: newSession,
                                        remember_me: newRememberMe
                                    }
                                } );
                            } );
                        }
                    }
                }

                return fn && fn( err, res );
            } );
        }

        return recordCookie();
    };

    return this;
}