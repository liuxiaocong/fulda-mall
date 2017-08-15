#!/bin/sh

SRCROOT=$(cd `dirname $0`; pwd)
CONFIG_SOURCE=FuldaMallProject

getEnv(){
    if [ ! -f "$SRCROOT"/.env ]; then
       echo stage
    else
        cat "$SRCROOT"/.env
    fi
}

translateAppName(){
	for file2 in $(ls -a $1)
	do
		if test x"$file2" != x"." -a x"$file2" != x".." ;then
			if test -d "$1/$file2" ;then
				translateAppName "$1/$file2" $file2
			else
				if test $file2 = 'Configuration.strings' ;then
					rm -r -f tmp.strings
					sed '/"CFBundleName"/d' "$SRCROOT"/"$CONFIG_SOURCE"/$2/InfoPlist.strings >> tmp.strings
					mv tmp.strings "$SRCROOT"/"$CONFIG_SOURCE"/$2/InfoPlist.strings
					cat $SRCROOT/$CONFIG_SOURCE/config/$(getEnv)/$2/Configuration.strings >> "$SRCROOT"/$CONFIG_SOURCE/$2/InfoPlist.strings
				fi
			fi
		fi
	done
}

translateAppName $SRCROOT/$CONFIG_SOURCE/config//$(getEnv)/