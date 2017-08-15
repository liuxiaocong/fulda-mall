import React from "react";
import View from "./MyInfoPageView";
import { connect } from "react-redux";
import { fileUpload } from "../../actions/FileAction";
import { memberMemberSetArea, memberSetDob } from "../../actions/MemberAction";
import { metaGetAllAreas } from "../../actions/MetaAction";
import * as UtilConfig from "../../configs/UtilConfig";


const mapStoreToProps = ( store, ownProps ) => {
    let finishInfo = true;

    if ( !store.userStore.user.idPhoto || store.userStore.user.idPhoto.length <= 0 ) {
        finishInfo = false;
    }

    if ( !store.userStore.user.idNo || store.userStore.user.idNo.length <= 0 ) {
        finishInfo = false;
    }

    if ( !store.userStore.user.mobile || store.userStore.user.mobile.length <= 0 || !store.userStore.user.mobileVerified ) {
        finishInfo = false;
    }
    if ( !store.userStore.user.email || store.userStore.user.email.length <= 0 || !store.userStore.user.emailVerified ) {
        finishInfo = false;
    }
    if ( !store.userStore.user.payPassSet ) {
        finishInfo = false;
    }

    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        finishInfo: finishInfo,
        areaList: store.metaStore.areaList
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapPaidPwd: () => {
        ownProps.navigation.navigate( 'setPayPSWDPage', {
            isFromSetting: true
        } );
    },
    onTapName: () => {
        ownProps.navigation.navigate( 'setNamePage' )
    },
    onTapMyNameCard: () => {
        ownProps.navigation.navigate( 'myNameCardPage' )
    },
    onTapIdCard: () => {
        ownProps.navigation.navigate( 'setIdCardPage' );
    },
    onTapGender: () => {
        ownProps.navigation.navigate( 'setGenderPage' );
    },

    onTapEmail: () => {
        ownProps.navigation.navigate( 'bindEmailPage' );
    },
    onTapMobile: () => {
        ownProps.navigation.navigate( 'bindMobilePage' );
    },
    onTapArea: () => {

    },
    onTapAddress: () => {
        ownProps.navigation.navigate( 'setAddressPage' );
    },
    onTapPostcode: () => {
        ownProps.navigation.navigate( 'setPostcodePage' );
    },

    updateMemberLogo: ( ownerid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.MemberLogo, ownerid, path, callback ) )
    },

    updateMemberIdPhoto: ( ownerid, path, callback ) => {
        dispatch( fileUpload( UtilConfig.UPLOAD_TYPE.MemberIdPhoto, ownerid, path, callback ) )
    },
    setBirthday: ( dob, callback ) => {
        dispatch( memberSetDob( dob, callback ) )
    },

    setArea: ( areaCode, callback ) => {
        dispatch( memberMemberSetArea( areaCode, callback ) );
    },
    getAreaList: () => {
        dispatch( metaGetAllAreas( null ) )
    },
});

const MyInfoPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  MyInfoPage;
