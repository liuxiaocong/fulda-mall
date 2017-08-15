#!/bin/sh

CURRENT_PATH=$(cd `dirname $0`; pwd)

function errorInputTip(){
	echo "Which version to build, stage / production?"
	 read ANS
	 dealWithUserInput $ANS
}

function dealWithUserInput(){

	case $1 in
	stage|STAGE|Stage|stag)
		rm -r -f $CURRENT_PATH/.env
		echo stage >> $CURRENT_PATH/.env
	;;
	production|PRODUCTION|Production|prod)
		rm -r -f $CURRENT_PATH/.env
		echo production >> $CURRENT_PATH/.env
	;;
	*)
	    errorInputTip
	;;
	esac
}

rm -r -f ./.env

if test $# != 1  ; then
	errorInputTip
else
	dealWithUserInput $1
fi
