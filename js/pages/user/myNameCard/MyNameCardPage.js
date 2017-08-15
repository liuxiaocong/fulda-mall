import React from "react";
import { Alert } from "react-native";
import View from "./MyNameCardPageView";
import { connect } from "react-redux";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    let _type = 0;
    let _identity = I18n.t( Keys.account_type_common_user );
    if ( store.userStore.user && store.userStore.user && store.userStore.user.shopExists ) {
        _type = 1;
        _identity = I18n.t( Keys.account_type_shopper )
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        type: _type,
        identity: _identity
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
});

const myNameCardPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default myNameCardPage;
