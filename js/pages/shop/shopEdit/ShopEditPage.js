import React from "react";
import View from "./ShopEditPageView";
import Toast from "react-native-root-toast";
import { shopGet, shopSetArea, shopUpdateLocation } from "../../../actions/ShopAction";
import { fileUpload } from "../../../actions/FileAction";
import { connect } from "react-redux";
import * as UtilConfig from "../../../configs/UtilConfig";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import format from "string-format";
import Util from "../../../util/Util";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        shopInfo: store.shopStore.shopInfo,
        categoryList: store.metaStore.categoryList,
        areaList: store.metaStore.areaList
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    getShopInfo: ( shopId, callback ) => {
        dispatch( shopGet( shopId, callback ) );
    },
    onTapShopName: () => {
        ownProps.navigation.navigate( 'shopSetNamePage' )
    },
    onTapBusiness: () => {
        ownProps.navigation.navigate( 'shopSetBusinessPage' )
    },
    onTapIntro: () => {
        ownProps.navigation.navigate( 'shopSetIntroPage' )
    },
    onTapTelephone: () => {
        ownProps.navigation.navigate( 'shopSetTelephonePage' )
    },
    onTapMobile: () => {
        ownProps.navigation.navigate( 'shopSetMobilePage' )
    },

    onTapAddress: () => {
        ownProps.navigation.navigate( 'shopSetAddressPage' )
    },
    shopUpdateLocation: ( lat, lng, callback ) => {
        dispatch( shopUpdateLocation( lat, lng, callback ) );
    },
    onTapMerchantFees: ( discountExpiry ) => {
        const currentTime = new Date().getTime() / 1000;
        if ( currentTime < discountExpiry ) {
            Toast.show( format( I18n.t( Keys.discount_expiry_tip ), Util.getDateDescriptionYMD( discountExpiry ) ) );
        } else {
            ownProps.navigation.navigate( 'shopSetDiscountPage' );
        }
    },
    onTapWechatBind: () => {
        ownProps.navigation.navigate( 'bindWeChatPage' )
    },
    updateShopArea: ( shopid, area, callback ) => {
        dispatch( shopSetArea( area, callback ) )
    },
    updateShopLogo: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopLogo, shopid, path, callback ) )
    },
    updateShopLicensePhoto: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopLicensePhoto, shopid, path, callback ) )
    },
    updateShopBanner: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopBanner, shopid, path, callback ) )
    },
});

const ShopEditPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopEditPage;
