import React from "react";
import View from "./CheckOutPageView";
import { memberGetDeliverAddressList } from "../../../actions/MemberAction";
import { connect } from "react-redux";
import orderActionTypes from "../../../reducers/order/orderActionTypes";


//fix reducer bug
let ii = 0;
const mapStoreToProps = ( store, ownProps ) => {
    let name = "";
    if ( store.userStore.user && store.userStore.user && store.userStore.user.name ) {
        name = store.userStore.user.name;
    }
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
        user_name: name,
        shoppingCartItems: store.orderStore.shoppingCartItems,
        deliverAddressList: store.orderStore.deliverAddressList,
        pendingDeliverAddressId: store.orderStore.pendingDeliverAddressId,
        i: ii++
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    onTapCancel: () => {
        ownProps.navigation.goBack();
    },
    onTapSave: ( name, callback ) => {
        // dispatch( memberSetName( name, callback ) );
    },
    onSaveSuccess: () => {
        ownProps.navigation.goBack();
    },
    onTapShipping: ( shopId ) => {

    },
    onTapShopDiscount: ( shopId ) => {

    },
    onTapAddress: () => {
        ownProps.navigation.navigate( "addDeliverAddressPage" );
    },
    onTapClientComment: ( shopId, title, defaultVal, placeholderVal ) => {
        ownProps.navigation.navigate(
            'commonInputAreaPage',
            {
                title: title,
                defaultVal: defaultVal,
                placeholderVal: placeholderVal,
                maxLength: 120,
                callback: ( value ) => {
                    dispatch( {
                        'type': orderActionTypes.UPDATE_SHOPPING_CART_SHOP_REMARK,
                        shopId: shopId,
                        remark: value
                    } );
                }
            }
        );
    },
    onSaveShipping: ( shopId, shipping ) => {
        dispatch( {
            'type': orderActionTypes.UPDATE_SHOPPING_CART_SHOP_SHIPPING,
            shopId: shopId,
            shipping: shipping
        } );
    },
    onTapSelectDeliverAddress: () => {
        ownProps.navigation.navigate(
            'deliverAddressSelectPage',
            {
                callback: ( value ) => {
                    dispatch( {
                        'type': orderActionTypes.UPDATE_PENDING_DELIVER_ADDRESS_ID,
                        pendingDeliverAddressId: value,
                    } );
                }
            }
        );
    },
    updateShoppingCartItems: ( shoppingCartItems ) => {
        //later update this ,just for develop
        dispatch( { 'type': orderActionTypes.UPDATE_SHOPPING_CART, shoppingCartItems: shoppingCartItems } );
    },
    getDeliverAddressList: ( callback ) => {
        dispatch( memberGetDeliverAddressList( callback ) );
    },
});

const CheckOutPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default CheckOutPage;
