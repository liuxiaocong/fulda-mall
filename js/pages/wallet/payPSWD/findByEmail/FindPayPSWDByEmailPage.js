import React from "react";
import View from "./FindPayPSWDByEmailPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let email = "";
    if ( store.userStore.user && store.userStore.user && store.userStore.user.email ) {
        email = store.userStore.user.email;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        email: email
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onFindBackByPhone: ( type ) => {
        ownProps.navigation.goBack();
    },
});

const FindPayPSWDByEmailPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  FindPayPSWDByEmailPage;
