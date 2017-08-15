package com.fulda.fuldamallstage.update;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.support.v7.app.NotificationCompat;

import com.fulda.fuldamallstage.R;

import ezy.boost.update.OnDownloadListener;


public class FDNotificationDownloadListener implements OnDownloadListener {
    private Context mContext;
    private int mNotifyId;
    private NotificationCompat.Builder mBuilder;

    public FDNotificationDownloadListener(Context context, int notifyId) {
        mContext = context;
        mNotifyId = notifyId;
    }

    @Override
    public void onStart() {
        if (mBuilder == null) {
            String title = mContext.getString(R.string.download_in_progress) + mContext.getString(mContext.getApplicationInfo().labelRes);
            mBuilder = new NotificationCompat.Builder(mContext);
            mBuilder.setOngoing(true)
                    .setAutoCancel(false)
                    .setPriority(Notification.PRIORITY_MAX)
                    .setDefaults(Notification.DEFAULT_VIBRATE)
                    .setSmallIcon(mContext.getApplicationInfo().icon)
                    .setTicker(title)
                    .setContentTitle(title);
        }
        onProgress(0);
    }

    @Override
    public void onProgress(int progress) {
        if (mBuilder != null) {
            if (progress > 0) {
                mBuilder.setPriority(Notification.PRIORITY_DEFAULT);
                mBuilder.setDefaults(0);
            }
            mBuilder.setProgress(100, progress, false);

            NotificationManager nm = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(mNotifyId, mBuilder.build());
        }
    }

    @Override
    public void onFinish() {
        NotificationManager nm = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
        nm.cancel(mNotifyId);
    }
}
