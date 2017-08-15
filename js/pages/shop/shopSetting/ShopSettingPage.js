import React from "react";
import View from "./ShopSettingPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCoreSetting: () => {
        ownProps.navigation.navigate( 'shopEditPage' );
    },
    onTapOrders: () => {
        ownProps.navigation.navigate( 'shopOrderPage' );
    },
    onTapWechatBindAccount: () => {
        ownProps.navigation.navigate( 'bindWeChatPage' );
    },
    onTapWithdrawAccount: () => {
        ownProps.navigation.navigate( 'withdrawAccountSettingPage' );
    },
    onTapBaseSetting: () => {
        ownProps.navigation.navigate( 'shopSettingBasicPage' );
    }
});

const ShopSettingPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopSettingPage;
