import React from "react";
import View from "./ShopOpenPageView";
import { NavigationActions } from "react-navigation";
import RNGooglePlaces from "react-native-google-places";
import Toast from "react-native-root-toast";
import shopActionTypes from "../../../reducers/shop/shopActionTypes";
import { shopAddWithdrawAccount, shopCreate } from "../../../actions/ShopAction";
import { metaGetAllAreas, metaGetCategory } from "../../../actions/MetaAction";
import { fileUpload } from "../../../actions/FileAction";
import { connect } from "react-redux";
import * as UtilConfig from "../../../configs/UtilConfig";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        pendingShopInfo: store.shopStore.pendingShopInfo,
        categoryList: store.metaStore.categoryList,
        areaList: store.metaStore.areaList
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    getCategoryList: ( callback ) => {
        dispatch( metaGetCategory( -1, callback ) );
    },
    getAreaList: () => {
        dispatch( metaGetAllAreas( null ) )
    },
    setCategory: ( pendingShopInfo, category ) => {
        dispatch( {
            'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
            pendingShopInfo: Object.assign( {}, pendingShopInfo, { category: category } )
        } );
    },
    setArea: ( pendingShopInfo, area ) => {
        dispatch( {
            'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
            pendingShopInfo: Object.assign( {}, pendingShopInfo, { area: area } )
        } );
    },
    onTapName: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_OWNER_NAME,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { ownerName: value } )
                    } );
                }
            }
        );
    },
    onTapShopName: ( defaultVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'shopNameInputPage',
            {
                defaultVal: defaultVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_NAME,
                callback: ( name, placeDetail ) => {
                    const parameter = {};
                    parameter[ 'name' ] = name;

                    if ( placeDetail !== null && (!pendingShopInfo.telephone || pendingShopInfo.telephone.length <= 0) ) {
                        parameter[ 'telephone' ] = placeDetail.phoneNumber;
                    }

                    if ( placeDetail !== null && (!pendingShopInfo.address || pendingShopInfo.address.length <= 0) ) {
                        parameter[ 'address' ] = placeDetail.address;
                    }

                    if ( placeDetail !== null && !pendingShopInfo.lat ) {
                        parameter[ 'lat' ] = placeDetail.latitude;
                    }

                    if ( placeDetail !== null && !pendingShopInfo.lng ) {
                        parameter[ 'lng' ] = placeDetail.longitude;
                    }

                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, parameter )
                    } );
                }
            }
        );
    },

    onTapMerchantFees: ( defaultVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'shopSetDiscountPage',
            {
                shopType: pendingShopInfo.type,
                discount: defaultVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_DISCOUNT,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { discount: value } )
                    } );
                }
            }
        );
    },

    onTapTelephone: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_TELEPHONE,
                placeholderVal: placeholderVal,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { telephone: value } )
                    } );
                }
            }
        );
    },

    onTapMobile: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_MOBILE,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { mobile: value } )
                    } );
                }
            }
        );
    },

    onTapEmail: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.EMAIL,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { email: value } )
                    } );
                }
            }
        );
    },

    onTapRegisterNo: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_REGISTER_NO,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { registerNo: value } )
                    } );
                }
            }
        );
    },

    onTapRemark: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { remark: value } )
                    } );
                }
            }
        );
    },


    onTapAddress: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'shopAddressInputPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_ADDRESS,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { address: value } )
                    } );
                }
            }
        );
    },

    onTapIntro: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_INTRO,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { intro: value } )
                    } );
                }
            }
        );
    },

    onTapBusiness: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_BUSINESS,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { business: value } )
                    } );
                }
            }
        );
    },

    onTapIdNO: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_ID_NO,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { idNo: value } )
                    } );
                }
            }
        );
    },

    onTapPostalCode: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                keyboardType: "numeric",
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.SHOP_POSTALCODE,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { postalCode: value } )
                    } );
                }
            }
        );
    },

    onTapLocation: ( pendingShopInfo ) => {
        const query = {};

        if ( pendingShopInfo.lat && pendingShopInfo.lng ) {
            query[ 'latitude' ] = parseFloat( pendingShopInfo.lat );
            query[ 'longitude' ] = parseFloat( pendingShopInfo.lng );
        }


        RNGooglePlaces.openPlacePickerModal( query )
            .then( ( placeDetail ) => {
                const parameter = {};

                if ( placeDetail !== null && (!pendingShopInfo.name || pendingShopInfo.name.length <= 0) ) {
                    parameter[ 'name' ] = placeDetail.name;
                }

                if ( placeDetail !== null && (!pendingShopInfo.telephone || pendingShopInfo.telephone.length <= 0) ) {
                    parameter[ 'telephone' ] = placeDetail.phoneNumber;
                }

                if ( placeDetail !== null && (!pendingShopInfo.address || pendingShopInfo.address.length <= 0) ) {
                    parameter[ 'address' ] = placeDetail.address;
                }

                if ( placeDetail !== null ) {
                    parameter[ 'lat' ] = placeDetail.latitude;
                }

                if ( placeDetail !== null ) {
                    parameter[ 'lng' ] = placeDetail.longitude;
                }

                dispatch( {
                    'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                    pendingShopInfo: Object.assign( {}, pendingShopInfo, parameter )
                } );
            } )
            .catch( error => {
                Toast.show( error.message );
            } );
    },

    onTapWithdrawAccountNo: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                maxLength: UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_ACCOUNT_NO,
                placeholderVal: placeholderVal,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { accountNo: value } )
                    } );
                }
            }
        );
    },

    onTapWithdrawConfirmAccountNo: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_ACCOUNT_NO,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { accountNoConfirm: value } )
                    } );
                }
            }
        );
    },

    onTapWithdrawBankName: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                maxLength: UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_EXTRA_INFO,
                placeholderVal: placeholderVal,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { bankName: value } )
                    } );
                }
            }
        );
    },
    onTapWithdrawHolderName: ( title, defaultVal, placeholderVal, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_MEMBER_NAME,
                callback: ( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { holderName: value } )
                    } );
                }
            }
        );
    },


    onTapSelectShopType: ( currentType, pendingShopInfo ) => {
        ownProps.navigation.navigate(
            'setShopTypePage',
            {
                callback: (( value ) => {
                    dispatch( {
                        'type': shopActionTypes.PENDING_SHOP_INFO_UPDATE,
                        pendingShopInfo: Object.assign( {}, pendingShopInfo, { type: value } )
                    } );
                }),
                type: currentType
            }
        );
    },


    onTapSubmit: ( pendingShopInfo, callback ) => {
        dispatch( shopCreate( pendingShopInfo, callback ) );
    },

    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    },

    updateShopLogo: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopLogo, shopid, path, callback ) )
    },
    updateShopIdPhoto: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopIdPhoto, shopid, path, callback ) )
    },
    updateShopLicensePhoto: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopLicensePhoto, shopid, path, callback ) )
    },
    updateShopBanner: ( shopid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.ShopBanner, shopid, path, callback ) )
    },

    addWithdrawAccount: ( accountNo, bankName, holderName, callback ) => {
        dispatch( shopAddWithdrawAccount( accountNo, bankName, holderName, UtilConfig.DEFAULT_WITHDRAW_ACCOUNT_TYPE, callback ) );
    },

    onTapOpenShopPrivacy: ( url ) => {
        ownProps.navigation.dispatch( NavigationActions.navigate( {
            routeName: 'webViewPage',
            params: {
                url: url,
                webTitle: I18n.t( Keys.business_agreement_title )
            }
        } ) )
    }
});

const ShopOpenPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default ShopOpenPage;
