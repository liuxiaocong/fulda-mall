import React from "react";
import View from "./BindEmailPageView";
import { connect } from "react-redux";
import { memberBindEmail } from "../../../actions/MemberAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    bindEmail: ( email, callback ) => {
        dispatch( memberBindEmail( email, callback ) );
    }
});

const BindEmailPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default BindEmailPage;
