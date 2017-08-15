import React from "react";
import View from "./WaitPaidOrdersPageView";
import { connect } from "react-redux";
import { orderCancel, orderGet } from "../../../../actions/OrderAction";
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
        dispatch( orderGet( UtilConfig.ORDER_TYPE.NEW, true, callback ) );
    },
    cancelOrder: ( orderId, callback ) => {
        dispatch( orderCancel( orderId, callback ) );
    },
});

const WaitPaidOrdersPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default WaitPaidOrdersPage;
