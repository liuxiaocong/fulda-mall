import { NativeModules } from "react-native";
const FDConfig = NativeModules.FDConfig;

export default {
    getAPIDomain: function () {
        return FDConfig.api_domain;
    },
    getWebDomain: function () {
        return FDConfig.web_domain;
    },
    getGoogleApiKey: function () {
        return FDConfig.google_api_key;
    },
    getGCMSenderID: function () {
        return FDConfig.gcm_sender_id;
    },
    getVersion: function () {
        return FDConfig.version_name;
    },
};
