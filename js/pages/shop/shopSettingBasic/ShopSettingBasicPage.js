import React from "react";
import View from "./ShopSettingBasicPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        shopInfo: store.shopStore.shopInfo
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapWhetherClose: () => {
        ownProps.navigation.navigate( 'shopClosePage' )
    },
    onTapBottomCode: () => {
        ownProps.navigation.navigate( 'bottomCodePage' )
    }
});

const ShopSettingBasicPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopSettingBasicPage;
