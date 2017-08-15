import React from "react";
import View from "./SetAddressPageView";
import { memberSetAddress } from "../../../actions/MemberAction";
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
    onTapSave: ( address, callback ) => {
        dispatch( memberSetAddress( address, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const setAddressPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default setAddressPage;
