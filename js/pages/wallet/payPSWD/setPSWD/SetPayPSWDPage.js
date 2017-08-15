import React from "react";
import View from "./SetPayPSWDPageView";
import { NavigationActions } from "react-navigation";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import { memberSetPassword } from "../../../../actions/MemberAction";
import * as UtilConfig from "../../../../configs/UtilConfig";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


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
    onTapSave: ( oldPassword, newPassword, callback ) => {
        dispatch( memberSetPassword( oldPassword, newPassword, UtilConfig.CHANGE_PAYMENT_PASSWORD_TYPE, callback ) );
    },
    onTapForgetPayPassword: ( user ) => {
        if ( user.mobile && user.mobile.length > 0 ) {
            ownProps.navigation.navigate( 'findPayPSWDByMobilePage', {
                canFindByEmail: user.email && user.email.length > 0
            } );
        } else if ( user.email && user.email.length > 0 ) {
            ownProps.navigation.navigate( 'findPayPSWDByEmailPage', {
                canFindByMobile: user.mobile && user.mobile.length > 0,
            } );
        } else {
            Toast.show( I18n.t( Keys.no_way_to_find_pay_pswd ) );
        }
    },
    onSaveSuccess: () => {
        ownProps.navigation.dispatch( NavigationActions.back( ownProps.navigation.state.key === "backToSettingAction" ? null : { key: 'backToSettingAction' } ) );
    }
});

const SetPayPSWDPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  SetPayPSWDPage;
