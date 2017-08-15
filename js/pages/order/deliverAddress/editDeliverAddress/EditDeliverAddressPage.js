import React from "react";
import { Alert } from "react-native";
import View from "./EditDeliverAddressPageView";
import { memberUpdateDeliverAddress } from "../../../../actions/MemberAction";
import { metaGetAllAreas } from "../../../../actions/MetaAction";
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
    getAreaList: () => {
        dispatch( metaGetAllAreas( null ) )
    },
    onTapSave: ( pendingAddress, callback ) => {
        dispatch( memberUpdateDeliverAddress( pendingAddress, callback ) )
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    },
    onTapPostalCode: ( title, defaultVal, placeholderVal, pendingShopInfo, callback ) => {
        ownProps.navigation.navigate(
            'commonInfoSettingPage',
            {
                keyboardType: "numeric",
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback
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
                keyboardType: "numeric",
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                callback: callback
            }
        );
    },
});

const AddDeliverAddressPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  AddDeliverAddressPage;
