import React from "react";
import { FDMallNavigator } from "../../FDMallNavigator";
import { NavigationActions } from "react-navigation";
import navActionTypes from "./navActionTypes";

// const firstAction = FDMallNavigator.router.getActionForPathAndParams( 'Main' );
// const tempNavState = FDMallNavigator.router.getStateForAction( firstAction );
// const secondAction = FDMallNavigator.router.getActionForPathAndParams( 'Login' );
// const initialNavState = FDMallNavigator.router.getStateForAction(
//     // secondAction,
//     // tempNavState
// );

export const initialNavState = {
    index: 0,
    routes: [
        { key: 'Init', routeName: 'mainPage' },
    ],
};

export default function navReducer( state, action ) {
    let nextState;

    switch ( action.type ) {
        case navActionTypes.NAV_CLEAR_STACK:
            // return {
            //     ...initialNavState,
            // };
            break;
        case 'Navigation/BACK':
            if ( state.routes && state.routes.length > 0 ) {
                const lastRoute = state.routes[ state.routes.length - 1 ];
                const previousRoute = state.routes.length >= 2 ? state.routes[ state.routes.length - 2 ] : null;

                if ( lastRoute.params && lastRoute.params.onBack && lastRoute.params.onBack() ) {
                    nextState = state;
                }
                else if ( lastRoute.routeName === 'walletQRPaySuccessPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'scanPage' } ),
                        state
                    );
                }
                else if ( lastRoute.routeName === 'walletTransferSuccessPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'walletTransferPage' } ),
                        state
                    );
                }
                else if ( lastRoute.routeName === 'userProfilePage' && previousRoute && previousRoute.routeName === 'scanPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'scanPage' } ),
                        state
                    );
                }
                else if ( lastRoute.routeName === 'shopDetailPage' && previousRoute && previousRoute.routeName === 'scanPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'scanPage' } ),
                        state
                    );
                }
                else if ( lastRoute.routeName === 'goodsDetailPage' && previousRoute && previousRoute.routeName === 'scanPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'scanPage' } ),
                        state
                    );
                }
                else if ( lastRoute.routeName === 'walletQRPayPage' && previousRoute && previousRoute.routeName === 'scanPage' ) {
                    nextState = FDMallNavigator.router.getStateForAction(
                        NavigationActions.back( { key: 'scanPage' } ),
                        state
                    );
                }
                else {
                    nextState = FDMallNavigator.router.getStateForAction( action, state );
                }
            }
            else {
                nextState = FDMallNavigator.router.getStateForAction( action, state );
            }
            break;
        // case 'Login':
        //     nextState = FDMallNavigator.router.getStateForAction(
        //         NavigationActions.back(),
        //         state
        //     );
        //     break;
        // case 'Logout':
        //     nextState = FDMallNavigator.router.getStateForAction(
        //         NavigationActions.navigate({ routeName: 'Login' }),
        //         state
        //     );
        //     break;
        default:
            nextState = FDMallNavigator.router.getStateForAction( action, state );
            break;
    }


    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}
