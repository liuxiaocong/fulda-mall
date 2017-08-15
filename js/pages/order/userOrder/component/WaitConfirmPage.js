import React from "react";
import View from "./WaitConfirmPageView";
import { connect } from "react-redux";
import { orderGet, orderReceive } from "../../../../actions/OrderAction";
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
        dispatch( orderGet( UtilConfig.ORDER_TYPE.SHIPPED, false, callback ) );
    },
    confirmReceive: ( orderId, callback ) => {
        dispatch( orderReceive( orderId, callback ) );
    },
});

const WaitConfirmPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default WaitConfirmPage;
