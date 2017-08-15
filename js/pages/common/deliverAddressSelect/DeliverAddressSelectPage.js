import React from "react";
import View from "./DeliverAddressSelectPageView";
import { connect } from "react-redux";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        deliverAddressList: store.orderStore.deliverAddressList,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapAddDeliverAddress: () => {
        ownProps.navigation.navigate( 'addDeliverAddressPage' )
    },
});

const DeliverAddressSelectPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default DeliverAddressSelectPage;
