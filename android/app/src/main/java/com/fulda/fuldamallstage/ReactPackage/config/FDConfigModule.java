package com.fulda.fuldamallstage.ReactPackage.config;


import android.content.pm.PackageManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.fulda.fuldamallstage.R;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

class FDConfigModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    FDConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FDConfig";
    }


    @Override
    public
    @Nullable
    Map<String, Object> getConstants() {
        String versionName = "Unknown";
        try {
            versionName = reactContext.getPackageManager().getPackageInfo(reactContext.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        HashMap<String, Object> constants = new HashMap<>();

        constants.put("api_domain", reactContext.getString(R.string.api_domain));
        constants.put("web_domain", reactContext.getString(R.string.web_domain));
        constants.put("google_api_key", reactContext.getString(R.string.google_api_key));
        constants.put("gcm_sender_id", reactContext.getString(R.string.gcm_sender_id));
        constants.put("version_name", versionName);

        return constants;
    }
}
