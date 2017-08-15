/**
 *
 * @param user
 * @param user.mobileVerified
 * @param user.idNo
 * @param user.currency
 * @returns {boolean}
 */
import * as UtilConfig from "../configs/UtilConfig";
import orderActionTypes from "../reducers/order/orderActionTypes";
import userActionTypes from "../reducers/user/userActionTypes";
import {
    doNetMemberCompleteSignUp1,
    doNetMemberCompleteSignUp2,
    doNetMemberSetName,
    doNetMemberSetPassword,
    netMemberAddDeliverAddress,
    netMemberBindEmail,
    netMemberBindMobile,
    netMemberChangeLanguage,
    netMemberCompleteSignUp1,
    netMemberCompleteSignUp2,
    netMemberDeleteDeliverAddress,
    netMemberEditFavorites,
    netMemberForgotPassword,
    netMemberGet,
    netMemberGetDeliverAddress,
    netMemberGetFavoriteIds,
    netMemberMe,
    netMemberMobileVerifyToken,
    netMemberRegisterDevice,
    netMemberSetAddress,
    netMemberSetArea,
    netMemberSetDefaultDeliverAddress,
    netMemberSetDoB,
    netMemberSetGender,
    netMemberSetIdNo,
    netMemberSetName,
    netMemberSetPassword,
    netMemberSetPostcode,
    netMemberUnregisterDevice,
    netMemberUpdateDeliverAddress,
    netMemberUpdateDeliverAddressAddress,
    netMemberUpdateDeliverAddressArea,
    netMemberUpdateDeliverAddressMobile,
    netMemberUpdateDeliverAddressPostalCode,
    netMemberUpdateDeliverAddressRecipient
} from "../net/MemberNet";
import { executeMultiRequest } from "../net/utils/RequestUtil";
import { getStore } from "../setup";


export function isNeedAdditionalInformation( user ) {
    let isNeedAdditionalInformation = false;
    if ( user && !user.mobileVerified ) {
        isNeedAdditionalInformation = true;
    } else if ( user && !user.idNo ) {
        isNeedAdditionalInformation = true;
    } else if ( user && !user.currency ) {
        isNeedAdditionalInformation = true;
    }

    return isNeedAdditionalInformation;
}

export function memberMe( callback ) {
    return ( dispatch ) => {
        netMemberMe( ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody.data } );
            }
            callback( err, resBody );
        } );
    };
}

