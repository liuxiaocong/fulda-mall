'use strict';
const FDPermissionCheck = NativeModules.FDPermissionCheck;
import { NativeModules, Platform } from "react-native";

export default {
    checkWriteExternalStoragePermission: function ( parameter ) {
        if ( Platform.OS === 'ios' ) {
            return new Promise( function ( resolve, reject ) {
                resolve( true );
            } )
        } else {
            return FDPermissionCheck.getWriteExternalStoragePermission( parameter );
        }
    },

    checkCameraPermission: function ( parameter ) {
        if ( Platform.OS === 'ios' ) {
            return new Promise( function ( resolve, reject ) {
                resolve( true );
            } )
        } else {
            return FDPermissionCheck.getCameraPermission( parameter );
        }
    },
};