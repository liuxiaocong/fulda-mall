import React from "react";
import View from "./MainShoppingCartPageView";
import { shopGoodsGetMultiple } from "../../../../actions/ShopAction";
import { connect } from "react-redux";
import orderActionTypes from "../../../../reducers/order/orderActionTypes";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        shoppingCartItems: store.orderStore.shoppingCartItems,
        displayCurrency: store.settingStore.displayCurrency
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( pendingShoppingCartItems ) => {
        dispatch( { 'type': orderActionTypes.UPDATE_SHOPPING_CART, shoppingCartItems: pendingShoppingCartItems } );
    },
    updateShoppingCartItems: ( shoppingCartItems ) => {
        dispatch( { 'type': orderActionTypes.UPDATE_SHOPPING_CART, shoppingCartItems: shoppingCartItems } );
    },
    selectAll: ( shoppingCartItems ) => {
        dispatch( { 'type': orderActionTypes.UPDATE_SHOPPING_CART, shoppingCartItems: shoppingCartItems } );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    },
    onTapSettle: () => {
        ownProps.navigation.navigate( "checkOutPage" );
    },
    //update storage
    fetchGoodsInfo: ( goodsIds, callback ) => {
        dispatch( shopGoodsGetMultiple( goodsIds, ( err, goods ) => {
            console.log( goods );
            callback && callback( err, goods );
        } ) )
    },
});

const MainShoppingCartPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default MainShoppingCartPage;