export function memberBindMobile( countryCode, mobile, callback ) {
    return ( dispatch ) => {
        netMemberBindMobile( countryCode, mobile, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

// token: [String] [m] one-time token
// type: [Integer] [m] BindMobile(0), ForgotPayPassword(1)
export function memberMobileVerifyToken( token, type, callback ) {
    return ( dispatch ) => {
        netMemberMobileVerifyToken( token, type, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberCompleteSignUp1( name, idNo, callback ) {
    return ( dispatch ) => {
        netMemberCompleteSignUp1( name, idNo, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberCompleteSignUp2( mobile, password, currency, callback ) {
    return ( dispatch ) => {
        netMemberCompleteSignUp2( password, currency, ( err, resBody ) => {
            if ( !err ) {
                dispatch( {
                    'type': userActionTypes.LOGIN_SUCCESS,
                    isLoggedIn: !isNeedAdditionalInformation( resBody.data ),
                    account: {
                        account: mobile,
                        password: password
                    },
                } );

                dispatch( {
                    'type': userActionTypes.USER_UPDATE,
                    user: resBody.data
                } );
            }

            callback( err, resBody );
        } )
    };
}

export function completeUserInfo( queryData = {
    name: null,
    idNo: null,
    currency: null,
    password: null,
}, callback ) {
    return ( dispatch ) => {
        const requestArray = [];
        const requestMap = {};
        if ( queryData[ 'name' ] && queryData[ 'idNo' ] ) {
            const request = doNetMemberCompleteSignUp1( queryData[ 'name' ], queryData[ 'idNo' ] );
            requestArray.push( request );
            requestMap[ request ] = 'doNetMemberCompleteSignUp1';
        } else if ( queryData[ 'name' ] ) {
            const request = doNetMemberSetName( queryData[ 'name' ] );
            requestArray.push( request );
            requestMap[ request ] = 'doNetMemberSetName';
        }

        if ( queryData[ 'currency' ] ) {
            const request = doNetMemberCompleteSignUp2( queryData[ 'password' ], queryData[ 'currency' ] );
            requestArray.push( request );
            requestMap[ request ] = 'doNetMemberCompleteSignUp2';
        } else if ( queryData[ 'password' ] ) {
            const request = doNetMemberSetPassword( null, queryData[ 'password' ], UtilConfig.CHANGE_MEMBER_PASSWORD_TYPE );
            requestArray.push( request );
            requestMap[ request ] = 'doNetMemberSetPassword';
        }

        if ( requestArray.length <= 0 ) {
            callback( null, null );
            return;
        }

        executeMultiRequest( requestArray, ( err, resBody, request ) => {
            if ( err ) {
                callback( err, null )
            } else {
                switch ( requestMap[ request ] ) {
                    case doNetMemberCompleteSignUp1:
                    case doNetMemberSetName:
                    case doNetMemberCompleteSignUp2:
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody.data } );
                        break;
                    case doNetMemberSetPassword:
                        break;
                }

                if ( requestArray.indexOf( request ) === requestArray.length - 1 ) {
                    if ( queryData[ 'password' ] ) {
                        const store = getStore();
                        const account = store.getState().userStore.user.mobile;


                        dispatch( {
                            'type': userActionTypes.LOGIN_SUCCESS,
                            isLoggedIn: true,
                            account: {
                                account: account,
                                password: queryData[ 'password' ]
                            },
                        } );
                    } else {
                        dispatch( {
                            'type': userActionTypes.LOGIN_SUCCESS,
                            isLoggedIn: true,
                        } );
                    }

                    callback( null, null );
                }
            }
        } );
    };
}

export function memberSetName( name, callback ) {
    return ( dispatch ) => {
        netMemberSetName( name, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberSetIdNo( idNo, callback ) {
    return ( dispatch ) => {
        netMemberSetIdNo( idNo, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberSetAddress( address, callback ) {
    return ( dispatch ) => {
        netMemberSetAddress( address, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberSetPostcode( postcode, callback ) {
    return ( dispatch ) => {
        netMemberSetPostcode( postcode, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberMemberSetArea( area3, callback ) {
    return ( dispatch ) => {
        netMemberSetArea( area3, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberSetGender( gender, callback ) {
    return ( dispatch ) => {
        netMemberSetGender( gender, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

export function memberSetDob( dob, callback ) {
    return ( dispatch ) => {
        netMemberSetDoB( dob, ( err, resBody ) => {
            if ( !err ) {
                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }
        } )
    };
}

//type: [Integer] [m] Member_Password(0), Payment_Password(1)
export function memberSetPassword( oldPassword, newPassword, type, callback ) {
    return ( dispatch ) => {
        netMemberSetPassword( oldPassword, newPassword, type, ( err, resBody ) => {
            if ( !err ) {
                if ( type === UtilConfig.CHANGE_MEMBER_PASSWORD_TYPE ) {
                    const store = getStore();
                    const account = store.getState().userStore.user.mobile;

                    dispatch( {
                        'type': userActionTypes.LOGIN_SUCCESS,
                        isLoggedIn: true,
                        account: {
                            account: account,
                            password: newPassword
                        }
                    } );
                }

                netMemberMe( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody1.data } );
                    }
                    callback( err, resBody );
                } );
            } else {
                callback( err, resBody );
            }


        } )
    };
}

//byType: [Integer] [m] ByMobile(0), ByEmail(1)

export function memberForgotPassword( byType, callback ) {
    netMemberForgotPassword( byType, ( err, resBody ) => {
        callback( err, resBody );
    } )
}

export function memberBindEmail( email, callback ) {
    return ( dispatch ) => {
        netMemberBindEmail( email, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': userActionTypes.USER_UPDATE, user: resBody.data } );
            }

            callback( err, resBody );
        } )
    }
}

export function memberGetDeliverAddressList( callback ) {
    return ( dispatch ) => {
        netMemberGetDeliverAddress( ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': orderActionTypes.DELIVER_ADDRESS_UPDATE, deliverAddressList: resBody.data } );
            }
            callback( err, resBody );
        } );
    };
}


export function memberUpdateDeliverAddressRecipient( id, recipient, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddressRecipient( id, recipient, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( { 'type': orderActionTypes.DELIVER_ADDRESS_UPDATE, deliverAddressList: resBody.data } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberUpdateDeliverAddressAddress( id, address, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddressAddress( id, address, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberUpdateDeliverAddressPostalCode( id, postalCode, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddressPostalCode( id, postalCode, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberUpdateDeliverAddressMobile( id, mobile, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddressMobile( id, mobile, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberUpdateDeliverAddressArea( id, areaCode, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddressArea( id, areaCode, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberAddDeliverAddress( addressObj, callback ) {
    return ( dispatch ) => {
        netMemberAddDeliverAddress( addressObj, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberUpdateDeliverAddress( addressObj, callback ) {
    return ( dispatch ) => {
        netMemberUpdateDeliverAddress( addressObj, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberDeleteDeliverAddress( id, callback ) {
    return ( dispatch ) => {
        netMemberDeleteDeliverAddress( id, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback( err, resBody );
            } );
        } )
    };
}

export function memberSetDefaultDeliverAddress( id, callback ) {
    return ( dispatch ) => {
        netMemberSetDefaultDeliverAddress( id, ( err, resBody ) => {
            netMemberGetDeliverAddress( ( err1, resBody1 ) => {
                if ( !err1 ) {
                    dispatch( {
                        'type': orderActionTypes.DELIVER_ADDRESS_UPDATE,
                        deliverAddressList: resBody1.data
                    } );
                }
                callback && callback( err, resBody );
            } );
        } )
    };
}

export function memberRegisterDevice( pushId, callback ) {
    netMemberRegisterDevice( pushId, ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function memberUnregisterDevice( pushId, callback ) {
    netMemberUnregisterDevice( pushId, ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function memberGetById( id, callback ) {
    const query = { id: id };

    netMemberGet( query, ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function memberGetByAccount( account, callback ) {
    const query = { account: account };

    netMemberGet( query, ( err, resBody ) => {
        callback( err, resBody );
    } );
}

export function memberChangeLanguage( pushId, language, callback ) {
    return ( dispatch ) => {
        netMemberChangeLanguage( pushId, language, ( err, resBody ) => {
            callback( err, resBody );
        } );
    };
}

export function memberMemberEditFavorites( id, type, goodsType, remove, callback ) {
    return ( dispatch ) => {
        netMemberEditFavorites( id, type, goodsType, remove, ( err, resBody ) => {
            if ( goodsType === UtilConfig.FAV_TYPE_SHOP ) {
                memberGetFavoritesIds( ( err1, resBody1 ) => {
                    callback && callback( err, resBody );
                } );
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function memberGetFavoritesIds( callback ) {
    return ( dispatch ) => {
        netMemberGetFavoriteIds( ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': userActionTypes.USER_FAVORITE_IDS_UPDATE, favoriteIds: resBody.data } );
            }
            callback && callback( err, resBody );
        } );
    };
}