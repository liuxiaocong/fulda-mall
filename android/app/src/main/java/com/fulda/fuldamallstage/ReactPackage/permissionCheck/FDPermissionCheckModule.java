package com.fulda.fuldamallstage.ReactPackage.permissionCheck;


import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.tbruyelle.rxpermissions2.RxPermissions;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;


class FDPermissionCheckModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = FDPermissionCheckModule.class.getSimpleName();
    private static final String REACT_CLASS = "FDPermissionCheck";


    FDPermissionCheckModule(ReactApplicationContext reactContext) {
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
    public void getWriteExternalStoragePermission(final ReadableMap configMap, final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RxPermissions rxPermissions = new RxPermissions(currentActivity);

                    rxPermissions
                            .request(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                            .subscribeOn(AndroidSchedulers.mainThread())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                    new Consumer<Boolean>() {
                                        @Override
                                        public void accept(@NonNull Boolean aBoolean) throws Exception {
                                            if (aBoolean) {
                                                promise.resolve(true);
                                            } else {
                                                promise.reject(new Throwable("Failed to get Permission"));
                                            }
                                        }
                                    },
                                    new Consumer<Throwable>() {
                                        @Override
                                        public void accept(@NonNull Throwable throwable) throws Exception {
                                            promise.reject(throwable);
                                        }
                                    }
                            );
                }
            });
        }
    }

    @ReactMethod
    public void getCameraPermission(final ReadableMap configMap, final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RxPermissions rxPermissions = new RxPermissions(currentActivity);

                    rxPermissions
                            .request(Manifest.permission.CAMERA)
                            .subscribeOn(AndroidSchedulers.mainThread())
                            .observeOn(AndroidSchedulers.mainThread())
                            .subscribe(
                                    new Consumer<Boolean>() {
                                        @Override
                                        public void accept(@NonNull Boolean aBoolean) throws Exception {
                                            if (aBoolean) {
                                                promise.resolve(true);
                                            } else {
                                                promise.reject(new Throwable("Failed to get Permission"));
                                            }
                                        }
                                    },
                                    new Consumer<Throwable>() {
                                        @Override
                                        public void accept(@NonNull Throwable throwable) throws Exception {
                                            promise.reject(throwable);
                                        }
                                    }
                            );
                }
            });
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}