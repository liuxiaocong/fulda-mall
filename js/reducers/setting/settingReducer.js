import * as userActionTypes from "../user/userActionTypes";
import * as settingActionTypes from "./settingActionTypes";
import searchCountryData from "../../../data/searchCountryData";
import currencyTypes from "../../../data/currencyType";
import DeviceInfo from "react-native-device-info";
import Util from "../../util/Util";

const initialState = {
    displayCurrency: currencyTypes[ 0 ],
    hasSetDisplayCurrency: false,
    language: Util.calcDeviceLanguage(),
    deviceCountry: DeviceInfo.getDeviceCountry(),
    searchCountry: searchCountryData[ 0 ],
    hasSetSearchCountry: false,
    isOpenDebugMode: false,
};

export default function settingReducer( state = initialState, action ) {
    switch ( action.type ) {
        case userActionTypes.USER_UPDATE: {
            const newState = {
                ...state,
            };

            if ( state.hasSetDisplayCurrency === false && action.user ) {
                for ( let index = 0; index < currencyTypes.length; index++ ) {
                    if ( currencyTypes[ index ].code === action.user.currency ) {
                        newState[ 'displayCurrency' ] = currencyTypes[ index ];
                        newState[ 'hasSetViewCurrency' ] = true;
                        break;
                    }
                }
            }

            return newState;
        }
        case settingActionTypes.DISPLAY_CURRENCY_UPDATE:
            return {
                ...state,
                displayCurrency: action.displayCurrency,
                hasSetViewCurrency: true
            };
        case settingActionTypes.LANGUAGE_UPDATE:
            return {
                ...state,
                language: action.deviceLocale,
            };
            break;
        case settingActionTypes.SEARCH_COUNTRY_UPDATE:
            return {
                ...state,
                searchCountry: action.searchCountry,
                hasSetSearchCountry: true
            };
        case settingActionTypes.DEVICE_COUNTRY_UPDATE: {
            const newState = {
                ...state,
            };

            if ( state.hasSetDisplayCurrency === false ) {
                for ( let index = 0; index < currencyTypes.length; index++ ) {
                    if ( currencyTypes[ index ].countryCode === action.deviceCountry ) {
                        newState[ 'displayCurrency' ] = currencyTypes[ index ];
                        break;
                    }
                }
            }

            if ( state.hasSetSearchCountry === false ) {
                for ( let index = 0; index < searchCountryData.length; index++ ) {
                    if ( searchCountryData[ index ].code === action.deviceCountry ) {
                        newState[ 'searchCountry' ] = searchCountryData[ index ];
                        break;
                    }
                }
            }

            newState[ 'deviceCountry' ] = action.deviceCountry;

            return newState;
        }
        case settingActionTypes.IS_OPEN_DEBUG_MODE:
            return {
                ...state,
                isOpenDebugMode: action.isOpenDebugMode,
            };
        default:
            return state;
    }
}
