package com.fulda.fuldamallstage.update;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;

import com.fulda.fuldamallstage.R;

import ezy.boost.update.OnDownloadListener;

public class FDDialogDownloadListener implements OnDownloadListener {
    private Context mContext;
    private ProgressDialog mDialog;

    public FDDialogDownloadListener(Context context) {
        mContext = context;
    }

    @Override
    public void onStart() {
        if (mContext instanceof Activity && !((Activity) mContext).isFinishing()) {
            ProgressDialog dialog = new ProgressDialog(mContext);
            dialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
            dialog.setMessage(mContext.getString(R.string.downloading));
            dialog.setIndeterminate(false);
            dialog.setCancelable(false);
            dialog.show();
            mDialog = dialog;
        }
    }

    @Override
    public void onProgress(int i) {
        if (mDialog != null) {
            mDialog.setProgress(i);
        }
    }

    @Override
    public void onFinish() {
        if (mDialog != null) {
            mDialog.dismiss();
            mDialog = null;
        }
    }
}