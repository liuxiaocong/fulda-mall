import React from "react";
import { Alert } from "react-native";
import View from "./SetIdCardPageView";
import { memberSetIdNo } from "../../../actions/MemberAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapSave: ( idNo, callback ) => {
        dispatch( memberSetIdNo( idNo, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const setIdCardPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default setIdCardPage;
