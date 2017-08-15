import React from "react";
import View from "./SetNamePageView";
import { memberSetName } from "../../../actions/MemberAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( name, callback ) => {
        dispatch( memberSetName( name, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const setNamePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default setNamePage;
