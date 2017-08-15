import React from "react";
import View from "./ShopSetAddressPageView";
import { shopSetAddress } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let address = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.address ) {
        address = store.shopStore.shopInfo.address;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        address: address
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( address, callback ) => {
        dispatch( shopSetAddress( address, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetAddressPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopSetAddressPage;
