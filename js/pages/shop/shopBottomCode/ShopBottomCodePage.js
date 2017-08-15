import React from "react";
import { Alert } from "react-native";
import View from "./ShopBottomCodePageView";
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
});

const ShopBottomCodePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopBottomCodePage;
