#!/bin/sh

PROJECT_NAME=app

rm -r -f ${PROJECT_NAME}/build

./gradlew -p ${PROJECT_NAME} assembleRelease