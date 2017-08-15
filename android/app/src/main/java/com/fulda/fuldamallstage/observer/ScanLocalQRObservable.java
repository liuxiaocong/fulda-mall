package com.fulda.fuldamallstage.observer;


import android.graphics.Bitmap;
import android.support.annotation.NonNull;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

import java.util.Collection;
import java.util.EnumMap;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

public class ScanLocalQRObservable {
    private static final int IMAGE_MAX_WIDTH = 1000;
    private static final int IMAGE_MAX_HEIGHT = 1000;


    public static Observable<Result> getObserver(final int resId, final Collection<BarcodeFormat> barcodeFormatCollection) {
        return Observable.create(
                new ObservableOnSubscribe<Result>() {
                    @Override
                    public void subscribe(final @NonNull ObservableEmitter<Result> e) throws Exception {
                        ScaleBitmapObserver.getObserver(resId, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT)
                                .subscribe(
                                        new Consumer<Bitmap>() {
                                            @Override
                                            public void accept(final @NonNull Bitmap bitmap) throws Exception {
                                                getObserver(bitmap, barcodeFormatCollection)
                                                        .subscribe(
                                                                new Consumer<Result>() {
                                                                    @Override
                                                                    public void accept(@NonNull Result result) throws Exception {
                                                                        if (bitmap != null) {
                                                                            bitmap.recycle();
                                                                        }

                                                                        e.onNext(result);
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
                                            }
                                        },
                                        new Consumer<Throwable>() {
                                            @Override
                                            public void accept(@NonNull Throwable throwable) throws Exception {
                                                e.onError(throwable);
                                            }
                                        }
                                );
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }


    public static Observable<Result> getObserver(final String sourcePath, final Collection<BarcodeFormat> barcodeFormatCollection) {
        return Observable.create(
                new ObservableOnSubscribe<Result>() {
                    @Override
                    public void subscribe(final @NonNull ObservableEmitter<Result> e) throws Exception {
                        ScaleBitmapObserver.getObserver(sourcePath, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT)
                                .subscribe(
                                        new Consumer<Bitmap>() {
                                            @Override
                                            public void accept(final @NonNull Bitmap bitmap) throws Exception {
                                                getObserver(bitmap, barcodeFormatCollection)
                                                        .subscribe(
                                                                new Consumer<Result>() {
                                                                    @Override
                                                                    public void accept(@NonNull Result result) throws Exception {
                                                                        if (bitmap != null) {
                                                                            bitmap.recycle();
                                                                        }

                                                                        e.onNext(result);
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
                                            }
                                        },
                                        new Consumer<Throwable>() {
                                            @Override
                                            public void accept(@NonNull Throwable throwable) throws Exception {
                                                e.onError(throwable);
                                            }
                                        }
                                );
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }

    public static Observable<Result> getObserver(final Bitmap sourceBitmap, final Collection<BarcodeFormat> barcodeFormatCollection) {
        return Observable.create(
                new ObservableOnSubscribe<Result>() {
                    @Override
                    public void subscribe(final @NonNull ObservableEmitter<Result> e) throws Exception {
                        MultiFormatReader multiFormatReader = null;
                        try {
                            EnumMap<DecodeHintType, Collection<BarcodeFormat>> decodeHintTypeEnumMap = new EnumMap<>(DecodeHintType.class);
                            decodeHintTypeEnumMap.put(DecodeHintType.POSSIBLE_FORMATS, barcodeFormatCollection);

                            multiFormatReader = new MultiFormatReader();
                            multiFormatReader.setHints(decodeHintTypeEnumMap);

                            int width = sourceBitmap.getWidth();
                            int height = sourceBitmap.getHeight();

                            byte[] data = getNV21(sourceBitmap);

                            PlanarYUVLuminanceSource planarYUVLuminanceSource = new PlanarYUVLuminanceSource(data, width, height, 0, 0, width, height, false);
                            BinaryBitmap binaryBitmap = new BinaryBitmap(new HybridBinarizer(planarYUVLuminanceSource));

                            try {
                                Result var22 = multiFormatReader.decodeWithState(binaryBitmap);
                                e.onNext(var22);
                                e.onComplete();
                            } catch (NotFoundException ex) {
                                e.onError(ex);
                            }
                        } catch (Exception ex) {
                            e.onError(ex);
                        } finally {
                            if (multiFormatReader != null) {
                                multiFormatReader.reset();
                            }
                        }
                    }
                }
        )
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }

    private static byte[] getNV21(Bitmap scaled) {
        int inputWidth = scaled.getWidth();
        int inputHeight = scaled.getHeight();

        int[] argb = new int[inputWidth * inputHeight];

        scaled.getPixels(argb, 0, inputWidth, 0, 0, inputWidth, inputHeight);

        byte[] yuv = new byte[inputWidth * inputHeight * 3 / 2];
        encodeYUV420SP(yuv, argb, inputWidth, inputHeight);

        return yuv;
    }

    @SuppressWarnings("unused")
    private static void encodeYUV420SP(byte[] yuv420sp, int[] argb, int width, int height) {
        final int frameSize = width * height;

        int yIndex = 0;
        int uIndex = frameSize;
        int vIndex = frameSize + ((yuv420sp.length - frameSize) / 2);
        System.out.println(yuv420sp.length + " " + frameSize);


        int a, R, G, B, Y, U, V;
        int index = 0;
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {

                a = (argb[index] & 0xff000000) >> 24; // a is not used obviously
                R = (argb[index] & 0xff0000) >> 16;
                G = (argb[index] & 0xff00) >> 8;
                B = (argb[index] & 0xff) >> 0;

                // well known RGB to YUV algorithm

                Y = ((66 * R + 129 * G + 25 * B + 128) >> 8) + 16;
                U = ((-38 * R - 74 * G + 112 * B + 128) >> 8) + 128;
                V = ((112 * R - 94 * G - 18 * B + 128) >> 8) + 128;

                // NV21 has a plane of Y and interleaved planes of VU each sampled by a factor of 2
                //    meaning for every 4 Y pixels there are 1 V and 1 U.  Note the sampling is every other
                //    pixel AND every other scanline.
                yuv420sp[yIndex++] = (byte) ((Y < 0) ? 0 : ((Y > 255) ? 255 : Y));
                if (j % 2 == 0 && index % 2 == 0) {
                    yuv420sp[uIndex++] = (byte) ((U < 0) ? 0 : ((U > 255) ? 255 : U));
                    yuv420sp[vIndex++] = (byte) ((V < 0) ? 0 : ((V > 255) ? 255 : V));
                }

                index++;
            }
        }
    }

}
