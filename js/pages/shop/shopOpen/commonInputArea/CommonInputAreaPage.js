import React from "react";
import View from "./CommonInputAreaPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({});

const CommonInputAreaPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default CommonInputAreaPage;
