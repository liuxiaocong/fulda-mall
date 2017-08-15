import React from "react";
import MainMePageView from "./MainMePageView";
import { Share } from "react-native";
import Toast from "react-native-root-toast";
import constStyles from "../../../../styles/constStyles";
import { connect } from "react-redux";
import UrlActionHandlerUtil from "../../../../util/UrlActionHandlerUtil";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    //0 normal user , 1 seller
    let _type = 0;
    let _identity = I18n.t( Keys.account_type_common_user );
    if ( store.userStore.user && store.userStore.user && store.userStore.user.shopExists ) {
        _type = 1;
        _identity = I18n.t( Keys.account_type_shopper )
    }

    if ( store.userStore.user && store.userStore.user.gradeText && store.userStore.user.gradeText.length > 0 ) {
        _identity += ' / ' + store.userStore.user.gradeText;
    }

    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        type: _type,
        identity: _identity,
        navigation: store.navigator
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapAvatar: () => {
        ownProps.navigation.navigate( 'myInfoPage' )
    },
    onTapWallet: () => {
        ownProps.navigation.navigate( 'myWalletPage' )
    },
    onTapFav: () => {
        // ownProps.navigation.navigate( 'favoritesPage' );
        ownProps.navigation.navigate( 'favoritesPage1' );
    },
    onTapOrder: () => {
        ownProps.navigation.navigate( 'userOrderPage' );
        //ownProps.navigation.navigate( 'shopOrderPage' );
    },
    onTapDeliverAddress: () => {
        ownProps.navigation.navigate( 'setDeliverAddressPage' )
    },
    onTapRecommend: () => {
        ownProps.navigation.navigate( 'recommendListPage' )
    },
    onTapInvite: ( user ) => {
        //noinspection JSCheckFunctionSignatures
        Share.share( {
            message: I18n.t( Keys.download_app ),
            url: UrlActionHandlerUtil.genInviteUrl( user.id ),
            title: I18n.t( Keys.app_name )
        }, {
            dialogTitle: I18n.t( Keys.app_name ),
            excludedActivityTypes: [],
            tintColor: constStyles.THEME_COLOR
        } )
            .then( ( result ) => {
                if ( result.action === Share.sharedAction ) {
                    if ( result.activityType ) {
                        console.log( 'shared with an activityType: ' + result.activityType );
                    } else {
                        console.log( 'Shared success!' );
                    }
                } else if ( result.action === Share.dismissedAction ) {
                    console.log( 'dismissed' );
                }
            } )
            .catch( ( error ) => {
                Toast.show( error.message );
            } );
    },
    onTapTools: () => {
        ownProps.navigation.navigate( 'myToolsPage' );
    },
    onTapBecomeSeller: () => {
        ownProps.navigation.navigate( 'shopOpenPage' );
    },
    onTapTopUpList: () => {
        ownProps.navigation.navigate( 'topUpCardPage' );
    },
    onTapSellerInfo: () => {
        ownProps.navigation.navigate( 'shopSettingPage' );
    },
    onTapSetting: () => {
        ownProps.navigation.navigate( 'settingPage' );
    }

});

const MainMePage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( MainMePageView );

export default  MainMePage;
