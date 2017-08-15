#!/bin/sh

SRCROOT=$(cd `dirname $0`; pwd)
CONFIG_SOURCE=FuldaMallProject
PRODUCT_NAME=
BUILT_PRODUCTS_DIR=
BUILD_APP_DIR=

getEnv(){
    if [ ! -f "$SRCROOT"/.env ]; then
       echo stage
    else
        cat "$SRCROOT"/.env
    fi
}

copyConfiguration(){
	RESOURCE_PATH="$SRCROOT"/"$CONFIG_SOURCE"/config/$(getEnv)
	echo Copying Configuration.plist files under $RESOURCE_PATH to $BUILD_APP_DIR
	cp -v $RESOURCE_PATH/Configuration.plist $BUILD_APP_DIR/
}

PRODUCT_NAME=$1
BUILT_PRODUCTS_DIR=$2
BUILD_APP_DIR=${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app

copyConfiguration
