import React from "react";
import View from "./WaitShipPageView";
import { connect } from "react-redux";
import { orderCancel, orderGet, orderShip } from "../../../../actions/OrderAction";
import * as UtilConfig from "../../../../configs/UtilConfig";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    loadData: ( callback ) => {
        dispatch( orderGet( UtilConfig.ORDER_TYPE.PAID, true, callback ) );
    },
    cancelOrder: ( orderId, callback ) => {
        dispatch( orderCancel( orderId, callback ) );
    },
    confirmShipping: ( orderId, callback ) => {
        dispatch( orderShip( orderId, callback ) );
    },
});

const WaitShipPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default WaitShipPage;
