import { NativeModules } from "react-native";
'use strict';
const FDQRScan = NativeModules.FDQRScan;

export default {
    tryDecodeQRCode: function ( parameter ) {
        return FDQRScan.decodeQRCode( parameter );
    },
};