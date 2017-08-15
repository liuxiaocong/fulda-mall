import React from "react";
import { Alert } from "react-native";
import View from "./AddDeliverAddressPageView";
import { metaGetAllAreas } from "../../../../actions/MetaAction";
import { memberAddDeliverAddress } from "../../../../actions/MemberAction";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        areaList: store.metaStore.areaList
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapSave: ( pendingAddress, callback ) => {
        dispatch( memberAddDeliverAddress( pendingAddress, callback ) )
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    },
    onTapPostalCode: ( title, defaultVal, placeholderVal, pendingShopInfo, callback ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback,
                keyboardType: "numeric"
            }
        );
    },
    onTapAddress: ( title, defaultVal, placeholderVal, pendingShopInfo, callback ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback
            }
        );
    },
    onTapRecipient: ( title, defaultVal, placeholderVal, pendingShopInfo, callback ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback
            }
        );
    },
    onTapMobile: ( title, defaultVal, placeholderVal, pendingShopInfo, callback ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback
            }
        );
    },
    getAreaList: () => {
        dispatch( metaGetAllAreas( null ) )
    }
});

const AddDeliverAddressPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  AddDeliverAddressPage;
