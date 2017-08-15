import React from "react";
import View from "./SettingPageView";
import { NavigationActions } from "react-navigation";
import settingActionTypes from "../../reducers/setting/settingActionTypes";
import { connect } from "react-redux";
import { authLogout } from "../../actions/AuthAction";
import UrlActionHandlerUtil from "../../util/UrlActionHandlerUtil";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        currency: store.settingStore.displayCurrency,
        isOpenDebugMode: store.settingStore.isOpenDebugMode,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapPassword: () => {
        ownProps.navigation.navigate( 'setPSWDPage', {
            isFromSetting: true
        } );
    },
    onTapPaidPassword: () => {
        ownProps.navigation.navigate( 'setPayPSWDPage', {
            isFromSetting: true
        } )
    },
    onSelectCurrency: ( currencyType ) => {
        dispatch( { 'type': settingActionTypes.DISPLAY_CURRENCY_UPDATE, displayCurrency: currencyType } );
    },
    onTapAbout: () => {
        ownProps.navigation.dispatch( NavigationActions.navigate( {
            routeName: 'webViewPage',
            params: {
                url: UrlActionHandlerUtil.genAbout(),
                webTitle: I18n.t( Keys.about_fulda )
            }
        } ) )
    },
    onTapLogout: ( callback ) => {
        dispatch( authLogout( callback ) );
    },

    openDebugMode: () => {
        dispatch( { 'type': settingActionTypes.IS_OPEN_DEBUG_MODE, isOpenDebugMode: true } );
    },
});

const SettingPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default SettingPage;
