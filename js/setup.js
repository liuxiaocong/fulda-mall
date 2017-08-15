import React from "react";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import FDMallApp from "./FDMallApp";


let _provider;
let _store;

export function setup() {
    console.disableYellowBox = true;

    class Root extends React.Component {
        constructor() {
            super();
            this.state = {
                isLoading: true,
                store: configureStore( () => {
                    this.setState( { isLoading: false } );
                } )
            };

            _store = this.state.store;
        }

        render() {
            if ( this.state.isLoading ) {
                return null;
            }
            return (
                <Provider store={this.state.store}>
                    <FDMallApp/>
                </Provider>
            );
        }
    }

    return Root;
}

export function getProvider() {
    return _provider;
}

export function getStore() {
    return _store;
}

global.LOG = ( ...args ) => {
    console.log( '/------------------------------\\' );
    console.log( ...args );
    console.log( '\\------------------------------/' );
    return args[ args.length - 1 ];
};
