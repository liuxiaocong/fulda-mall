import React from "react";
import { Alert } from "react-native";
import View from "./WithdrawAccountAddPageView";
import { connect } from "react-redux";
import { shopAddWithdrawAccount } from "../../../../actions/ShopAction";
import * as UtilConfig from "../../../../configs/UtilConfig";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapFinish: ( accountNo, bankName, holderName, callback ) => {
        dispatch( shopAddWithdrawAccount( accountNo, bankName, holderName, UtilConfig.DEFAULT_WITHDRAW_ACCOUNT_TYPE, callback ) );
    },
    onSaveSuccess(){
        ownProps.navigation.goBack();
    }
});

const WithdrawAccountAddPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  WithdrawAccountAddPage;
