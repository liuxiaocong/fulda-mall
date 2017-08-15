import React from "react";
import View from "./TemplatePageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    let name = "";
    if ( store.userStore.user && store.userStore.user && store.userStore.user.name ) {
        name = store.userStore.user.name;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        user_name: name
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( name, callback ) => {
        // dispatch( memberSetName( name, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const TemplatePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default TemplatePage;
