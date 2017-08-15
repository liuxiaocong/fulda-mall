package com.fulda.fuldamallstage;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.fulda.fuldamallstage.update.FDDialogDownloadListener;
import com.fulda.fuldamallstage.update.FDNotificationDownloadListener;
import com.fulda.fuldamallstage.update.FDOnFailureListener;
import com.fulda.fuldamallstage.update.FDUpdatePrompter;
import com.fulda.fuldamallstage.util.VersionCheckUtil;

import net.hockeyapp.android.CrashManager;

import ezy.boost.update.IUpdateParser;
import ezy.boost.update.UpdateInfo;
import ezy.boost.update.UpdateManager;

public class MainActivity extends ReactActivity {
    private static final String TAG = MainActivity.class.getSimpleName();

    private boolean isSupportHockAppCheckUpdate = false;
    private boolean isSupportAwsCheckUpdate = false;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FuldaMallProject";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Your own code to create the view
        // ...

        isSupportHockAppCheckUpdate = isSupportCheckUpdate("support_hockapp_check_update");
        isSupportAwsCheckUpdate = isSupportCheckUpdate("support_aws_check_update");

        checkForUpdates();
    }

    @Override
    public void onResume() {
        super.onResume();
        // ... your own onResume implementation
        checkForCrashes();
    }

    @Override
    public void onPause() {
        super.onPause();
        unregisterManagers();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterManagers();
    }

    private void checkForCrashes() {
        CrashManager.register(this);
    }

    private void checkForUpdates() {
        // Remove this for store builds!
        if (isSupportHockAppCheckUpdate) {
            net.hockeyapp.android.UpdateManager.register(this);
        } else if (isSupportAwsCheckUpdate) {
            UpdateManager.create(this).setUrl(getString(R.string.aws_check_version))
                    .setParser(new IUpdateParser() {
                        @Override
                        public UpdateInfo parse(String source) throws Exception {
                            return VersionCheckUtil.parseUpdateInfo(source);
                        }
                    })
                    .setPrompter(new FDUpdatePrompter(this))
                    .setOnNotificationDownloadListener(new FDNotificationDownloadListener(this, 1999))
                    .setOnDownloadListener(new FDDialogDownloadListener(this))
                    .setOnFailureListener(new FDOnFailureListener(this))
                    .check();
        }
    }

    private void unregisterManagers() {
        if (isSupportHockAppCheckUpdate) {
            net.hockeyapp.android.UpdateManager.unregister();
        } else //noinspection StatementWithEmptyBody
            if (isSupportAwsCheckUpdate) {

            }
    }

    private boolean isSupportCheckUpdate(String key) {
        boolean support_check_update = false;
        try {
            ApplicationInfo ai = getPackageManager().getApplicationInfo(this.getPackageName(), PackageManager.GET_META_DATA);
            Bundle bundle = ai.metaData;
            support_check_update = bundle.getBoolean(key);
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "Failed to load meta-data, NameNotFound: " + e.getMessage());
        } catch (NullPointerException e) {
            Log.e(TAG, "Failed to load meta-data, NullPointer: " + e.getMessage());
        }

        return support_check_update;
    }
}
