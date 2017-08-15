#!/bin/sh

#1. please install 'atom' to edit release note
#   please test by open -a atom ./release_notes_template.md
#2. please install md5sha1sum: brew install md5sha1sum
#3. install "jq" to deal with json data: brew install jq
#4. config aws:
#    curl -O https://bootstrap.pypa.io/get-pip.py
#    sudo python get-pip.py
#    sudo pip install awscli
#    aws configure
#5. config the "aapt" environment path:
#    export PATH="$HOME/Library/Android/sdk/build-tools/22.0.1:$PATH"
#6. install yarn
#   npm install -g yarn react-native-cli
#hockapp api: https://support.hockeyapp.net/kb/api/api-versions
#ios build: http://www.jianshu.com/p/2247f76404eb

CURRENT_PATH=$(cd `dirname $0`; pwd)
ALTOOL=/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Support/altool
FD_KEYSTORES=~/Documents/fdKeystores
APPLE_ACCOUNT=
APPLE_PASSWORD=
HOCKEY_APP_TOKEN=
HOCKEY_APP_ANDROID_STAGE_ID=
HOCKEY_APP_ANDROID_PRODUCTION_ID=
HOCKEY_APP_IOS_STAGE_ID=
HOCKEY_APP_IOS_PRODUCTION_ID=


GIT_RELEASE_BRANCH='release'
GIT_MASTER_BRANCH='master'
GIT_CURRENT_BRANCH=

changeGitReleaseBranch(){
    GIT_CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
    echo $GIT_CURRENT_BRANCH
    git checkout $GIT_RELEASE_BRANCH
}

changeGitMasterBranch(){
    git checkout $GIT_MASTER_BRANCH
}

mergerAndRevertBranch(){
    git commit -a -m 'Release' && git push &&

    echo asuhygdhusgdsahjd  $GIT_CURRENT_BRANCH
    git checkout $GIT_CURRENT_BRANCH
    git merge $GIT_RELEASE_BRANCH && git push
}

modifyReleaseNote(){
    checkCommandExist atom

    #date +%Y%m%d-%H:%M
    rm -r -f ./release_notes.md
	cp ./release_notes_template.md ./release_notes.md

	open -a atom ./release_notes.md

	echo "Please modify release notes, press any key to continue?"
	read ANS
}

mergerReleaseNote(){
	echo `date +%Y%m%d-%H:%M` >> ./tmp.md
	cat ./release_notes.md >> ./tmp.md
	echo  >> ./tmp.md
	echo -------------------------------------------------------------------------------- >> ./tmp.md
	echo  >> ./tmp.md
	cat ./release_notes_history.md >> ./tmp.md


	rm -r -f ./release_notes.md
	rm -r -f ./release_notes_history.md
	mv ./tmp.md ./release_notes_history.md
}

loadAppleDevelopAccount() {
    if [ -f "$FD_KEYSTORES/appleAccount.ini" ]
    then
       APPLE_ACCOUNT=$(awk -F "=" '/account/ {print $2}' $FD_KEYSTORES/appleAccount.ini)
       APPLE_PASSWORD=$(awk -F "=" '/password/ {print $2}' $FD_KEYSTORES/appleAccount.ini)
    fi
}
loadHockeyAppIni() {
    if [ -f "$FD_KEYSTORES/hockeyApp.ini" ]
    then
        HOCKEY_APP_TOKEN=$(awk -F "=" '/HockeyAppToken/ {print $2}' $FD_KEYSTORES/hockeyApp.ini)
        HOCKEY_APP_ANDROID_STAGE_ID=$(awk -F "=" '/androidStage/ {print $2}' $FD_KEYSTORES/hockeyApp.ini)
        HOCKEY_APP_ANDROID_PRODUCTION_ID=$(awk -F "=" '/androidProduction/ {print $2}' $FD_KEYSTORES/hockeyApp.ini)
        HOCKEY_APP_IOS_STAGE_ID=$(awk -F "=" '/iosStage/ {print $2}' $FD_KEYSTORES/hockeyApp.ini)
        HOCKEY_APP_IOS_PRODUCTION_ID=$(awk -F "=" '/iosProduction/ {print $2}' $FD_KEYSTORES/hockeyApp.ini)
    fi
}

