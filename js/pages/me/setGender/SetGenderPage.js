import React from "react";
import View from "./SetGenderPageView";
import { connect } from "react-redux";
import { memberSetGender } from "../../../actions/MemberAction";


const mapStoreToProps = ( store, ownProps ) => {
    let currentGender = 1;
    if ( store.userStore && store.userStore.user && store.userStore.user ) {
        currentGender = store.userStore.user.gender
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        gender: currentGender,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( gender, callback ) => {
        dispatch( memberSetGender( gender, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const setGenderPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default setGenderPage;
