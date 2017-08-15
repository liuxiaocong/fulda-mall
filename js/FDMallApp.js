import React from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import AppWithNavigationState from "./FDMallNavigator";
import { NavigationActions } from "react-navigation";
import { memberChangeLanguage, memberRegisterDevice, memberUnregisterDevice } from "./actions/MemberAction";
import Toast from "react-native-root-toast";
import { voucherClubReloadListProduct } from "./actions/VoucherClubAction";
import { metaGetAllAreas, metaGetCategory } from "./actions/MetaAction";
import I18n from "./I18n";
import userActionTypes from "./reducers/user/userActionTypes";
import settingActionTypes from "./reducers/setting/settingActionTypes";
import { connect } from "react-redux";
import PushNotification from "react-native-push-notification";
import Util from "./util/Util";
import navActionTypes from "./reducers/nav/navActionTypes";
import DeviceInfo from "react-native-device-info";
import FDConfig from "./FDNativePackage/FDConfig";


const styles = StyleSheet.create( {
    container: {
        flex: 1
    }
} );
const FDMallApp = React.createClass( {
        getInitialState() {
            I18n.locale = this.props.language;

            this.props.dispatch( { 'type': navActionTypes.NAV_CLEAR_STACK } );

            return {
                appState: AppState.currentState,
                previousAppStates: [],
                memoryWarnings: 0,
                language: this.props.language,
                deviceCountry: this.props.deviceCountry,
                pushToken: this.props.pushToken,
            };
        },

        componentWillMount: function () {
            this.configNotification();

            this.props.dispatch( ( dispatch ) => {
                dispatch( {
                    'type': userActionTypes.APP_ACTIVE
                } );
            } );
        },

        componentDidMount: function () {
            const deviceLanguage = Util.calcDeviceLanguage();

            this.setState( {
                language: deviceLanguage,
                deviceCountry: DeviceInfo.getDeviceCountry()
            } );

            AppState.addEventListener( 'change', this._handleAppStateChange );
            AppState.addEventListener( 'memoryWarning', this._handleMemoryWarning );
        },

        componentWillUnmount: function () {
            AppState.removeEventListener( 'change', this._handleAppStateChange );
            AppState.removeEventListener( 'memoryWarning', this._handleMemoryWarning );
        },

        _handleMemoryWarning: function () {
            this.setState( { memoryWarnings: this.state.memoryWarnings + 1 } );
        },

        _handleAppStateChange: function ( appState ) {
            const previousAppStates = this.state.previousAppStates.slice();
            previousAppStates.push( this.state.appState );
            this.setState( {
                appState: appState,
                previousAppStates: previousAppStates,
                language: Util.calcDeviceLanguage(),
                deviceCountry: DeviceInfo.getDeviceCountry()
            } );
        },

        shouldComponentUpdate: function ( nextProps, nextState ) {
            if ( nextProps.isLoggedIn === true ) {
                if ( nextProps.isLoggedIn !== this.props.isLoggedIn ) {
                    if ( nextProps.pushToken && nextProps.pushToken.length > 0 ) {
                        //register

                        memberRegisterDevice( nextProps.pushToken, ( err, res ) => {
                            if ( err ) {
                                console.log( err.message );
                            }
                        } );
                    }
                } else {
                    if ( nextProps.pushToken !== this.props.pushToken ) {
                        if ( this.props.pushToken && this.props.pushToken.length > 0 ) {
                            //un register old

                            memberUnregisterDevice( this.props.pushToken, ( err, res ) => {
                                if ( err ) {
                                    console.log( err.message );
                                }

                                if ( nextProps.pushToken && nextProps.pushToken.length > 0 ) {
                                    // register new

                                    memberRegisterDevice( nextProps.pushToken, ( err, res ) => {
                                        if ( err ) {
                                            console.log( err.message );
                                        }
                                    } );
                                }
                            } );


                        } else {
                            if ( nextProps.pushToken && nextProps.pushToken.length > 0 ) {
                                // register new

                                memberRegisterDevice( nextProps.pushToken, ( err, res ) => {
                                    if ( err ) {
                                        console.log( err.message );
                                    }
                                } );
                            }
                        }
                    }
                }
            }

            if ( nextProps.deviceCountry !== nextState.deviceCountry ) {
                this.props.dispatch( ( dispatch ) => {
                    dispatch( {
                        'type': settingActionTypes.DEVICE_COUNTRY_UPDATE,
                        deviceCountry: nextState.deviceCountry
                    } );
                } );
            }

            if ( nextProps.language !== nextState.language ) {
                this.props.dispatch( ( dispatch ) => {
                    dispatch( { 'type': settingActionTypes.LANGUAGE_UPDATE, deviceLocale: nextState.language } );
                } );

                I18n.locale = nextState.language;


                this.onMemberChangeLanguage( nextState.pushToken, nextState.language );
            }

            if ( nextProps.pushToken !== this.state.pushToken ) {
                this.props.dispatch( { 'type': userActionTypes.PUSH_TOKEN_UPDATE, pushToken: nextState.pushToken } );
            }

            if ( nextState.appState !== this.state.appState ) {
                if ( nextState.previousAppStates.length > 0 && nextState.previousAppStates[ nextState.previousAppStates.length - 1 ] === 'background' && nextState.appState === 'active' ) {
                    this.props.dispatch( ( dispatch ) => {
                        dispatch( {
                            'type': userActionTypes.APP_ACTIVE
                        } );
                    } );

                    if ( nextState.language !== this.state.language ) {
                        this.props.dispatch( NavigationActions.reset( {
                            index: 0,
                            actions: [
                                NavigationActions.navigate( { routeName: 'mainPage' } ),
                            ]
                        } ) );
                    }
                }
            }

            return true;
        },

        componentWillReceiveProps: function ( nextProps ) {
            if ( nextProps.language !== this.props.language ) {
                this.props.dispatch( ( dispatch ) => {
                    // const provider = getProvider();
                    //
                    // const store = getStore;
                    //
                    // const language = store.getState().settingStore.language;
                    //
                    // console.log( 'current language: ' + language );

                } );
                this.props.dispatch( metaGetCategory( -1, ( err, resBody ) => {

                } ) );
                this.props.dispatch( metaGetAllAreas( null ) );

                if ( nextProps.isLoggedIn ) {
                    this.props.dispatch( voucherClubReloadListProduct( null ) );
                }
            }
        },


        configNotification: function () {
            this.checkPermissions( ( { alert, badge, sound } ) => {
                console.log( 'notification checkPermissions: ' + 'alert = ' + alert + '; badge = ' + badge + '; sound = ' + sound );
                PushNotification.configure( {

                    // (optional) Called when Token is generated (iOS and Android)
                    onRegister: ( token ) => {
                        this.setState( {
                            pushToken: token.token
                        } );
                    },

                    // (required) Called when a remote or local notification is opened or received
                    onNotification: ( notification ) => {
                        if ( !notification.userInteraction && this.state.appState === 'active' ) {
                            Toast.show( notification.message, {
                                duration: Toast.durations.SHORT,
                                position: Toast.positions.BOTTOM,
                                shadow: true,
                                animation: true,
                                hideOnPress: true,
                                delay: 0,
                            } );
                        }
                    },

                    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
                    senderID: FDConfig.getGCMSenderID(),

                    // IOS ONLY (optional): default: all - Permissions to register.
                    permissions: {
                        alert: true,
                        badge: true,
                        sound: true
                    },

                    // Should the initial notification be popped automatically
                    // default: true
                    popInitialNotification: true,

                    /**
                     * (optional) default: true
                     * - Specified if permissions (ios) and token (android and ios) will requested or not,
                     * - if not, you must call PushNotificationsHandler.requestPermissions() later
                     */
                    requestPermissions: true,
                } );
            } );
        },

        checkPermissions: function ( callback ) {
            if ( Platform.OS === 'ios' ) {
                PushNotification.checkPermissions( ( { alert, badge, sound } ) => {
                    callback && callback( { alert: alert, badge: badge, sound: sound } );
                } );
            } else {
                callback && callback( { alert: true, badge: true, sound: true } );
            }
        }
        ,


        onMemberChangeLanguage( pushId, language )
        {
            if ( this.props.isLoggedIn ) {
                this.props.dispatch( memberChangeLanguage( pushId, language, ( error, resBody ) => {
                    if ( error ) {
                        console.log( 'memberChangeLanguage error: ' + error.message );
                    }
                } ) );
            }
        }
        ,

        render: function () {
            return (
                <View style={styles.container}>
                    <AppWithNavigationState/>
                </View>
            )
        }
    } )
;


function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        pushToken: store.userStore.pushToken,
        language: store.settingStore.language,
        deviceCountry: store.settingStore.deviceCountry,
        nav: store.nav
    };
}

export default connect( select )( FDMallApp );
