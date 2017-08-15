'use strict';
const FDCallbackNative = NativeModules.FDCallbackNative;
import { NativeModules, Platform } from "react-native";

export default {
    onMainPageDidMount: function () {
        if ( Platform.OS === 'ios' ) {

        } else {
            return FDCallbackNative.onMainPageComponentDidMount();
        }
    },
};