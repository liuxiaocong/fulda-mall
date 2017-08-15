/**
 * Created by xiaoconglau on 11/04/2017.
 */
import walletActionTypes from "../reducers/wallet/walletActionTypes";
import shopActionTypes from "../reducers/shop/shopActionTypes";
import userActionTypes from "../reducers/user/userActionTypes";
import {
    netShopAddWithdrawAccount,
    netShopClose,
    netShopCreate,
    netShopDeleteWithdrawAccount,
    netShopGet,
    netShopGetWithdrawAccount,
    netShopGoodsCommentList,
    netShopGoodsGet,
    netShopGoodsList,
    netShopGoodsOrderList,
    netShopGoodsSearch,
    netShopReopen,
    netShopSearch,
    netShopUpdateAddress,
    netShopUpdateArea,
    netShopUpdateBusiness,
    netShopUpdateDiscount,
    netShopUpdateIntro,
    netShopUpdateLocation,
    netShopUpdateMobile,
    netShopUpdateName,
    netShopUpdateTelephone,
    netShopUpdateWithdrawAccount,
    netShopWithdrawAccountSetDefault
} from "../net/ShopNet";

import { netMemberMe } from "../net/MemberNet";
import { getStore } from "../setup";


export function shopCreate( shopInfoObj, callback ) {
    return ( dispatch ) => {
        netShopCreate( shopInfoObj, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
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


export function shopGet( shopId, callback ) {
    return ( dispatch ) => {
        netShopGet( shopId, ( err, resBody ) => {
            if ( !err ) {
                const store = getStore();
                if ( store.getState().userStore.user && resBody.data.id === store.getState().userStore.user.id ) {
                    dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
                }
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopClose( shopId, reason, callback ) {
    return ( dispatch ) => {
        netShopClose( reason, ( err, resBody ) => {
            if ( !err ) {
                netShopGet( shopId, ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody1.data } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function shopReopen( shopId, callback ) {
    return ( dispatch ) => {
        netShopReopen( ( err, resBody ) => {
            if ( !err ) {
                netShopGet( shopId, ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody1.data } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function shopSetName( shopName, callback ) {
    return ( dispatch ) => {
        netShopUpdateName( shopName, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetAddress( address, callback ) {
    return ( dispatch ) => {
        netShopUpdateAddress( address, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetArea( area, callback ) {
    return ( dispatch ) => {
        netShopUpdateArea( area, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetBusiness( business, callback ) {
    return ( dispatch ) => {
        netShopUpdateBusiness( business, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetIntro( intro, callback ) {
    return ( dispatch ) => {
        netShopUpdateIntro( intro, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetTelephone( telephone, callback ) {
    return ( dispatch ) => {
        netShopUpdateTelephone( telephone, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopSetMobile( mobile, callback ) {
    return ( dispatch ) => {
        netShopUpdateMobile( mobile, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopUpdateLocation( lat, lng, callback ) {
    return ( dispatch ) => {
        netShopUpdateLocation( lat, lng, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}


export function shopGetWithdrawAccount( callback ) {
    return ( dispatch ) => {
        netShopGetWithdrawAccount( ( err, resBody ) => {
            if ( !err ) {
                dispatch( {
                    'type': walletActionTypes.WITHDRAW_ACCOUNT_UPDATE,
                    withdrawAccounts: resBody.data
                } );
            }
            callback && callback( err, resBody );
        } )
    };
}

export function shopAddWithdrawAccount( accountNo, bankName, holderName, type, callback ) {
    return ( dispatch ) => {
        netShopAddWithdrawAccount( accountNo, bankName, holderName, type, ( err, resBody ) => {
            if ( !err ) {
                netShopGetWithdrawAccount( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( {
                            'type': walletActionTypes.WITHDRAW_ACCOUNT_UPDATE,
                            withdrawAccounts: resBody1.data
                        } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function clearSearchHistory() {
    return ( dispatch ) => {
        dispatch( { 'type': userActionTypes.SEARCH_HISTORY_UPDATE, searchHistory: [] } );
    };
}

/**
 * @param queryData
 *          lat: [Double] [o] location search
 *          lng: [Double] [o] location search
 *          sortingField: [String] [o] ["shopLevel", "registerDate"]
 *          sortingOrder: [String] [o] sorting order asc/desc
 *          type: [Integer] [o] filter by sell/show
 *          category: [Integer] [o] filter by category
 *          keyword: [String] [o] keyword search
 *          area: [String] [o] filter by area
 *          pageSize: [Integer] [o] number of record for each page, defaut 20
 *          pageNum: [Integer] [o] page number, defaut 0
 * @param callback
 */
export function shopSearch( queryData = {
                                lat: null,
                                lng: null,
                                sortingField: null,
                                sortingOrder: null,
                                type: null,
                                category: null,
                                keyword: null,
                                pageSize: 20,
                                pageNum: 0
                            },
                            callback ) {
    return ( dispatch ) => {
        const keys = Object.keys( queryData );

        const query = {};

        for ( let index = 0; index < keys.length; index++ ) {
            if ( keys[ index ] === 'lat' ) {
                queryData[ keys[ index ] ] = 1.3438645999999999;
            }

            if ( keys[ index ] === 'lng' ) {
                queryData[ keys[ index ] ] = 103.7011134;
            }

            // if ( keys[ index ] === 'category' || keys[ index ] === 'keyword' ) {
            //     continue;
            // }

            query[ keys[ index ] ] = queryData[ keys[ index ] ];
        }

        const store = getStore();

        // if ( store.getState().settingStore.searchCountry ) {
        //     query[ 'area' ] = store.getState().settingStore.searchCountry.code;
        // }

        if ( queryData.keyword && queryData.keyword.length > 0 ) {
            const store = getStore();

            const searchHistory = store.getState().userStore.searchHistory.slice();


            const index = searchHistory.indexOf( queryData.keyword );

            if ( index > -1 ) {
                searchHistory.splice( index, 1 );
            }

            searchHistory.unshift( queryData.keyword );

            dispatch( { 'type': userActionTypes.SEARCH_HISTORY_UPDATE, searchHistory: searchHistory } );
        }

        netShopSearch( query, ( err, resBody ) => {
            callback( err, resBody );
        } );
    };
}


/**
 * @param queryData
 *      lat: [Double] [o] location search
 *      lng: [Double] [o] location search
 *      keyword: [String] [o] keyword search
 *      pageSize: [Integer] [o] number of record for each page, defaut 20
 *      pageNum: [Integer] [o] page number, defaut 0
 * @param callback
 */
export function shopGoodsSearch( queryData = {
                                     lat: null,
                                     lng: null,
                                     keyword: null,
                                     pageSize: 20,
                                     pageNum: 0
                                 },
                                 callback ) {
    return ( dispatch ) => {
        const keys = Object.keys( queryData );

        const query = {};

        for ( let index = 0; index < keys.length; index++ ) {
            if ( keys[ index ] === 'lat' ) {
                queryData[ keys[ index ] ] = 1.3438645999999999;
            }

            if ( keys[ index ] === 'lng' ) {
                queryData[ keys[ index ] ] = 103.7011134;
            }

            // if ( keys[ index ] === 'keyword' ) {
            //     continue;
            // }


            query[ keys[ index ] ] = queryData[ keys[ index ] ];
        }

        const store = getStore();

        // if ( store.getState().settingStore.searchCountry ) {
        //     query[ 'area' ] = store.getState().settingStore.searchCountry.code;
        // }

        netShopGoodsSearch( query, ( err, resBody ) => {
            callback( err, resBody );
        } );
    };
}

export function shopSetDefaultAccount( id, callback ) {
    return ( dispatch ) => {
        netShopWithdrawAccountSetDefault( id, ( err, resBody ) => {
            if ( !err ) {
                netShopGetWithdrawAccount( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( {
                            'type': walletActionTypes.WITHDRAW_ACCOUNT_UPDATE,
                            withdrawAccounts: resBody1.data
                        } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function shopEditWithdrawAccount( pendingWithdrawAccount, callback ) {
    return ( dispatch ) => {
        netShopUpdateWithdrawAccount( pendingWithdrawAccount, ( err, resBody ) => {
            if ( !err ) {
                netShopGetWithdrawAccount( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( {
                            'type': walletActionTypes.WITHDRAW_ACCOUNT_UPDATE,
                            withdrawAccounts: resBody1.data
                        } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function shopDeleteWithdrawAccount( id, callback ) {
    return ( dispatch ) => {
        netShopDeleteWithdrawAccount( id, ( err, resBody ) => {
            if ( !err ) {
                netShopGetWithdrawAccount( ( err1, resBody1 ) => {
                    if ( !err1 ) {
                        dispatch( {
                            'type': walletActionTypes.WITHDRAW_ACCOUNT_UPDATE,
                            withdrawAccounts: resBody1.data
                        } );
                    }
                    callback && callback( err, resBody );
                } )
            } else {
                callback && callback( err, resBody );
            }
        } )
    };
}

export function shopGoodsCommentCount( goodsId, callback ) {
    // callback && callback( Error( 'Failed get shopGoodsCommentCount' ), null );
    // callback && callback( null, { data: { good: 100, average: 200, bad: 300 } } );


    netShopGoodsCommentCount( goodsId, ( err, resBody ) => {
        callback && callback( err, resBody );
    } )
}

export function shopGoodsCommentList( goodsId, type, pageSize, pageNum, callback ) {
    // // callback && callback( Error( 'Failed get shopGoodsCommentList' ), null );
    //
    // let data = [];
    //
    // if ( pageNum < 2 ) {
    //     for ( let index = 0; index < pageSize; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) + '; type = ' + type ) );
    //     }
    // } else {
    //     for ( let index = 0; index < pageSize - 1; index++ ) {
    //         data.push( createDemoData( '' + (pageNum * pageSize + index) + '; type = ' + type ) );
    //     }
    // }
    //
    // callback( null, { data: data } );


    netShopGoodsCommentList( goodsId, type, pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );

    // function createDemoData( tag ) {
    //     return {
    //         id: 13,
    //         fromMemberId: 1,
    //         fromMemberUsername: "admin: " + tag,
    //         fromMemberLogo: "https://s3-ap-southeast-1.amazonaws.com/fulda-stage/member/1/logo/images/member/1475812707263.jpg.jpg",
    //         toMemberId: 28,
    //         comment: '' + tag + ": 不错不错，测试填一下内容不错不错，测试填一下内容不错不错，测试填一下内容不错不错，测试填一下内容",
    //         reply: "",
    //         goodsId: 343,
    //         goodsType: 0,
    //         type: 1,
    //         module: "product",
    //         like: 0,
    //         dislike: 0,
    //         registerDate: 1406109121
    //     };
    // }

}

export function shopGoodsOrderList( goodsId, pageSize, pageNum, callback ) {
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

    netShopGoodsOrderList( goodsId, pageSize, pageNum, ( err, resBody ) => {
        callback && callback( err, resBody );
    } );


    // function createDemoData( tag ) {
    //     const serviceOrder1 = JSON.parse( JSON.stringify( serviceOrder ) );
    //     serviceOrder1.buyer.username += ': ' + tag;
    //
    //     return serviceOrder1;
    // }
}

export function shopGoodsGet( goodsId, callback ) {
    netShopGoodsGet( goodsId, ( err, resBody ) => {
        if ( !err ) {
        }
        callback && callback( err, resBody );
    } )
}

export function shopGoodsGetMultiple( goodsIds, callback ) {
    return ( dispatch ) => {
        netShopGoodsGet( goodsIds, ( err, resBody ) => {
            if ( !err ) {
            }
            callback && callback( err, resBody );
        } )
    }
}

export function shopGoodsList( shopId, goodsCategory, pageSize, pageNum, callback ) {
    return ( dispatch ) => {
        netShopGoodsList( shopId, goodsCategory, pageSize, pageNum, ( err, resBody ) => {
            callback && callback( err, resBody );
        } );
    };
}

export function shopSetDiscount( discount, callback ) {
    return ( dispatch ) => {
        netShopUpdateDiscount( discount, ( err, resBody ) => {
            if ( !err ) {
                dispatch( { 'type': shopActionTypes.SHOP_INFO_UPDATE, shopInfo: resBody.data } );
            }
            callback && callback( err, resBody );
        } )
    };
}