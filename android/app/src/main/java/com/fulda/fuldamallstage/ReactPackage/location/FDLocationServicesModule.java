package com.fulda.fuldamallstage.ReactPackage.location;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.tbruyelle.rxpermissions2.RxPermissions;

import java.util.Timer;
import java.util.TimerTask;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;


class FDLocationServicesModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = FDLocationServicesModule.class.getSimpleName();
    private static final String REACT_CLASS = "FDLocationServices";

    private Location mLastLocation;
    private LocationListener mLocationListener;
    private LocationManager locationManager;
    private Timer timer = new Timer();
    private Promise callbackPromise;

    FDLocationServicesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);

        locationManager = (LocationManager) reactContext.getSystemService(Context.LOCATION_SERVICE);
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void getLocation(final ReadableMap configMap, final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
//                    Log.e("aaaaaaaaa", "getLocation this = " + this);

                    callbackPromise = promise;

                    checkLocationService(configMap, currentActivity);
//                    promise.reject(new Throwable("location service is disabled"));
                }
            });
        }
    }

    @ReactMethod
    public void cancelGetLocation() {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
//                    Log.e("aaaaaaaaa", "cancelGetLocation this = " + this);

                    stopUpdatingLocation();
                }
            });
        }
    }

    private void checkLocationService(final ReadableMap configMap, final Activity activity) {

        if (activity == null) {
            return;
        }

        RxPermissions rxPermissions = new RxPermissions(activity);

        rxPermissions
                .request(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION)
                .subscribeOn(AndroidSchedulers.mainThread())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        new Consumer<Boolean>() {
                            @Override
                            public void accept(@NonNull Boolean aBoolean) throws Exception {
                                if (aBoolean) {
                                    startUpdatingLocation(activity);
                                } else {
                                    if (callbackPromise != null) {
                                        callbackPromise.reject(new Throwable("location service is disabled"));
                                        callbackPromise = null;
                                    }
                                }
                            }
                        },
                        new Consumer<Throwable>() {
                            @Override
                            public void accept(@NonNull Throwable throwable) throws Exception {
                                if (callbackPromise != null) {
                                    callbackPromise.reject(throwable);
                                    callbackPromise = null;
                                }
                            }
                        }
                );
    }

    private void startUpdatingLocation(final Activity activity) {
        if (
                ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                        ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED
                ) {
            if (callbackPromise != null) {
                callbackPromise.reject(new Throwable("location service is disabled"));
                callbackPromise = null;
            }

            return;
        }

        Log.e("aaaaaa", "this = " + this);

        mLocationListener = new LocationListener() {
            @Override
            public void onStatusChanged(String str, int in, Bundle bd) {
            }

            @Override
            public void onProviderEnabled(String str) {
            }

            @Override
            public void onProviderDisabled(String str) {
            }

            @Override
            public void onLocationChanged(final Location loc) {
                stopUpdatingLocation();

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mLastLocation = loc;

                        if (timer != null) {
                            timer.cancel();
                            timer = null;
                        }

                        if (callbackPromise != null) {
                            if (mLastLocation != null) {
                                callbackLocation(mLastLocation);
                            } else {
                                callbackPromise.reject(new Exception("获得地理位置失败"));
                            }

                            callbackPromise = null;
                        }
                    }
                });
            }
        };

        String bestProvider = getBestProvider();

        mLastLocation = getLastKnownLocation(bestProvider, activity);

        long timeout = 1000;

        locationManager.requestLocationUpdates(bestProvider, timeout, 0, mLocationListener);


        if (timer == null) {
            timer = new Timer();
        }

        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        timer.cancel();
                        timer = null;

                        if (callbackPromise != null) {
                            if (mLastLocation != null) {
                                callbackLocation(mLastLocation);
                            } else {
                                callbackPromise.reject(new Exception("获得地理位置失败"));
                            }
                            callbackPromise = null;
                        }
                    }
                });
            }
        }, timeout, 1000);

    }

    private void callbackLocation(Location location) {
        try {
            double longitude;
            double latitude;
            double speed;
            double altitude;
            double accuracy;
            double course;

            // Receive Longitude / Latitude from (updated) Last Location
            longitude = location.getLongitude();
            latitude = location.getLatitude();
            speed = location.getSpeed();
            altitude = location.getAltitude();
            accuracy = location.getAccuracy();
            course = location.getBearing();

            Log.i(TAG, "Got new location. Lng: " + longitude + " Lat: " + latitude);

            // Create Map with Parameters to send to JS
            WritableMap params = Arguments.createMap();
            params.putDouble("longitude", longitude);
            params.putDouble("latitude", latitude);
            params.putDouble("speed", speed);
            params.putDouble("altitude", altitude);
            params.putDouble("accuracy", accuracy);
            params.putDouble("course", course);

            // Send Event to JS to update Location
            callbackPromise.resolve(params);
        } catch (Exception e) {
            callbackPromise.reject(e);
        }
    }

    private Location getLastKnownLocation(final String bestProvider, final Activity activity) {
        if (
                ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                        ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED
                ) {

            return null;
        }


        /**
         * 分别获取GPS坐标和WiFi坐标
         */
        Location mGPSLocation = locationManager
                .getLastKnownLocation(LocationManager.GPS_PROVIDER);// GPS
        Location mWiFiLocation = locationManager
                .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);// NetWork

        return locationManager.getLastKnownLocation(bestProvider);
    }

    private String getBestProvider() {
        Criteria criteria = new Criteria();// 根据当前设备情况自动选择Location Provider
        criteria.setAccuracy(Criteria.ACCURACY_COARSE);// 最大精度
        criteria.setAltitudeRequired(false);// 不要求海拔信息
        criteria.setBearingRequired(false);// 不要求方位精度
        criteria.setCostAllowed(true);// 允许付费
        criteria.setPowerRequirement(Criteria.POWER_LOW);// 对电量的要求

        return locationManager.getBestProvider(criteria, true);
    }

    private void stopUpdatingLocation() {
        try {
            locationManager.removeUpdates(mLocationListener);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}