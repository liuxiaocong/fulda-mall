import React from "react";
import View from "./ShopSetBusinessPageView";
import { shopSetBusiness } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let business = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.business ) {
        business = store.shopStore.shopInfo.business;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        business: business
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( business, callback ) => {
        dispatch( shopSetBusiness( business, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetBusinessPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopSetBusinessPage;
