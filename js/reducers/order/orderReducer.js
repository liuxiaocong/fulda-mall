import orderActionTypes from "./orderActionTypes";
import userActionTypes from "../user/userActionTypes";
import Util from "../../util/Util";
const initialState = {
    deliverAddressList: [],
    defaultDeliverAddress: {},
    shoppingCartItems: [],
    pendingDeliverAddressId: -1
};

export default function orderReducer( state = initialState, action ) {
    switch ( action.type ) {
        case orderActionTypes.DELIVER_ADDRESS_UPDATE: {
            return {
                ...state,
                deliverAddressList: action.deliverAddressList
            };
        }
        case orderActionTypes.DEFAULT_DELIVER_ADDRESS_UPDATE: {
            return {
                ...state,
                defaultDeliverAddress: action.defaultDeliverAddress
            };
        }
        case userActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                deliverAddressList: [],
                defaultDeliverAddress: {},
                shoppingCartItems: [],
                pendingDeliverAddressId: -1
            };
        case orderActionTypes.ADD_TO_SHOPPING_CART: {
            let shoppingCartItems = handlerAddToShoppingCart( action.shop, action.cartGoodsBean, state.shoppingCartItems );
            return {
                ...state,
                shoppingCartItems: shoppingCartItems
            };
        }
        case orderActionTypes.UPDATE_SHOPPING_CART: {
            let shoppingCartItems = action.shoppingCartItems;
            return {
                ...state,
                shoppingCartItems: shoppingCartItems
            };
        }
        case orderActionTypes.UPDATE_SHOPPING_CART_SHOP_REMARK: {
            let shoppingCartItems = state.shoppingCartItems;
            let shopId = action.shopId;
            let remark = action.remark;
            if ( shoppingCartItems && shoppingCartItems.length > 0 && remark ) {
                for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                    if ( shoppingCartItems[ i ].id === shopId ) {
                        shoppingCartItems[ i ].remark = remark;
                        break;
                    }
                }
            }
            return {
                ...state,
                shoppingCartItems: shoppingCartItems
            };
        }
        case orderActionTypes.UPDATE_SHOPPING_CART_SHOP_SHIPPING: {
            let shoppingCartItems = state.shoppingCartItems;
            let shopId = action.shopId;
            let shipping = action.shipping;
            if ( shoppingCartItems && shoppingCartItems.length > 0 && shipping ) {
                for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                    if ( shoppingCartItems[ i ].id === shopId ) {
                        shoppingCartItems[ i ].shipping = shipping;
                        break;
                    }
                }
            }
            return {
                ...state,
                shoppingCartItems: shoppingCartItems
            };
        }

        case orderActionTypes.UPDATE_PENDING_DELIVER_ADDRESS_ID: {
            return {
                ...state,
                pendingDeliverAddressId: action.pendingDeliverAddressId
            };
        }

        case orderActionTypes.REMOVE_FROM_SHOPPING_CART: {
            //action.shop, action.CartGoodsBean
            return {
                ...state,
            };
        }
        default:
            return state;
    }

    function handlerAddToShoppingCart( shop, cartGoodsBean, currentItems ) {
        let shopObj = Object.assign( {}, shop, { updateTime: (new Date()).getTime() } );
        cartGoodsBean.updateTime = (new Date()).getTime();
        cartGoodsBean.isSelect = true;
        let existShop = false;
        if ( currentItems ) {
            currentItems.forEach( function ( shopAndItem ) {
                if ( shopAndItem.id === shopObj.id ) {
                    shopAndItem = Object.assign( shopAndItem, shopObj );
                    existShop = true;
                    shopAndItem.updateTime = (new Date()).getTime();
                    let existShopGoods = false;
                    if ( shopAndItem.goods ) {
                        shopAndItem.goods.forEach( function ( goods ) {
                            if ( Util.isSameCartGoodsBean( cartGoodsBean, goods ) ) {
                                goods.quantity += cartGoodsBean.quantity;
                                goods.updateTime = (new Date()).getTime();
                                existShopGoods = true;
                            }
                        } )
                    }
                    if ( !existShopGoods ) {
                        if ( !shopAndItem.goods ) {
                            shopAndItem.goods = [];
                        }
                        shopAndItem.goods.push( cartGoodsBean );
                    }
                }
            } )
        }
        if ( !existShop ) {
            if ( !currentItems ) {
                currentItems = [];
            }
            shopObj.goods = [];
            shopObj.goods.push( cartGoodsBean );
            currentItems.push( shopObj );
        }
        return currentItems;
    }

}
