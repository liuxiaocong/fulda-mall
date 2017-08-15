import React from "react";
import View from "./BindWeChatPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapSave: () => {
        ownProps.navigation.goBack();
    },
    onTapAppId: ( title, defaultVal, placeholderVal, callback ) => {
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
});

const BindWeChatPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default BindWeChatPage;
