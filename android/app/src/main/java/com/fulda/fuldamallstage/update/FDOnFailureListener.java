package com.fulda.fuldamallstage.update;

import android.content.Context;
import android.widget.Toast;

import ezy.boost.update.OnFailureListener;
import ezy.boost.update.UpdateError;
import ezy.boost.update.UpdateUtil;

public class FDOnFailureListener implements OnFailureListener {

    private Context mContext;

    public FDOnFailureListener(Context context) {
        mContext = context;
    }

    @Override
    public void onFailure(UpdateError error) {
        UpdateUtil.log(error.toString());
//        Toast.makeText(mContext, error.toString(), Toast.LENGTH_LONG).show();
    }
}