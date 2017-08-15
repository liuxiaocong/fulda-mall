import walletActionTypes from "../reducers/wallet/walletActionTypes";
import {
    netPaymentAccountBalance,
    netPaymentCreditCardCreate,
    netPaymentCreditCardDelete,
    netPaymentCreditCardList,
    netPaymentCreditCardSetDefault,
    netPaymentOrder,
    netPaymentPayment,
    netPaymentSystemCouponApply,
    netPaymentSystemCouponList,
    netPaymentTopUp,
    netPaymentTransactionMoneyDetail,
    netPaymentTransactionMoneyList,
    netPaymentTransactionPointDetail,
    netPaymentTransactionPointList,
    netPaymentTransfer,
    netPaymentWithdraw,
    netPaymentWithdrawList
} from "../net/PaymentNet";
import { getStore } from "../setup";


export function paymentAccountBalance( callback ) {
    return ( dispatch ) => {
        netPaymentAccountBalance( ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': walletActionTypes.BALANCE_UPDATE, balance: resBody.data } );
            }

            callback && callback( err, resBody );
        } )
    };
}

export function paymentTransactionPointList( pageSize, pageNum, callback ) {
    // let data = [];
    //
    // if ( pageNum < 2 ) {
    //     for ( let index = 0; index < pageSize; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) ) );
    //     }
    // } else {
    //     for ( let index = 0; index < pageSize - 1; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) ) );
    //     }
    // }
    //
    // callback( null, { data: data } );

    netPaymentTransactionPointList( pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );

    // function createDemoData( tag ) {
    //     const FCD_DATA1 = JSON.parse( JSON.stringify( FCD_DATA ) );
    //     FCD_DATA1.typeText += ': ' + tag;
    //
    //     return FCD_DATA1;
    // }
}

