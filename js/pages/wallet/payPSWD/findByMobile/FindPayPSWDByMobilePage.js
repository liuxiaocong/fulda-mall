import React from "react";
import View from "./FindPayPSWDByMobilePageView";
import * as UtilConfig from "../../../../configs/UtilConfig";
import { memberMobileVerifyToken } from "../../../../actions/MemberAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    verifyToken: ( token, callback ) => {
        dispatch( memberMobileVerifyToken( token, UtilConfig.VERIFY_TOKEN_FORGOTPAYPASSWORD, callback ) );
    },
});

const FindPayPSWDByMobilePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  FindPayPSWDByMobilePage;
