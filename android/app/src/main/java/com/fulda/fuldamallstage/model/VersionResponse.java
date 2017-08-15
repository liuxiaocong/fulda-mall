package com.fulda.fuldamallstage.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class VersionResponse {
    @SerializedName("versionCode")
    @Expose
    public Integer versionCode;
    @SerializedName("versionName")
    @Expose
    public String versionName;
    @SerializedName("updateContent")
    @Expose
    public String updateContent;
    @SerializedName("isForce")
    @Expose
    public boolean isForce;
    @SerializedName("url")
    @Expose
    public String url;
    @SerializedName("md5")
    @Expose
    public String md5;
    @SerializedName("size")
    @Expose
    public Long size;
}