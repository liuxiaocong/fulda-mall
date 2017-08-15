package com.fulda.fuldamallstage.util;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

public class GsonUtil {
    private static Gson gson = null;


    public static void init(HashMap<Type, Object> typeAdapterHashMap) {
        GsonBuilder gsonBuilder = new GsonBuilder();

        for (Map.Entry<Type, Object> entry : typeAdapterHashMap.entrySet()) {
            gsonBuilder.registerTypeAdapter(entry.getKey(), entry.getValue());
        }

        gson = gsonBuilder.create();
    }


    @SuppressWarnings("unused")
    public static <T> T parseFromFile(Class<T> cls, String filePath)
            throws JsonSyntaxException, FileNotFoundException {
        return gson.fromJson(new BufferedReader(new FileReader(filePath)), cls);
    }

    public static <T> T parseFromString(Class<T> cls, String jsonString) {
        return gson.fromJson(jsonString, cls);
    }

    @SuppressWarnings("unused")
    public static <T> T parseFromString(Type type, String jsonString) {
        return gson.fromJson(jsonString, type);
    }

    @SuppressWarnings("unused")
    public static <T> T parseFromInputStream(Class<T> cls, InputStream inputStream)
            throws JsonSyntaxException, FileNotFoundException {
        return gson.fromJson(new BufferedReader(new InputStreamReader(inputStream)), cls);
    }

    @SuppressWarnings("unused")
    public static <T> T parseFromInputStream(Type typeOfT, InputStream inputStream)
            throws JsonSyntaxException {
        return gson.fromJson(new BufferedReader(new InputStreamReader(inputStream)), typeOfT);
    }

    public static String getFormatJson(Object src) throws JsonSyntaxException {
        return gson.toJson(src);
    }

    public static Map<String, String> jsonToMap(String json) {
        Type stringStringMap = new TypeToken<Map<String, String>>() {
        }.getType();

        return gson.fromJson(json, stringStringMap);
    }

    @SuppressWarnings("unused")
    public static String mapToJson(Map<String, String> map) {
        return gson.toJson(map);
    }

    public static Gson getGson() {
        return gson;
    }

    public static String toJson(Object src) {
        return gson.toJson(src);
    }
}
