import {
    netOrderCancel,
    netOrderComment,
    netOrderCreate,
    netOrderGet,
    netOrderReceive,
    netOrderShip
} from "../net/OrderNet";

export function orderCreate( data, newLocalDataIfSuccess, callback ) {
    return ( dispatch ) => {
        netOrderCreate( data, ( err, resBody ) => {
            if ( !err ) {
                //dispatch( { 'type': metaActionTypes.META_CATEGORY_UPDATE, categoryList: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function orderGet( type, forShop, callback ) {
    return ( dispatch ) => {
        netOrderGet( type, forShop, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}

export function orderCancel( orderId, callback ) {
    return ( dispatch ) => {
        netOrderCancel( orderId, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}

export function orderShip( orderId, callback ) {
    return ( dispatch ) => {
        netOrderShip( orderId, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}
export function orderReceive( orderId, callback ) {
    return ( dispatch ) => {
        netOrderReceive( orderId, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}

export function orderComment( orderId, goodsComments, goodsMatchRate, deliverySpeedRate, customerServiceRate, callback ) {
    // orderId = 10000;
    // goodsComments = [];
    // //
    // goodsComments.push( {
    //     goodsType: 0,
    //     goodsId: 1100,
    //     type: 1,
    //     comment: "sadsa & dadsadad"
    // });
    // // goodsComments.push({
    // //     // goodsType:0,
    // //     // goodsId:1200,
    // //     // type: 1,
    // //     // comment: null
    // // });
    //
    // goodsMatchRate = 2;
    // deliverySpeedRate = 2;
    // customerServiceRate = 2;


    return ( dispatch ) => {
        netOrderComment( orderId, goodsComments, goodsMatchRate, deliverySpeedRate, customerServiceRate, ( err, resBody ) => {
            callback && callback( err, resBody );
        } )
    };
}