revertCode() {
    checkCommandExist git
    git clean -fdx
}

copyAndroidReleaseKeyStore() {
    if [ -f "$FD_KEYSTORES/fulda.keystore" ]
    then
        cp "$FD_KEYSTORES/fulda.keystore" ./android/distribution/
        cp "$FD_KEYSTORES/fuldakeystore.properties" ./android/distribution/
    fi
}

initProject() {
    checkCommandExist yarn
    checkCommandExist pod

    copyAndroidReleaseKeyStore
    yarn install
    cd $CURRENT_PATH/ios
    pod install
    cd $CURRENT_PATH
}

clearAndroidBundle(){
    rm -r -f ./android/app/src/main/assets_rct/* && echo >> ./android/app/src/main/assets_rct/ignore
    rm -r -f ./android/app/src/main/res_rct/* && echo >> ./android/app/src/main/res_rct/ignore
}

clearIOSBundle(){
    rm -r -f ./ios/bundle/* && echo >> ./ios/bundle/ignore
}

clearAndroidBuildCache(){
    ./android/gradlew  -p android/app clean
}

clearIOSBuildCache(){
#    http://www.jianshu.com/p/2247f76404eb
    xcodebuild clean -workspace ./ios/FuldaMallProject.xcworkspace -scheme FuldaMallProjectStage -configuration Release
    xcodebuild clean -workspace ./ios/FuldaMallProject.xcworkspace -scheme FuldaMallProjectProduction -configuration Release
}

buildAndroidBundle(){
#    react-native bundle --platform='android' --dev=false --entry-file='index.android.js' --bundle-output='android/app/src/main/assets_rct/index.android.bundle' --assets-dest='android/app/src/main/res_rct/'
    npm  run bundle-android
}

buildIOSBundle(){
#    react-native bundle --platform='ios' --dev=false --entry-file='index.ios.js' --bundle-output='./ios/bundle/index.ios.jsbundle'   --assets-dest='./ios/bundle/'
    npm  run bundle-ios
}

archiveAndroidForHockApp() {
    clearAndroidBundle
    buildAndroidBundle

#    clearAndroidBuildCache

    ./android/gradlew -p android/app assembleStageEnvRelease
    uploadToHockApp ./release_notes.md ./android/app/build/outputs/apk/fuldamall-StageEnv-release.apk "" $HOCKEY_APP_ANDROID_STAGE_ID

    ./android/gradlew -p android/app assembleProductionEnvRelease
    uploadToHockApp ./release_notes.md ./android/app/build/outputs/apk/fuldamall-ProductionEnv-release.apk "" $HOCKEY_APP_ANDROID_PRODUCTION_ID

    clearAndroidBundle

#    clearAndroidBuildCache
}

archiveAndroidForAppStore() {
    clearAndroidBundle
    buildAndroidBundle

#    clearAndroidBuildCache

    ./android/gradlew -p android/app assembleStoreEnvRelease

    clearAndroidBundle

#    clearAndroidBuildCache
}

doBuildIOSByScheme(){
    xcodebuild archive -workspace ./ios/FuldaMallProject.xcworkspace -configuration Release -scheme $1 -archivePath ./FuldaMallArchive/$1.xcarchive
    xcodebuild -exportArchive -archivePath ./FuldaMallArchive/$1.xcarchive -exportPath ./FuldaMallArchive/ -exportOptionsPlist $2
    cd ./FuldaMallArchive/$1.xcarchive/
    zip -r $1.dSYMs.zip dSYMs
    mv $1.dSYMs.zip $CURRENT_PATH/FuldaMallArchive
    cd $CURRENT_PATH
}

changeIOSEnv(){
    ./ios/change_env.sh
    ./ios/translate_app_name.sh
}

archiveIOSForHockApp() {
    clearIOSBundle
    buildIOSBundle

#    clearIOSBuildCache

    rm -r -f ./FuldaMallArchive && mkdir ./FuldaMallArchive

    ./ios/change_env.sh stage
    ./ios/translate_app_name.sh
    doBuildIOSByScheme FuldaMallProjectStage ./ios/ad_hoc_exportOptions.plist
    uploadToHockApp ./release_notes.md ./FuldaMallArchive/FuldaMallProjectStage.ipa ./FuldaMallArchive/FuldaMallProjectStage.dSYMs.zip $HOCKEY_APP_IOS_STAGE_ID

#    clearIOSBuildCache

    ./ios/change_env.sh production
    ./ios/translate_app_name.sh
    doBuildIOSByScheme FuldaMallProjectProduction ./ios/ad_hoc_exportOptions.plist
    uploadToHockApp ./release_notes.md ./FuldaMallArchive/FuldaMallProjectProduction.ipa ./FuldaMallArchive/FuldaMallProjectProduction.dSYMs.zip $HOCKEY_APP_IOS_PRODUCTION_ID

    ./ios/change_env.sh stage
    ./ios/translate_app_name.sh

    clearIOSBundle
#    clearIOSBuildCache
}

archiveIOSForAppStore() {
    clearIOSBundle
    buildIOSBundle

#    clearIOSBuildCache

    rm -r -f ./FuldaMallArchive && mkdir ./FuldaMallArchive

    ./ios/change_env.sh production
    ./ios/translate_app_name.sh
    doBuildIOSByScheme FuldaMallProjectProduction  ./ios/app_store_exportOptions.plist

    "$ALTOOL" --upload-app -f /Users/xiechao/codes/fulda-mall-app/FuldaMallArchive/FuldaMallProjectProduction.ipa -u $APPLE_ACCOUNT -p $APPLE_PASSWORD

    ./ios/change_env.sh stage
    ./ios/translate_app_name.sh

    clearIOSBundle
#    clearIOSBuildCache
}

runAndroid(){
    react-native run-android --variant=StageEnvDebug
#    react-native run-android --variant=ProductionEnvDebug  不能跑
}

runIOS(){
    react-native run-ios
}

uploadToHockApp() {
    CMD="curl "
    CMD=$CMD"-F \"status=2\" "
    CMD=$CMD"-F \"notify=1\" "
    CMD=$CMD"-F \"notes=<$1\" "
    CMD=$CMD"-F \"notes_type=0\" "
    CMD=$CMD"-F \"mandatory=1\" "
    CMD=$CMD"-F \"ipa=@$2\" "

    if [[ ${#3} > 0 ]]; then
       CMD=$CMD"-F \"dsym=@$3\" "
    fi

    CMD=$CMD"-H \"X-HockeyAppToken:$HOCKEY_APP_TOKEN\" "
    CMD=$CMD"https://rink.hockeyapp.net/api/2/apps/$4/app_versions/upload"

    echo $CMD

    RESULT=`eval $CMD`

    echo $RESULT
}

uploadHockApp() {
    modifyReleaseNote

    archiveAndroidForHockApp

    archiveIOSForHockApp

    mergerReleaseNote
}

uploadAndroidHockApp() {
    modifyReleaseNote

    archiveAndroidForHockApp

    mergerReleaseNote
}

uploadIOSHockApp() {
    modifyReleaseNote

    archiveIOSForHockApp

    mergerReleaseNote
}

archiveForAppStore() {
    archiveAndroidForAppStore

    archiveIOSForAppStore
}

readBoolStr(){
    if test $# == 1  ; then
        echo $1 yes/no
        read ANS
        readBoolStr "$1" $ANS
        ret=$?
        return $ret
    elif test $# == 2  ; then
        case $2 in
        yes|YES|Yes)
            return 1
        ;;
        no|NO|No)
            return 0
        ;;
        *)
            readBoolStr "$1"
            ret=$?
            return $ret
        ;;
        esac
    else
        readBoolStr "$1"
        ret=$?
        return $ret
    fi
}

updateAndroidVersionNote(){
    checkCommandExist jq

    newVersionJsonString="[{"
    newVersionJsonString="$newVersionJsonString""\"versionCode\": $1"
    newVersionJsonString="$newVersionJsonString"", \"versionName\": \"$2\""
    newVersionJsonString="$newVersionJsonString"", \"updateContent\": \"\""
    newVersionJsonString="$newVersionJsonString"", \"isForce\": $3"
    newVersionJsonString="$newVersionJsonString"", \"url\": \"$4\""
    newVersionJsonString="$newVersionJsonString"", \"md5\": \"$5\""
    newVersionJsonString="$newVersionJsonString"", \"size\": $6"
    newVersionJsonString="$newVersionJsonString""}]"

    tmpJsonFile="./temp.json"
    rm -r -f ${tmpJsonFile}

    echo ${newVersionJsonString} > ${tmpJsonFile}

    targetJsonFile="$7"
    tmpFile="./temp.txt"
    rm -r -f ${tmpFile}
    jq -s add ${targetJsonFile} ${tmpJsonFile} > ${tmpFile}
    rm -r -f ${tmpJsonFile}
    mv ${tmpFile} ${targetJsonFile}
}

clearAndroidAppOnAWS(){
    checkCommandExist aws

    VERSION_FILE="./distribution/android_release_version.json"
    TARGET_VERSION_FILE=`echo ${VERSION_FILE##*/}`

    rm -r -f $VERSION_FILE
    echo [] > $VERSION_FILE

    aws s3 cp $VERSION_FILE s3://fulda-app/android/$TARGET_VERSION_FILE  --acl public-read
    AWS_VERSION_URL=https://s3-ap-southeast-1.amazonaws.com/fulda-app/android/$TARGET_VERSION_FILE
    echo $AWS_VERSION_URL
}

uploadAndroidAppToAWS(){
    checkCommandExist aws
    checkCommandExist aapt
    checkCommandExist md5sum

    APK_FILE="./android/app/build/outputs/apk/fuldamall-StoreEnv-release.apk"
    VERSION_FILE="./distribution/android_release_version.json"
    TARGET_VERSION_FILE=`echo ${VERSION_FILE##*/}`

    package=`aapt d badging $APK_FILE |grep package |awk '{print $2}' | awk -F[\'] '{print $2}'`
    versionCode=`aapt d badging $APK_FILE |grep versionCode |awk '{print $3}' | awk -F[\'] '{print $2}'`
    versionName=`aapt d badging $APK_FILE |grep versionName |awk '{print $4}' | awk -F[\'] '{print $2}'`
    launchableActivity=`aapt d badging $APK_FILE | grep launchable-activity |awk '{print $2}' | awk -F[\'] '{print $2}'`

    TARGET_APK_NAME=$(basename $APK_FILE .apk)-$versionName.apk

    aws s3 cp $APK_FILE s3://fulda-app/android/apk/$TARGET_APK_NAME  --acl public-read
    AWS_APK_URL=https://s3-ap-southeast-1.amazonaws.com/fulda-app/android/apk/$TARGET_APK_NAME
    echo $AWS_APK_URL

    isForce=false
    readBoolStr "Is force update: "
    ret=$?
    if test $ret == 1  ; then
       isForce=true
    else
        isForce=false
    fi

    MD5=`md5sum ${APK_FILE} | awk '{ print $1 }'`
    FILESIZE=`stat -f '%z' $APK_FILE`

    updateAndroidVersionNote  $versionCode $versionName $isForce $AWS_APK_URL $MD5 $FILESIZE $VERSION_FILE

    aws s3 cp $VERSION_FILE s3://fulda-app/android/$TARGET_VERSION_FILE  --acl public-read
    AWS_VERSION_URL=https://s3-ap-southeast-1.amazonaws.com/fulda-app/android/$TARGET_VERSION_FILE
    echo $AWS_VERSION_URL
}

