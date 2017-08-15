import React from "react";
import View from "./CommentOrderPageView";
import { connect } from "react-redux";
import { orderComment } from "../../../../actions/OrderAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    submitComment: ( orderId, goodsComments, goodsMatchRate, deliverySpeedRate, customerServiceRate, callback ) => {
        dispatch( orderComment( orderId, goodsComments, goodsMatchRate, deliverySpeedRate, customerServiceRate, callback ) );
    },
});

const CommentOrderPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default CommentOrderPage;
