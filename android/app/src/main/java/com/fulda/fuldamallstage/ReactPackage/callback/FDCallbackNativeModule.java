package com.fulda.fuldamallstage.ReactPackage.callback;

import android.app.Activity;
import android.content.Intent;
import android.view.WindowManager;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


class FDCallbackNativeModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = FDCallbackNativeModule.class.getSimpleName();
    private static final String REACT_CLASS = "FDCallbackNative";

    FDCallbackNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void onMainPageComponentDidMount() {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    currentActivity.getWindow().setBackgroundDrawable(null);
                    currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                }
            });
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}