export function paymentTransactionPointDetail( id, callback ) {
    netPaymentTransactionPointDetail( id, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentTransactionMoneyList( pageSize, pageNum, callback ) {
    netPaymentTransactionMoneyList( pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentTransactionMoneyDetail( id, callback ) {
    netPaymentTransactionMoneyDetail( id, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentSystemCouponList( pageSize, pageNum, callback ) {
    // callback && callback( Error( 'Failed get shopGoodsCommentList' ), null );

    // let data = [];
    //
    // if ( pageNum < 2 ) {
    //     for ( let index = 0; index < pageSize; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index), index % 2 === 0 ) );
    //     }
    // } else {
    //     for ( let index = 0; index < pageSize - 1; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index), index % 2 === 0 ) );
    //     }
    // }
    //
    // callback( null, { data: data } );

    netPaymentSystemCouponList( pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );

    // function createDemoData( tag, used ) {
    //     return {
    //         ref: "xxxxxxxxxxx: " + tag,
    //         used: used
    //     };
    // }
}

export function paymentSystemCouponApply( couponId, receiver, payPass, callback ) {
    netPaymentSystemCouponApply( couponId, receiver, payPass, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentWithdraw( amount, withdrawAccountId, payPass, callback ) {
    netPaymentWithdraw( amount, withdrawAccountId, payPass, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentWithdrawList( pageSize, pageNum, callback ) {
    // callback && callback( Error( 'Failed get shopGoodsCommentList' ), null );

    // let data = [];
    //
    // if ( pageNum < 2 ) {
    //     for ( let index = 0; index < pageSize; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) ) );
    //     }
    // } else {
    //     for ( let index = 0; index < pageSize - 1; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) ) );
    //     }
    // }
    //
    // callback( null, { data: data } );

    netPaymentWithdrawList( pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );

    // function createDemoData( tag ) {
    //     return {
    //         ref: "xxxxxxxxxxx: " + tag
    //     };
    // }
}

export function paymentTopUp( amount, paymentMethod, callback ) {
    netPaymentTopUp( amount, paymentMethod, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentTransfer( toMemberId, amount, useFromMemberCurrency, payPass, callback ) {
    netPaymentTransfer( toMemberId, amount, useFromMemberCurrency, payPass, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentPayment( toMemberId, amount, payPass, callback ) {
    netPaymentPayment( toMemberId, amount, payPass, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );
}

export function paymentOrderPayment( orderId, amount, payPass, callback ) {
    return ( dispatch ) => {
        netPaymentOrder( orderId, amount, payPass, ( err, resBody ) => {
            if ( !err ) {
                netPaymentAccountBalance( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': walletActionTypes.BALANCE_UPDATE, balance: resBody1.data } );
                    }

                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } );
    };
}

function dealWithCreditCardData( data ) {
    const resultData = [];
    if ( !data ) {
        return resultData;
    }

    data.sort( function ( a, b ) {
        if ( a.registerDate > b.registerDate ) {
            return -1;
        } else if ( a.registerDate < b.registerDate ) {
            return 1;
        } else {
            return b.id - a.id;
        }
    } );

    let defaultCreditCard = null;
    for ( let index = 0; index < data.length; index++ ) {
        if ( data[ index ].default ) {
            defaultCreditCard = data[ index ];
        } else {
            resultData.push( data[ index ] );
        }
    }

    if ( defaultCreditCard ) {
        resultData.unshift( defaultCreditCard );
    } else if ( data.length > 0 ) {
        resultData[ 0 ].default = true;
    }

    return resultData;
}

export function paymentCreditCardList( callback ) {
    return ( dispatch ) => {
        netPaymentCreditCardList( ( err, resBody ) => {
            if ( !err ) {
                resBody.data = dealWithCreditCardData( resBody.data );

                dispatch( { 'type': walletActionTypes.PAY_CREDIT_CARD_UPDATE, payCreditCardData: resBody.data } );
            }

            callback && callback( err, resBody );
        } );
    };
}

export function paymentCreditCardCreate( cardNo, cvv, expiryDate, type, isDefault, callback ) {
    return ( dispatch ) => {
        netPaymentCreditCardCreate( cardNo, cvv, expiryDate, type, ( err, resBody ) => {
            if ( err ) {
                callback && callback( err, null );
            }
            else {
                if ( !isDefault ) {
                    const store = getStore();
                    const payCreditCardData = store.getState().walletStore.payCreditCardData.slice();
                    payCreditCardData.push( resBody.data );

                    dispatch( {
                        'type': walletActionTypes.PAY_CREDIT_CARD_UPDATE,
                        payCreditCardData: dealWithCreditCardData( payCreditCardData )
                    } );

                    dispatch( paymentCreditCardList( ( err1, resBody1 ) => {
                        callback && callback( err1, null );
                    } ) );
                } else {
                    dispatch( paymentCreditCardSetDefault( resBody.data, ( err1, resBody1 ) => {
                        callback && callback( err1, null );
                    } ) );
                }
            }
        } );
    };
}

export function paymentCreditCardDelete( payCreditCard, callback ) {
    return ( dispatch ) => {
        netPaymentCreditCardDelete( payCreditCard.id, ( err, resBody ) => {
            if ( err ) {
                callback && callback( err, null );
            } else {
                const store = getStore();

                const payCreditCardData = store.getState().walletStore.payCreditCardData.slice();

                for ( let index = 0; index < payCreditCardData.length; index++ ) {
                    if (
                        payCreditCardData[ index ].id === payCreditCard.id
                    ) {
                        payCreditCardData.splice( index, 1 );
                        break;
                    }
                }

                if ( payCreditCardData.length > 0 && payCreditCard.default ) {
                    dispatch( paymentCreditCardSetDefault( payCreditCardData[ 0 ], ( err1, resBody1 ) => {
                        callback && callback( err1, null );
                    } ) );
                } else {
                    dispatch( paymentCreditCardList( ( err1, resBody1 ) => {
                        callback && callback( err1, null );
                    } ) );
                }
            }
        } );
    };
}

export function paymentCreditCardSetDefault( payCreditCard, callback ) {
    return ( dispatch ) => {
        netPaymentCreditCardSetDefault( payCreditCard.id, ( err, resBody ) => {
            if ( err ) {
                callback && callback( err, null );
            } else {
                dispatch( paymentCreditCardList( ( err1, resBody1 ) => {
                    callback && callback( err1, null );
                } ) );
            }
        } );
    };
}



