import React from "react";
import View from "./ShopSetDiscountPageView";
import { shopSetDiscount } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let shopType = null;
    let discount = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.discount ) {
        shopType = store.shopStore.shopInfo.type;
        discount = store.shopStore.shopInfo.discount;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        shopType: shopType,
        discount: discount
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( discount, callback ) => {
        dispatch( shopSetDiscount( discount, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetDiscountPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopSetDiscountPage;
