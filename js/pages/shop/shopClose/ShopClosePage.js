import React from "react";
import { Alert } from "react-native";
import View from "./ShopClosePageView";
import { connect } from "react-redux";
import { shopClose, shopReopen } from "../../../actions/ShopAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        shopInfo: store.shopStore.shopInfo
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapSave: ( id, isClose, reason, callback ) => {
        if ( isClose ) {
            //close api only
            dispatch( shopClose( id, reason, callback ) )
        } else {
            dispatch( shopReopen( id, callback ) )

        }
    },
    onSaveSuccess(){
        ownProps.navigation.goBack();
    }
});

const ShopClosePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  ShopClosePage;
