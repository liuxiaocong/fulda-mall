import React from "react";
import { Alert } from "react-native";
import View from "./WithdrawAccountSettingPageView";
import { connect } from "react-redux";
import {
    shopDeleteWithdrawAccount,
    shopGetWithdrawAccount,
    shopSetDefaultAccount
} from "../../../../actions/ShopAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        withdrawAccounts: store.walletStore.withdrawAccounts
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapAdd: () => {
        ownProps.navigation.navigate( 'withdrawAccountAddPage' );
    },
    getWithdrawAccounts: () => {
        dispatch( shopGetWithdrawAccount( null ) );
    },
    setDefaultWithdrawAccount: ( id, callback ) => {
        dispatch( shopSetDefaultAccount( id, callback ) )
    },
    onTapEditWithdrawAccount: ( withdrawAccount ) => {
        ownProps.navigation.navigate(
            'withdrawAccountEditPage',
            {
                pendingWithdrawAccount: withdrawAccount,
            }
        );
    },
    onTapDelete: ( withdrawAccount, callback ) => {
        dispatch( shopDeleteWithdrawAccount( withdrawAccount.id, callback ) )
    },
    onDeleteSuccess: () => {

    }
});

const WithdrawAccountSettingPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  WithdrawAccountSettingPage;
