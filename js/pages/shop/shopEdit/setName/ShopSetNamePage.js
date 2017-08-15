import React from "react";
import View from "./ShopSetNamePageView";
import { shopSetName } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let name = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.name ) {
        name = store.shopStore.shopInfo.name;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        name: name
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( name, callback ) => {
        dispatch( shopSetName( name, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetNamePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopSetNamePage;
