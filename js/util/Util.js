import { PixelRatio, Platform } from "react-native";
import currencyTypes from "../../data/currencyType";
import format from "string-format";
import Keys from "../configs/Keys";
import I18n from "../I18n";
import DeviceInfo from "react-native-device-info";
import CartGoodsBean from "../model/CartGoodsBean";

const Util = {
    buildAreaPickDate: function ( areaList ) {
        let pickerData = [];
        let nameDataMap = {};
        let codeDataMap = {};
        if ( areaList && areaList !== {} ) {

            let keys = Object.keys( areaList );
            for ( let i = 0; i < keys.length; i++ ) {
                let firstLevelObj = areaList[ keys[ i ] ];
                if ( firstLevelObj.code.toLocaleLowerCase() === "cn"
                    || firstLevelObj.code.toLocaleLowerCase() === "sg"
                ) {
                    nameDataMap[ firstLevelObj.name ] = firstLevelObj;
                    codeDataMap[ firstLevelObj.code ] = firstLevelObj;
                    let firstLevelData = {};
                    firstLevelData[ firstLevelObj.name ] = [];
                    let levelSecondKeys = Object.keys( firstLevelObj.children );
                    for ( let j = 0; j < levelSecondKeys.length; j++ ) {
                        let secondLevelObj = firstLevelObj.children[ levelSecondKeys[ j ] ];
                        nameDataMap[ secondLevelObj.name ] = secondLevelObj;
                        codeDataMap[ secondLevelObj.code ] = secondLevelObj;
                        let secondLevelData = {};
                        secondLevelData[ secondLevelObj.name ] = [];
                        let levelThirdKeys = Object.keys( secondLevelObj.children );
                        for ( let k = 0; k < levelThirdKeys.length; k++ ) {
                            let levelThirdDataName = secondLevelObj.children[ levelThirdKeys[ k ] ].name;
                            let levelThirdDataCode = secondLevelObj.children[ levelThirdKeys[ k ] ].code;
                            secondLevelData[ secondLevelObj.name ].push( levelThirdDataName );
                            nameDataMap[ levelThirdDataName ] = secondLevelObj.children[ levelThirdKeys[ k ] ];
                            codeDataMap[ levelThirdDataCode ] = secondLevelObj.children[ levelThirdKeys[ k ] ];
                        }

                        firstLevelData[ firstLevelObj.name ].push( secondLevelData )
                    }
                    pickerData.push( firstLevelData )
                }
            }
        }
        return [ pickerData, nameDataMap, codeDataMap ];
    },
    buildCategoryPickDate: function ( categoryList ) {
        let pickerData = [];
        let nameDataMap = {};
        let idDataMap = {};
        if ( categoryList !== null && categoryList.length > 0 ) {
            for ( let i = 0; i < categoryList.length; i++ ) {
                let firstLevelObj = categoryList[ i ];
                nameDataMap[ firstLevelObj.name ] = firstLevelObj;
                idDataMap[ firstLevelObj.id ] = firstLevelObj;
                let firstLevelData = {};
                firstLevelData[ firstLevelObj.name ] = [];
                if ( firstLevelObj.children && firstLevelObj.children.length > 0 ) {
                    for ( let j = 0; j < firstLevelObj.children.length; j++ ) {
                        let secondLevelObj = firstLevelObj.children[ j ];
                        nameDataMap[ secondLevelObj.name ] = secondLevelObj;
                        idDataMap[ secondLevelObj.id ] = secondLevelObj;
                        let secondLevelData = {};
                        secondLevelData[ secondLevelObj.name ] = [];
                        if ( secondLevelObj.children && secondLevelObj.children.length > 0 ) {
                            for ( let k = 0; k < secondLevelObj.children.length; k++ ) {
                                let thirdLevelDataName = secondLevelObj.children[ k ].name;
                                let thirdLevelDataID = secondLevelObj.children[ k ].id;
                                secondLevelData[ secondLevelObj.name ].push( thirdLevelDataName );
                                nameDataMap[ thirdLevelDataName ] = secondLevelObj.children[ k ];
                                idDataMap[ thirdLevelDataID ] = secondLevelObj.children[ k ];
                            }
                        }
                        firstLevelData[ firstLevelObj.name ].push( secondLevelData )
                    }
                }

                pickerData.push( firstLevelData )
            }
        }
        return [ pickerData, nameDataMap, idDataMap ];
    },
    getDistanceDescription: function ( lat1, lng1, lat2, lng2 ) {
        const distance = getDistance( lat1, lng1, lat2, lng2 );

        if ( distance < 1000 ) {
            return format( I18n.t( Keys.common_distance_meter ), ( parseInt( distance ) ) );
        } else {
            return format( I18n.t( Keys.common_distance_kilometer ), ( parseInt( distance / 1000 ) ) );
        }

        function getDistance( lat1, lng1, lat2, lng2 ) {
            const radLat1 = toRadians( lat1 );
            const radLat2 = toRadians( lat2 );
            const deltaLat = radLat1 - radLat2;
            const deltaLng = toRadians( lng1 ) - toRadians( lng2 );
            const dis = 2 * Math.asin( Math.sqrt( Math.pow( Math.sin( deltaLat / 2 ), 2 ) + Math.cos( radLat1 ) * Math.cos( radLat2 ) * Math.pow( Math.sin( deltaLng / 2 ), 2 ) ) );

            return dis * 6378137;

            function toRadians( d ) {
                return d * Math.PI / 180;
            }
        }
    },
    getShowPrice: function ( displayCurrency, displayPrice ) {
        const num = Number( displayPrice );

        for ( let index = 0; index < currencyTypes.length; index++ ) {
            if ( currencyTypes[ index ].code === displayCurrency ) {
                return currencyTypes[ index ].symbol + ' ' + num.toFixed( 2 );
            }
        }

        return displayCurrency + ' ' + num.toFixed( 2 );
    },

    getDisplaySymbol: function ( displayCurrency ) {
        for ( let index = 0; index < currencyTypes.length; index++ ) {
            if ( currencyTypes[ index ].code === displayCurrency ) {
                return currencyTypes[ index ].symbol;
            }
        }

        return displayCurrency;
    },

    getDisplayPrice: function ( displayPrice ) {
        const num = Number( displayPrice );

        return num.toFixed( 2 );
    },

    isArrayContains: function ( a, obj ) {
        for ( let i = 0; i < a.length; i++ ) {
            if ( a[ i ] === obj ) {
                return true;
            }
        }
        return false;
    },

    getCategoryImageUrl: function ( category ) {
        switch ( category.id ) {
            case 1:
                //服装鞋包
                //Clothes, Shoes & Bags
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_clothing.png' );
            case 2:
                //美妆护理
                //Beauty & Caring
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_beauty.png' );
            case 3:
                //珠宝手表
                //Jewelry & Watches
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_watch.png' );
            case 4:
                //母婴玩具
                //Baby & Toys
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_bady.png' );
            case 5:
                //数码电器
                //Digitals
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_digital.png' );
            case 6:
                //家居装修
                //Home Deco
                return require( '../imgs/category_furniture.png' );
            case 7:
                //吃喝玩乐
                //Leisure
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_leisure.png' );
            case 8:
                //旅游度假
                //Travel
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_travel.png' );
            case 9:
                //车辆交通
                //Car Rental
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_car.png' );
            case 10:
                //生活服务
                //Life & Service
                //noinspection JSCheckFunctionSignatures
                return require( '../imgs/category_living.png' );
        }
    },

    getDateDescription: function ( date1 ) {
        const date = new Date( date1 * 1000 );

        const dateNow = new Date().getTime();

        const DAYS_IN_WEEK = 7; // only within 24 hours.
        const MAX_WEEKS_TO_SHOW_RELEVANT_DATE = 4; // zero means show xx hours ago,

        const MILLI_SECS_IN_DAY = 86400000;
        const MILLI_SECS_IN_HOUR = 3600000;
        const MILLI_SECS_IN_MIN = 60000;
        let remainder;
        const relevantTime = dateNow - date;
        if ( relevantTime < 0 ) {
            return I18n.t( Keys.just_now );
        }

        remainder = Math.floor( relevantTime / MILLI_SECS_IN_DAY );

        if ( remainder > MAX_WEEKS_TO_SHOW_RELEVANT_DATE * DAYS_IN_WEEK ) {
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':';
            let m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':';
            let s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

            return (Y + M + D + h + m + s);
        }

        // else
        if ( remainder >= DAYS_IN_WEEK ) {
            const weekNumber = Math.floor( remainder / DAYS_IN_WEEK );
            if ( weekNumber === 1 ) {
                return I18n.t( Keys.one_week_ago );
            } else {
                return format( I18n.t( Keys.s_week_ago ), weekNumber );
            }
        }

        if ( remainder >= 1 ) {
            if ( remainder === 1 ) {
                return I18n.t( Keys.one_day_ago );
            } else {
                return format( I18n.t( Keys.s_day_ago ), remainder );
            }
        }

        remainder = Math.floor( relevantTime / MILLI_SECS_IN_HOUR );
        if ( remainder >= 1 ) {
            if ( remainder === 1 ) {
                return I18n.t( Keys.one_hour_ago );
            } else {
                return format( I18n.t( Keys.s_hour_ago ), remainder );
            }
        }

        remainder = Math.floor( relevantTime / MILLI_SECS_IN_MIN );

        if ( remainder >= 1 ) {
            if ( remainder === 1 ) {
                return I18n.t( Keys.one_min_ago );
            } else {
                return format( I18n.t( Keys.s_min_ago ), remainder );
            }
        }

        return I18n.t( Keys.few_seconds_ago );
    },

    getDateDescriptionYMD: function ( date1 ) {
        return this.getDateOfBirthdayDescription( date1 );
    },

    getDateOfBirthdayDescription: function ( dateOfBirthday ) {
        let displayDate = "2010-01-01";
        if ( dateOfBirthday ) {
            let date = new Date( dateOfBirthday * 1000 );
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if ( month < 10 ) {
                month = "0" + month;
            }
            let day = date.getDate();
            if ( day < 10 ) {
                day = "0" + day;
            }
            displayDate = year + "-" + month + "-" + day;
        }

        return displayDate;
    },

    isArray: function ( o ) {
        return Object.prototype.toString.call( o ) === '[object Array]';
    },

    getByteLength: function ( str ) {
        str = str + "";
        if ( str ) {
            return str.replace( /[^\x00-\xff]/g, "rr" ).length;
        } else {
            return 0;
        }
    },

    calcDeviceLanguage: function () {
        let deviceLocale = DeviceInfo.getDeviceLocale();
        const deviceCountry = DeviceInfo.getDeviceCountry();

        if ( Platform.OS === 'ios' ) {
            if ( deviceLocale.lastIndexOf( deviceCountry ) >= 0 && deviceLocale.lastIndexOf( deviceCountry ) === deviceLocale.length - deviceCountry.length ) {
                deviceLocale = deviceLocale.substr( 0, deviceLocale.length - deviceCountry.length - 1 );
            }
        }

        return deviceLocale;
    },

    getCategoryDisplay: function ( obj ) {
        let ret = "";
        if ( obj ) {
            if ( obj.category1Name ) {
                ret = ret + obj.category1Name + " ";
            }
            if ( obj.category2Name ) {
                ret = ret + obj.category2Name + " ";
            }
            if ( obj.category3Name ) {
                ret = ret + obj.category3Name + " ";
            }
        }
        return ret;
    },
    getDpFromPx: function ( pxValue ) {
        return pxValue / PixelRatio.get();
    },

    getStockCountFromGoods( goodObject, selectTypesMap )
    {
        //[{key:颜色,value:果绿},{key:尺码,value:38M}
        if ( selectTypesMap === null || selectTypesMap.length <= 0 ) {
            return goodObject.stock;
        }

        let stocksKey = '';
        for ( let index = 0; index < selectTypesMap.length; index++ ) {
            if ( selectTypesMap[ index ].value === null ) {
                return 0;
            }

            stocksKey = stocksKey + selectTypesMap[ index ].value + ':';
        }

        stocksKey = stocksKey.substr( 0, stocksKey.length - 1 );

        let count = 0;
        if ( goodObject && goodObject.detail && goodObject.detail.stocks ) {
            count = goodObject.detail.stocks[ stocksKey ];
        }
        if ( count === undefined ) {
            count = null;
        }
        return count;
    },

    getOrderAttribute( selectTypesMap )
    {
        if ( selectTypesMap === null || selectTypesMap.length === 0 ) {
            return "";
        }
        let stockSelectTypesStr = "";
        for ( let index = 0; index < selectTypesMap.length; index++ ) {
            stockSelectTypesStr += selectTypesMap[ index ].key + ':' + selectTypesMap[ index ].value + '|';
            gotValue = true;
        }
        if ( gotValue ) {
            stockSelectTypesStr = stockSelectTypesStr.substr( 0, stockSelectTypesStr.length - 1 );
        }
        return stockSelectTypesStr;
    },
    isSameCartGoodsBean( cartGoodsBeanA, cartGoodsBeanB ) {
        if ( cartGoodsBeanA && cartGoodsBeanB ) {
            let attributesA = this.getOrderAttribute( cartGoodsBeanA.selectTypesMap );
            let attributesB = this.getOrderAttribute( cartGoodsBeanB.selectTypesMap );
            return cartGoodsBeanA.id === cartGoodsBeanB.id && cartGoodsBeanA.shopId === cartGoodsBeanB.shopId &&
                cartGoodsBeanA.singlePrice === cartGoodsBeanB.singlePrice && attributesA === attributesB;
        } else {
            return false;
        }
    },

    isContains( a, obj ) {
        for ( let i = 0; i < a.length; i++ ) {
            if ( a[ i ] === obj ) {
                return true;
            }
        }
        return false;
    },

    getCartGoodsItemFromServerGoodsObject( goodsObject )
    {
        let map = [];
        if ( goodsObject ) {
            if ( goodsObject.attributes ) {
                let objectMap = goodsObject.attributes.split( '|' );
                if ( objectMap && objectMap.length > 0 ) {
                    for ( let i = 0; i < objectMap.length; i++ ) {
                        let objectStr = objectMap[ i ];
                        let objectStrArray = objectStr.split( ":" );
                        if ( objectStrArray && objectStrArray.length === 2 ) {
                            let obj = {};
                            obj.key = objectStrArray[ 0 ];
                            obj.value = objectStrArray[ 1 ];
                            map.push( obj );
                        }
                    }

                }
            }
            return new CartGoodsBean(
                goodsObject.id,
                goodsObject.goods.shopId,
                goodsObject.goods.logo,
                goodsObject.goods.name,
                goodsObject.goods.displayCurrency,
                goodsObject.goods.displayPrice,
                goodsObject.quantity,
                map,
                goodsObject.goods
            )
        } else {
            return goodsObject;
        }
    }
};
export default Util;