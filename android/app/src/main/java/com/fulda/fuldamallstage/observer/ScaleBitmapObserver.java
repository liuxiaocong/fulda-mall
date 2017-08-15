package com.fulda.fuldamallstage.observer;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.support.annotation.NonNull;
import android.util.Log;

import com.fulda.fuldamallstage.MainApplication;

import java.io.FileOutputStream;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;


public abstract class ScaleBitmapObserver {

    private static final int THUMBNAIL_WIDTH = 400;
    private static final int THUMBNAIL_HEIGHT = 400;

    public static Observable<Bitmap> getObserver(final int resId, @SuppressWarnings("SameParameterValue") final int targetW, @SuppressWarnings("SameParameterValue") final int targetH) {
        return Observable.create(
                new ObservableOnSubscribe<Bitmap>() {
                    @Override
                    public void subscribe(final @NonNull ObservableEmitter<Bitmap> e) throws Exception {
                        try {
                            Bitmap bitmap;

                            {
                                BitmapFactory.Options bmOptions = new BitmapFactory.Options();
                                bmOptions.inJustDecodeBounds = true;
                                BitmapFactory.decodeResource(MainApplication.getInstance().getResources(), resId, bmOptions);

                                // Decode the image file into a Bitmap sized to fill the View
                                bmOptions.inSampleSize = calculateInSampleSize(bmOptions, targetW, targetH);


                                double xSScale = ((double) bmOptions.outWidth) / ((double) targetW);
                                double ySScale = ((double) bmOptions.outHeight) / ((double) targetH);

                                double startScale = xSScale > ySScale ? xSScale : ySScale;

                                int targetDensity = MainApplication.getInstance().getApplicationContext().getResources().getDisplayMetrics().densityDpi;

                                bmOptions.inScaled = true;
                                bmOptions.inDensity = (int) (targetDensity * startScale);
                                bmOptions.inTargetDensity = targetDensity;
                                bmOptions.inJustDecodeBounds = false;

                                int oldWidth = bmOptions.outWidth;
                                int oldHeight = bmOptions.outHeight;

                                bitmap = BitmapFactory.decodeResource(MainApplication.getInstance().getResources(), resId, bmOptions);


                                Log.d("aaaaaaaaa", "oldWidth = " + oldWidth + "; oldHeight = " + oldHeight + "; bitmap.getWidth() = " + bitmap.getWidth() + "; bitmap.getHeight() = " + bitmap.getHeight());
                            }

                            tryToPaddedBitmap(bitmap)
                                    .subscribe(
                                            new Consumer<Bitmap>() {
                                                @Override
                                                public void accept(@NonNull Bitmap bitmap) throws Exception {
                                                    e.onNext(bitmap);
                                                    e.onComplete();
                                                }
                                            },
                                            new Consumer<Throwable>() {
                                                @Override
                                                public void accept(@NonNull Throwable throwable) throws Exception {
                                                    e.onError(throwable);
                                                }
                                            }
                                    );
                        } catch (Exception ex) {
                            e.onError(ex);
                        }
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }


    public static Observable<Bitmap> getObserver(final String currentPhotoPath, @SuppressWarnings("SameParameterValue") final int targetW, @SuppressWarnings("SameParameterValue") final int targetH) {
        return Observable.create(
                new ObservableOnSubscribe<Bitmap>() {
                    @Override
                    public void subscribe(@NonNull final ObservableEmitter<Bitmap> e) throws Exception {
                        try {
                            Bitmap bitmap;

                            {
                                BitmapFactory.Options bmOptions = new BitmapFactory.Options();
                                bmOptions.inJustDecodeBounds = true;
                                BitmapFactory.decodeFile(currentPhotoPath, bmOptions);
                                // Decode the image file into a Bitmap sized to fill the View
                                bmOptions.inSampleSize = calculateInSampleSize(bmOptions, targetW, targetH);


                                double xSScale = ((double) bmOptions.outWidth) / ((double) targetW);
                                double ySScale = ((double) bmOptions.outHeight) / ((double) targetH);

                                double startScale = xSScale > ySScale ? xSScale : ySScale;

                                int targetDensity = MainApplication.getInstance().getApplicationContext().getResources().getDisplayMetrics().densityDpi;

                                bmOptions.inScaled = true;
                                bmOptions.inDensity = (int) (targetDensity * startScale);
                                bmOptions.inTargetDensity = targetDensity;
                                bmOptions.inJustDecodeBounds = false;

                                bitmap = BitmapFactory.decodeFile(currentPhotoPath, bmOptions);
                            }
                            tryToPaddedBitmap(bitmap)
                                    .subscribe(
                                            new Consumer<Bitmap>() {
                                                @Override
                                                public void accept(@NonNull Bitmap bitmap) throws Exception {
                                                    e.onNext(bitmap);
                                                    e.onComplete();
                                                }
                                            },
                                            new Consumer<Throwable>() {
                                                @Override
                                                public void accept(@NonNull Throwable throwable) throws Exception {
                                                    e.onError(throwable);
                                                }
                                            }
                                    );
                        } catch (Exception ex) {
                            e.onError(ex);
                        }
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }


    private static Observable<Bitmap> tryToPaddedBitmap(final Bitmap bitmap) {
        return Observable.create(
                new ObservableOnSubscribe<Bitmap>() {
                    @Override
                    public void subscribe(@NonNull ObservableEmitter<Bitmap> e) throws Exception {
                        try {
                            int width = bitmap.getWidth();
                            int height = bitmap.getHeight();

                            if (width % 2 != 0) {
                                width += 1;
                            }

                            if (height % 2 != 0) {
                                height += 1;
                            }

                            if (width == bitmap.getWidth() && height == bitmap.getHeight()) {
                                e.onNext(bitmap);
                                e.onComplete();
                                return;
                            }

                            Bitmap targetBitmap = Bitmap
                                    .createBitmap(width, height, Bitmap.Config.ARGB_8888);

                            Canvas canvas = new Canvas(targetBitmap);
                            canvas.drawBitmap(bitmap, new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight()), new Rect(0, 0, width, height), null);
                            canvas.save(Canvas.ALL_SAVE_FLAG);
                            canvas.restore();

                            bitmap.recycle();

                            e.onNext(targetBitmap);
                            e.onComplete();
                        } catch (Exception ex) {
                            e.onError(ex);
                        }
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }


    public static Observable<String> getObserver(final String currentPhotoPath, final String thumbnailPath) {
        return Observable.create(new ObservableOnSubscribe<String>() {
            @Override
            public void subscribe(@NonNull ObservableEmitter<String> e) throws Exception {
                Bitmap thumbnail;
                try {
                    {
                        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
                        bmOptions.inJustDecodeBounds = true;
                        BitmapFactory.decodeFile(currentPhotoPath, bmOptions);

                        // Decode the image file into a Bitmap sized to fill the View
                        bmOptions.inSampleSize = calculateInSampleSize(bmOptions, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

                        double xSScale = ((double) bmOptions.outWidth) / ((double) THUMBNAIL_WIDTH);
                        double ySScale = ((double) bmOptions.outHeight) / ((double) THUMBNAIL_HEIGHT);

                        double startScale = xSScale > ySScale ? xSScale : ySScale;

                        int targetDensity = MainApplication.getInstance().getApplicationContext().getResources().getDisplayMetrics().densityDpi;

                        bmOptions.inScaled = true;
                        bmOptions.inDensity = (int) (targetDensity * startScale);
                        bmOptions.inTargetDensity = targetDensity;
                        bmOptions.inJustDecodeBounds = false;

                        thumbnail = BitmapFactory.decodeFile(currentPhotoPath, bmOptions);
                    }

                    boolean tSuccess = thumbnail.compress(Bitmap.CompressFormat.JPEG, 80, new FileOutputStream(thumbnailPath, false));

                    if (tSuccess) {
                        e.onNext(thumbnailPath);
                        e.onComplete();
                    } else {
                        e.onError(new Exception("bitmap.compress failure"));
                    }
                } catch (Exception ex) {
                    e.onError(ex);
                }
            }
        }).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread());
    }

    private static int calculateInSampleSize(BitmapFactory.Options options,
                                             int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {

            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2 and
            // keeps both
            // height and width larger than the requested height and width.
            while ((halfHeight / inSampleSize) > reqHeight
                    && (halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }

        return inSampleSize;
    }
}