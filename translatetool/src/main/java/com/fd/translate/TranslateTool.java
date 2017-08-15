package com.fd.translate;


import org.apache.commons.io.FileUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TranslateTool {

    public static void main(String[] args) throws Exception {

        String newJsonFolder = "/Users/xiechao/codes/fulda-mall-app/data/locales/";
        String oldJsonFolder = "/Users/xiechao/codes/fulda-mall-app/locales_bak/";

        String targetFolder = "/Users/xiechao/Desktop/output_folder";

        FileUtils.deleteDirectory(new File(targetFolder));
        FileUtils.forceMkdir(new File(targetFolder));

        HashMap<String, File> newJsonFileMap = listFiles(new File(newJsonFolder));
        HashMap<String, File> oldJsonFileMap = listFiles(new File(oldJsonFolder));
        for (String key : newJsonFileMap.keySet()) {
            JSONObject newJsonResult = (JSONObject) readJsonResult(newJsonFileMap.get(key));
            JSONObject oldJsonResult = (JSONObject) readJsonResult(oldJsonFileMap.get(key));

            JSONObject parentJson = new JSONObject();
            calcDifferent(parentJson, newJsonResult, oldJsonResult);

            File file = new File(targetFolder + "/" +  key);
            FileUtils.writeStringToFile(file, parentJson.toJSONString());
        }
    }

    private static HashMap<String, File> listFiles(File root) {
        List<File> files = new ArrayList<File>();
        listFiles(files, root);

        HashMap<String, File> fileHashMap = new HashMap<>();

        for (File file : files) {
            fileHashMap.put(file.getName(), file);
        }

        return fileHashMap;
    }

    private static void listFiles(List<File> files, File dir) {
        File[] listFiles = dir.listFiles();
        if (listFiles != null) {
            for (File f : listFiles) {
                if (f.isFile()) {
                    files.add(f);
                } else if (f.isDirectory()) {
    //                listFiles(files, f);
                }
            }
        }
    }


    private static void calcDifferent(JSONObject parentJson, JSONObject newJsonResult, JSONObject oldJsonResult) {
        Object[] keyArray = newJsonResult.keySet().toArray();
        for (Object key : keyArray) {
            Object value = newJsonResult.get(key);
            if (value == null) {
                continue;
            }

            if (value instanceof String) {
                if (oldJsonResult == null || !oldJsonResult.containsKey(key) || !value.equals(oldJsonResult.get(key))) {
                    parentJson.put(key, value);
                }
            } else {
                JSONObject tempParentJson = new JSONObject();
                JSONObject tempNewJsonResult = (JSONObject) value;
                JSONObject tempOldJsonResult = null;

                if (oldJsonResult != null) {
                    Object oldValue = oldJsonResult.get(key);
                    if (oldValue instanceof JSONObject) {
                        tempOldJsonResult = (JSONObject) oldValue;
                    }
                }

                calcDifferent(tempParentJson, tempNewJsonResult, tempOldJsonResult);

                if (tempParentJson.keySet().size() > 0) {
                    parentJson.put(key, tempParentJson);
                }
            }


        }
    }

    private static Object readJsonResult(File file) {
        if (file == null || file.length() <= 0) {
            return null;
        }

        JSONParser parser = new JSONParser();

        Object jsonResult = null;
        try {
            jsonResult = parser.parse(new FileReader(file));
        } catch (IOException ignored) {
        } catch (ParseException e) {
            e.printStackTrace();
        }


        return jsonResult;
    }
}
