import { NativeModules } from "react-native";
'use strict';
const FDLocationServices = NativeModules.FDLocationServices;

export default {
    getCurrentLocation: function ( parameter ) {
        return FDLocationServices.getLocation( parameter );
        // return new Promise( function ( resolve, reject ) {
        //     resolve( {
        //         latitude: 1,
        //         longitude: 2,
        //     } );
        // } )
    },
    cancelGetLocation: function () {
        FDLocationServices.cancelGetLocation();
    },
};