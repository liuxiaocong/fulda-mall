import React from "react";
import View from "./BindMobilePageView";
import { connect } from "react-redux";
import { memberBindMobile, memberMobileVerifyToken } from "../../../actions/MemberAction";
import * as UtilConfig from "../../../configs/UtilConfig";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    bindMobile: ( cca2, mobile, callback ) => {
        dispatch( memberBindMobile( cca2, mobile, callback ) );
    },
    verifyToken: ( token, callback ) => {
        dispatch( memberMobileVerifyToken( token, UtilConfig.VERIFY_TOKEN_BINDMOBILE, callback ) );
    },
});

const BindMobilePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default BindMobilePage;
