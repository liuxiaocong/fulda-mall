import metaActionTypes from "../reducers/meta/metaActionTypes";

import { netVoucherClubReload, netVoucherClubReloadListProduct } from "../net/VoucherClubNet";

export function voucherClubReloadListProduct( callback ) {
    return ( dispatch ) => {
        netVoucherClubReloadListProduct( ( err, resBody ) => {
            if ( !err ) {
                dispatch( {
                    'type': metaActionTypes.META_VOUCHER_CLUB_RELOAD_LIST_PRODUCT,
                    voucherClubReloadListProduct: resBody.data.reloadProductList
                } );
            }

            callback( err, resBody );
        } )
    };
}

export function voucherClubReload( telco, number, amount, callback ) {
    return ( dispatch ) => {
        netVoucherClubReload( telco, number, amount, ( err, resBody ) => {
            callback( err, resBody );
        } )
    };
}
