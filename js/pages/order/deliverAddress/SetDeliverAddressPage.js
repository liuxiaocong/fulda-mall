import React from "react";
import View from "./SetDeliverAddressPageView";
import { connect } from "react-redux";
import {
    memberDeleteDeliverAddress,
    memberGetDeliverAddressList,
    memberSetDefaultDeliverAddress
} from "../../../actions/MemberAction";


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
    onTapEdit: ( addressObj ) => {
        ownProps.navigation.navigate(
            'editDeliverAddressPage',
            {
                pendingAddress: addressObj,
            }
        );
    },
    onTapDelete: ( addressObj, callback ) => {
        dispatch( memberDeleteDeliverAddress( addressObj.id, callback ) )
    },
    setDefault: ( id, callback ) => {
        dispatch( memberSetDefaultDeliverAddress( id, callback ) )
    },
    getDeliverAddressList: ( callback ) => {
        dispatch( memberGetDeliverAddressList( callback ) );
    },
    onDeleteSuccess: () => {

    }
});

const SetDeliverAddressPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  SetDeliverAddressPage;
