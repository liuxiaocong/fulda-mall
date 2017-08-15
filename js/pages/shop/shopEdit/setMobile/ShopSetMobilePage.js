import React from "react";
import View from "./ShopSetMobilePageView";
import { shopSetMobile } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let mobile = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.mobile ) {
        mobile = store.shopStore.shopInfo.mobile;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        mobile: mobile
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( mobile, callback ) => {
        dispatch( shopSetMobile( mobile, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetMobilePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopSetMobilePage;
