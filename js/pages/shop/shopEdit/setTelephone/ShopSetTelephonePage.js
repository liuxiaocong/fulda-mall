import React from "react";
import View from "./ShopSetTelephonePageView";
import { shopSetTelephone } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let telephone = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.telephone ) {
        telephone = store.shopStore.shopInfo.telephone;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        telephone: telephone
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( telephone, callback ) => {
        dispatch( shopSetTelephone( telephone, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetTelephonePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopSetTelephonePage;
