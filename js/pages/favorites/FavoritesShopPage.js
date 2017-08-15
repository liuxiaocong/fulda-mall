import React from "react";
import View from "./FavoritesShopPageView";
import { connect } from "react-redux";
import { memberGetFavoritesIds } from "../../actions/MemberAction";


const mapStoreToProps = ( store, ownProps ) => {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        account: store.userStore.account,
        user: store.userStore.user,
    }
};
const mapDispatchToProps = ( dispatch, ownProps ) => ({
    refreshFavIds: () => {
        dispatch( memberGetFavoritesIds( null ) );
    },
});

const FavoritesShopPage = connect(
    mapStoreToProps,
    mapDispatchToProps
)( View );

export default  FavoritesShopPage;
