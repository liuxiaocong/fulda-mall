import React from "react";
import View from "./ShopSetIntroPageView";
import { shopSetIntro } from "../../../../actions/ShopAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let intro = "";
    if ( store.shopStore.shopInfo && store.shopStore.shopInfo.intro ) {
        intro = store.shopStore.shopInfo.intro;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        intro: intro
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( intro, callback ) => {
        dispatch( shopSetIntro( intro, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const ShopSetIntroPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopSetIntroPage;
