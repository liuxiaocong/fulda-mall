package com.fulda.fuldamallstage.util;


import android.text.TextUtils;

import com.fulda.fuldamallstage.MainApplication;
import com.fulda.fuldamallstage.model.VersionResponse;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

import ezy.boost.update.UpdateInfo;

public class VersionCheckUtil {
    private static Integer versionCompare(String str1, String str2) {
        String[] vals1 = str1.split("\\.");
        String[] vals2 = str2.split("\\.");
        int i = 0;
        // set index to first non-equal ordinal or length of shortest version string
        while (i < vals1.length && i < vals2.length && vals1[i].equals(vals2[i])) {
            i++;
        }
        // compare first non-equal ordinal number
        if (i < vals1.length && i < vals2.length) {
            int diff = Integer.valueOf(vals1[i]).compareTo(Integer.valueOf(vals2[i]));
            return Integer.signum(diff);
        }
        // the strings are equal or one string is a substring of the other
        // e.g. "1.2.3" = "1.2.3" or "1.2.3" < "1.2.3.4"
        else {
            return Integer.signum(vals1.length - vals2.length);
        }
    }

    public static UpdateInfo parseUpdateInfo(String source) {
        List<VersionResponse> responses = new ArrayList<>();

        try {
            if (!TextUtils.isEmpty(source)) {
                JSONArray jsonArray = new JSONArray(source);

                for (int index = 0; index < jsonArray.length(); index++) {
                    responses.add(GsonUtil.parseFromString(VersionResponse.class, jsonArray.getString(index)));
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        VersionResponse versionResponse = null;

        boolean isMandatoryUpdate = false;

        {
            String currentVersionName = MainApplication.versionName;
            int currentVersionCode = MainApplication.versionCode;
            for (int i = 0; i < responses.size(); i++) {
                String checkVersionName = responses.get(i).versionName;
                int checkVersionCode = responses.get(i).versionCode;

                if (versionCompare(checkVersionName, currentVersionName) == 1 || currentVersionCode < checkVersionCode) {
                    isMandatoryUpdate = isMandatoryUpdate || responses.get(i).isForce;

                    versionResponse = responses.get(i);
                    versionResponse.isForce = isMandatoryUpdate;
                }
            }
        }


        UpdateInfo info = new UpdateInfo();

        if (versionResponse != null) {
            info.hasUpdate = true;
            info.isSilent = false;
            info.isForce = versionResponse.isForce;
            info.isAutoInstall = true;
            info.isIgnorable = true;

            info.versionCode = versionResponse.versionCode;
            info.versionName = versionResponse.versionName;
            info.updateContent = versionResponse.updateContent;

            info.url = versionResponse.url;
            info.md5 = versionResponse.md5;
            info.size = versionResponse.size;
        } else {
            info.hasUpdate = false;
        }

        return info;
    }
}