#uploadHockApp

function errorInputTip(){
    echo
    echo
    echo "we support follow operation："
    echo
    echo revertCode
    echo '\t'* 还原所有代码和依赖库
    echo initProject
    echo '\t'* 初始化所有依赖库:node/cocoapods
    echo runAndroid
    echo '\t'* 运行android
    echo changeIOSEnv
    echo '\t'* 修改iOS 运行环境
    echo runIOS
    echo '\t'* 运行iOS
    echo uploadHockApp
    echo uploadAndroidHockApp
    echo uploadIOSHockApp
    echo archiveForAppStore
    echo archiveAndroidForAppStore
    echo archiveIOSForAppStore
    echo uploadAndroidAppToAWS
    echo clearAndroidAppOnAWS
    echo clearAndroidBundle
    echo clearIOSBundle
    echo buildAndroidBundle
    echo buildIOSBundle

    echo
    echo
    echo "Please select your operation:"

    read ANS
    dealWithUserInput $ANS
}

function dealWithUserInput(){

	case $1 in
	revertCode|revertcode|revert|Revert)
		revertCode
	;;
	initProject|initproject|init|Init)
		initProject
	;;
	runAndroid|runandroid|android)
		runAndroid
	;;
	changeIOSEnv)
		changeIOSEnv
	;;
	runIOS|runios|runiOS)
		runIOS
	;;
	uploadHockApp)
		uploadHockApp
	;;
	uploadAndroidHockApp)
		uploadAndroidHockApp
	;;
    uploadIOSHockApp)
		uploadIOSHockApp
	;;
	archiveForAppStore)
		archiveForAppStore
	;;
	archiveAndroidForAppStore)
		archiveAndroidForAppStore
	;;
	archiveIOSForAppStore)
		archiveIOSForAppStore
	;;
	uploadAndroidAppToAWS)
		uploadAndroidAppToAWS
	;;
	clearAndroidAppOnAWS)
		clearAndroidAppOnAWS
	;;
	clearAndroidBundle)
		clearAndroidBundle
	;;
	clearIOSBundle)
		clearIOSBundle
	;;
	buildAndroidBundle)
		buildAndroidBundle
	;;
	buildIOSBundle)
		buildIOSBundle
	;;
	*)
	    errorInputTip
	;;
	esac
}

function checkCommandExist(){
    command -v $1 >/dev/null 2>&1 || { echo "I require $1 but it's not installed.  Aborting." >&2; exit 1; }
}

loadAppleDevelopAccount
loadHockeyAppIni

#echo APPLE_ACCOUNT=$APPLE_ACCOUNT
#echo APPLE_PASSWORD=$APPLE_PASSWORD
#echo HOCKEY_APP_TOKEN=$HOCKEY_APP_TOKEN
#echo HOCKEY_APP_ANDROID_STAGE_ID=$HOCKEY_APP_ANDROID_STAGE_ID
#echo HOCKEY_APP_ANDROID_PRODUCTION_ID=$HOCKEY_APP_ANDROID_PRODUCTION_ID
#echo HOCKEY_APP_IOS_STAGE_ID=$HOCKEY_APP_IOS_STAGE_ID
#echo HOCKEY_APP_IOS_PRODUCTION_ID=$HOCKEY_APP_IOS_PRODUCTION_ID

if test $# != 1  ; then
	errorInputTip
else
	dealWithUserInput $1
fi


