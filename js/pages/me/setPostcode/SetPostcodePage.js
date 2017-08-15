import React from "react";
import View from "./SetPostcodePageView";
import { memberSetPostcode } from "../../../actions/MemberAction";
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
    onTapSave: ( postcode, callback ) => {
        dispatch( memberSetPostcode( postcode, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const setPostcodePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default setPostcodePage;
