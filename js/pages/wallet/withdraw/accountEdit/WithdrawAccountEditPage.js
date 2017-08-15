import React from "react";
import { Alert } from "react-native";
import View from "./WithdrawAccountEditPageView";
import { connect } from "react-redux";
import { shopEditWithdrawAccount } from "../../../../actions/ShopAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapSave: ( pendingWithdrawAccount, callback ) => {
        dispatch( shopEditWithdrawAccount( pendingWithdrawAccount, callback ) )
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const WithdrawAccountEditPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  WithdrawAccountEditPage;
