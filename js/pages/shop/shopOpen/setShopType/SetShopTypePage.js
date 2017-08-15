import React from "react";
import View from "./SetShopTypePageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let currentType = 1;
    if ( store.shopStore && store.shopStore.pendingShopInfo && store.shopStore.pendingShopInfo.type ) {
        currentType = store.shopStore.pendingShopInfo.type
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        type: currentType,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( gender, callback ) => {

    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const SetShopTypePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  SetShopTypePage;
