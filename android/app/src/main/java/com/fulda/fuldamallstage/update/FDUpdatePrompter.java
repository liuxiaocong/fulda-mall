package com.fulda.fuldamallstage.update;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.text.format.Formatter;
import android.text.method.ScrollingMovementMethod;
import android.widget.TextView;

import com.fulda.fuldamallstage.R;

import ezy.boost.update.DefaultPromptClickListener;
import ezy.boost.update.IUpdateAgent;
import ezy.boost.update.IUpdatePrompter;
import ezy.boost.update.UpdateInfo;


public class FDUpdatePrompter implements IUpdatePrompter {

    private Context mContext;

    public FDUpdatePrompter(Context context) {
        mContext = context;
    }

    @Override
    public void prompt(IUpdateAgent agent) {
        if (mContext instanceof Activity && ((Activity) mContext).isFinishing()) {
            return;
        }
        final UpdateInfo info = agent.getInfo();
        String size = Formatter.formatShortFileSize(mContext, info.size);
        String content = String.format(mContext.getString(R.string.version_content), info.versionName, size);

        final AlertDialog dialog = new AlertDialog.Builder(mContext).create();

        dialog.setTitle(mContext.getString(R.string.soft_update));
        dialog.setCancelable(false);
        dialog.setCanceledOnTouchOutside(false);


        float density = mContext.getResources().getDisplayMetrics().density;
        TextView tv = new TextView(mContext);
        tv.setMovementMethod(new ScrollingMovementMethod());
        tv.setVerticalScrollBarEnabled(true);
        tv.setTextSize(14);
        tv.setMaxHeight((int) (250 * density));

        dialog.setView(tv, (int) (25 * density), (int) (15 * density), (int) (25 * density), 0);


        DialogInterface.OnClickListener listener = new DefaultPromptClickListener(agent, true);

        if (info.isForce) {
            tv.setText(mContext.getString(R.string.force_update) + content);
            dialog.setButton(DialogInterface.BUTTON_POSITIVE, mContext.getString(R.string.ok), listener);
        } else {
            tv.setText(content);
            dialog.setButton(DialogInterface.BUTTON_POSITIVE, mContext.getString(R.string.update_immediately), listener);
            dialog.setButton(DialogInterface.BUTTON_NEGATIVE, mContext.getString(R.string.update_late), listener);
            if (info.isIgnorable) {
                dialog.setButton(DialogInterface.BUTTON_NEUTRAL, mContext.getString(R.string.update_ignore), listener);
            }
        }
        dialog.show();
    }
}