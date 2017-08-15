import React from "react";
import View from "./SetPSWDPageView";
import Toast from "react-native-root-toast";
import { memberSetPassword } from "../../../actions/MemberAction";
import { connect } from "react-redux";
import * as UtilConfig from "../../../configs/UtilConfig";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        this.props.navigation.goBack();
    },
    onTapSave: ( oldPassword, newPassword, callback ) => {
        dispatch( memberSetPassword( oldPassword, newPassword, UtilConfig.CHANGE_MEMBER_PASSWORD_TYPE, callback ) );
    },
    onTapForgetPassword: ( user ) => {
        if ( user.mobile && user.mobile.length > 0 ) {
            ownProps.navigation.navigate( 'findPSWDByPhonePage', {
                canFindByEmail: !user || (user.email && user.email.length > 0),
            } );
        } else if ( user.email && user.email.length > 0 ) {
            ownProps.navigation.navigate( 'FindPSWDByEmailPage', {
                canFindByMobile: !user || (user.mobile && user.mobile.length > 0)
            } );
        } else {
            Toast.show( I18n.t( Keys.no_way_to_find_pswd ) );
        }
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    }
});

const SetPSWDPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  SetPSWDPage;
