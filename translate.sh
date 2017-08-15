#!/bin/sh

#1. install "jq" to deal with json data: brew install jq

#jq 'keys'  ../data/locales/zh.json
#jq '.empty_address_data'  ../data/locales/zh.json
#jq '.main_tab'  ../data/locales/zh.json
#jq 'keys' .main_tab   ../data/locales/zh.json
#jq '.components.rows|=sort_by(.id)|.components.rows[].properties|=sort_by(.name)' file.json
#jq -s add ${targetJsonFile} ${tmpJsonFile} > ${tmpFile} && rm -r -f ${tmpJsonFile}   && mv ${tmpFile} ${targetJsonFile}
#cat ./locales/zh.json | jq '.Project[0].projectName.tag[0].tagName |= .+ ["path2"] | .Project[0].projectName.branch[0].branchName |= .+ ["path2"]'
#http://blog.sina.com.cn/s/blog_d22ef3740101hvu4.html
#Project=projectName ProjectNumber=path2 Branch=branchName Tag=tagName
#jq ".Project.${Project}.tag.${Tag} |= .+ [\"${ProjectNumber}\"] | .Project.${Project}.branch.${Branch} |= .+ [\"${ProjectNumber}\"]" ./locales/zh.json
#jq ".common.aaaaa.tag.aaaaaa |= .+ [22222222] | .common.aaaaa.tag.bbbb |= .+ [22222222] | .common.aaaaa.tag.cccccc |= .+ \"33333\"" ./locales/zh.json
#jq ".common" ./locales/zh.json
#jq ".Project.${Project}.tag.${Tag} |= .+ [\"${ProjectNumber}\"] | .Project.${Project}.branch.${Branch} |= .+ [\"${ProjectNumber}\"]" ./locales/zh.json
#jq -S -s '.[0] * .[1]' ./locales/zh.json ./locales/en.json

copySourceIntoTemp(){
    for file2 in $(ls -a $1)
    do
        if test x"$file2" != x"." -a x"$file2" != x".."  -a x"$file2" != x".DS_Store" ;then
            jq -S . $1$file2 >> $2$file2
        fi
    done
}

mergerTempSource(){
    for file2 in $(ls -a $1)
    do
        if test x"$file2" != x"." -a x"$file2" != x".." -a x"$file2" != x".DS_Store" ;then
            if [ ! -f $2 ]; then
                jq -S . $1$file2 >> ./base_local.json
            else
                jq -S -s '.[0] * .[1]' ./base_local.json $1$file2 >> ./temp_base_local.json
                rm -r -f $2
                mv ./temp_base_local.json $2
            fi
        fi
    done
}

fillMissingData(){
    for file2 in $(ls -a $1)
    do
        if test x"$file2" != x"." -a x"$file2" != x".." -a x"$file2" != x".DS_Store" ;then
            jq -S -s '.[0] * .[1]' $2 $1$file2 >> ./temp_base_local.json
            rm -r -f $1$file2
            mv ./temp_base_local.json $1$file2
        fi
    done
}

copyTempIntoSource(){
    for file2 in $(ls -a $1)
    do
        if test x"$file2" != x"." -a x"$file2" != x".."  -a x"$file2" != x".DS_Store" ;then
            jq -S . $1$file2 >> $2$file2
        fi
    done
}

createChildKeysString() {
    KEYS=`echo $1 | jq -r '. | to_entries[] | "\(.key)"'`

    arrayChild=($KEYS)

    for key in ${arrayChild[@]}
    do
        echo "    \"$2_${key}\": \"$3.${key}\",">> $4
        value=`echo "$1"  | jq ".${key}"`

        if [[ $value == {* ]]; then
            createChildKeysString "$value"  $3_${key} $3.${key} $4
        fi
    done
}

createKeysString(){
    echo const Keys = { >> $2

    KEYS=`cat $1 | jq -r '. | to_entries[] | "\(.key)"'`
    array=($KEYS)

    for key in ${array[@]}
    do
        echo "    \"${key}\": \"${key}\",">> $2
        value=`jq ".${key}"  $1`

        if [[ $value == {* ]]; then
            createChildKeysString "$value"  ${key} ${key} $2
        fi
    done

    echo "};"  >> $2
    echo "export default Keys;" >> $2
}

createKeys(){
    echo start Translate

    rm -r -f ./locales
    mkdir ./locales

    copySourceIntoTemp ./data/locales/ ./locales/

    rm -r -f ./base_local.json

    mergerTempSource ./locales/  ./base_local.json

    fillMissingData ./locales/ ./base_local.json

    rm -r -f ./data/locales/*

    copyTempIntoSource ./locales/ ./data/locales/

    rm -r -f ./locales/

    rm -r -f ./js/configs/Keys.js

    createKeysString ./base_local.json ./js/configs/Keys.js

    rm -r -f ./base_local.json

    echo Translate success!
}

function createNeedVerify(){
    echo need todo  this func
}

function mergeVerifyResult(){
    if [ ! -d $1 ];then
       echo $1 folder is not exist
       echo
       exit
    fi

    echo start merge

    MERGE_TARGET_FOLDER=./data/locales

    for file2 in $(ls -a $1)
    do
        if test x"$file2" != x"." -a x"$file2" != x".."  -a x"$file2" != x".DS_Store" ;then
            FROM_JSON=$1$file2
            TARGET_JSON=$MERGE_TARGET_FOLDER/$file2

            if [ -f $MERGE_TARGET_FOLDER/$file2 ];then
                jq -S -s '.[0] * .[1]' $TARGET_JSON $FROM_JSON >> ./temp_base_local.json
                rm -r -f $TARGET_JSON
                mv ./temp_base_local.json $TARGET_JSON
            else
                cp $FROM_JSON $TARGET_JSON
            fi
        fi
    done

    echo merge success
}

function checkFormat(){
    jq -S . $1
}

function errorInputTip(){
    echo
    echo
    echo "we support follow operation："
    echo
    echo createKeys
    echo createNeedVerify folder
    echo mergeVerifyResult folder
    echo checkFormat file

    echo
    echo
    echo "Please select your operation:"

    read ANS
    dealWithUserInput $ANS
}

function dealWithUserInput(){
    if [ $# == 2 ]; then
        if [ $1 != "checkFormat" -a $1 != "createNeedVerify" -a $1 != "mergeVerifyResult" ] ; then
            errorInputTip
            exit
        fi
    elif [ $# == 1  ] ; then
        if [ $1 == "checkFormat" -o $1 == "createNeedVerify" -o $1 == "mergeVerifyResult" ] ; then
            errorInputTip
            exit
        fi
    elif [ $# == 0  ] ; then
        createKeys
        exit
    fi

	case $1 in
	createKeys)
		createKeys
	;;
	createNeedVerify)
		createNeedVerify $2
	;;
	mergeVerifyResult)
		mergeVerifyResult $2
	;;
	checkFormat)
		checkFormat $2
	;;
	*)
	    errorInputTip
	;;
	esac
}

dealWithUserInput $*


