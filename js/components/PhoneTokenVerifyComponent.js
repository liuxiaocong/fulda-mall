import React from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import constStyles from "../styles/constStyles";
import commonStyles from "../styles/commonStyles";
import DeviceInfo from "react-native-device-info";
import Keys from "../configs/Keys";
import I18n from "../I18n";
import TouchableItemComponent from "./TouchableItemComponent";
import countryDataMap from "../../data/countryDataMap";


class PhoneTokenVerifyComponent extends React.Component {
    static propTypes = {
        onGetToken: React.PropTypes.func.isRequired,
        onError: React.PropTypes.func.isRequired,
        onVerifyToken: React.PropTypes.func.isRequired,
    };

    constructor( props ) {
        super( props );

        let userLocaleCountryCode = DeviceInfo.getDeviceCountry();
        let country = null;

        if ( userLocaleCountryCode && userLocaleCountryCode.length > 0 ) {
            country = countryDataMap[ userLocaleCountryCode ];
        }
        if ( !country ) {
            country = countryDataMap[ 'US' ];
        }

        this.state = {
            country: country,
            mobile: '',
            getTokenButtonDisabled: false,
            getTokenButtonDisabledTime: 60,
            token: '',
            error: ''
        };
    }

    componentWillUnmount() {
        this._mobileTextInput.blur();
        this._tokenTextInput.blur();
        this.timer && clearTimeout( this.timer );
    }

    handleGetToken() {
        this._mobileTextInput.blur();
        this._tokenTextInput.blur();

        if ( !this.state.country ) {
            this
                .props
                .onError( I18n.t( Keys.plz_select_country_location ) );

            return;
        }

        if ( !this.state.mobile ) {
            this
                .props
                .onError( I18n.t( Keys.plz_input_mobile ) );
            return;
        }

        this
            .props
            .onError( '' );

        this
            .props
            .onGetToken( this.state.country, this.state.country.CountryISOCode, '' + this.state.country.MobileCode, this.state.mobile, ( isSuccess ) => {
                if ( isSuccess ) {
                    this.setState( {
                        getTokenButtonDisabledTime: 60,
                        getTokenButtonDisabled: true
                    } );

                    this.onGetTokenSuccess();
                }
            } );
    }

    onGetTokenSuccess() {
        this.timer && clearTimeout( this.timer );

        this.timer = setInterval(
            () => {
                this.handlerRefreshTokenTimer();
            },
            1000
        );
    }

    handlerRefreshTokenTimer() {
        if ( this.state.getTokenButtonDisabledTime > 1 ) {
            this.setState( {
                getTokenButtonDisabledTime: (this.state.getTokenButtonDisabledTime - 1),
                getTokenButtonDisabled: true
            } );

            // this.onGetTokenSuccess();
        }
        else {
            this.timer && clearTimeout( this.timer );

            this.setState( { getTokenButtonDisabled: false } );
        }
    }

    tryVerifyToken() {
        this._mobileTextInput.blur();
        this._tokenTextInput.blur();

        if ( !this.state.country ) {
            this
                .props
                .onError( I18n.t( Keys.plz_select_country_location ) );
            return;
        }

        if ( !this.state.mobile ) {
            this
                .props
                .onError( I18n.t( Keys.plz_input_mobile ) );
            return;
        }

        if ( !this.state.token ) {
            this
                .props
                .onError( I18n.t( Keys.plz_input_token ) );
            return;
        }

        this
            .props
            .onVerifyToken( this.state.country, this.state.country.CountryISOCode, '' + this.state.country.MobileCode, this.state.mobile, this.state.token );
    }

    getCountrySelectItem() {
        return (
            <View
                style={[
                    commonStyles.wrapper,
                    commonStyles.justAlignCenter, {
                        flexDirection: 'row'
                    }
                ]}>

                <TouchableItemComponent
                    containerStyle={[ commonStyles.wrapper, {} ]}
                    style={[ {
                        backgroundColor: 'transparent',
                        paddingLeft: 0,
                        paddingRight: 0
                    }
                    ]}

                    title={I18n.t( Keys.country_location )}
                    content={this.state.country.name}
                    titleFontSize={16}
                    onPress={() => {
                        this._mobileTextInput.blur();
                        this._tokenTextInput.blur();

                        this.props.navigation.navigate(
                            'countrySelectPage',
                            {
                                callback: ( value ) => {
                                    this.setState( {
                                        country: value
                                    } );
                                }
                            }
                        );

                    }}
                    headerInterval={false}
                    footerInterval={false}/>

            </View>
        );
    }

    getPhoneInputItem() {
        return (
            <View
                style={[
                    commonStyles.wrapper,
                    commonStyles.justAlignCenter, {
                        flexDirection: 'row'
                    }
                ]}>
                <Text
                    style={[
                        commonStyles.commonTextColorStyle, {
                            flex: 1,
                            fontSize: 16
                        }
                    ]}>
                    {'+' + this.state.country.MobileCode}
                </Text>
                <TextInput
                    ref={( mobileTextInput ) => {
                        this._mobileTextInput = mobileTextInput;
                    }}
                    placeholder={I18n.t( Keys.plz_input_mobile )}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    maxLength={17}
                    style={[
                        {
                            flex: 2
                        },
                        commonStyles.commonTextColorStyle
                    ]}
                    placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                    onChangeText={( text ) => {
                        this.state.mobile = text;

                        this
                            .props
                            .onError( '' );
                    }}
                    defaultValue={this.state.mobile}
                    keyboardType="numeric"
                    returnKeyType={'next'}
                    returnKeyLabel={I18n.t( Keys.next )}
                    onSubmitEditing={() => {
                        this.handleGetToken();
                    }}
                />
            </View>

        );
    }

    getTokenInputView() {
        return (
            <View
                style={[
                    commonStyles.wrapper,
                    commonStyles.justAlignCenter, {
                        flexDirection: 'row'
                    }
                ]}>
                <Text
                    style={[
                        commonStyles.commonTextColorStyle, {
                            flex: 1,
                            fontSize: 16
                        }
                    ]}>
                    {I18n.t( Keys.token )}
                </Text>
                <View
                    style={[
                        {
                            flex: 2,
                            flexDirection: 'row'
                        },
                        commonStyles.justAlignCenter
                    ]}>
                    <TextInput
                        ref={( tokenTextInput ) => {
                            this._tokenTextInput = tokenTextInput;
                        }}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        style={[
                            {
                                flex: 1
                            },
                            commonStyles.commonTextColorStyle
                        ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        keyboardType="numeric"
                        underlineColorAndroid={'transparent'}
                        onChangeText={( text ) => {
                            this.state.token = text;
                            this
                                .props
                                .onError( '' );
                        }}
                        defaultValue={this.state.token}
                        maxLength={4}
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        onSubmitEditing={() => {
                            this.tryVerifyToken();
                        }}
                    />
                    <Button
                        containerStyle={[
                            this.state.getTokenButtonDisabled ? commonStyles.buttonContainerDisabledStyle : commonStyles.buttonContainerStyle, {
                                height: 28,
                                marginLeft: 10
                            }
                        ]}
                        style={[
                            commonStyles.buttonContentStyle, {
                                fontSize: 10
                            }
                        ]}
                        styleDisabled={[ commonStyles.buttonDisabledStyle ]}
                        onPress={() => {
                            this.handleGetToken();
                        }} title={null} disabled={this.state.getTokenButtonDisabled}>
                        {this.state.getTokenButtonDisabled ? (this.state.getTokenButtonDisabledTime + 's') : I18n.t( Keys.get_token )}
                    </Button>
                </View>

            </View>
        );
    }

    render() {
        return (
            <View style={[ commonStyles.inputTextGroupStyle ]}>
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    {this.getCountrySelectItem()}
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    {this.getPhoneInputItem()}
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    {this.getTokenInputView()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

export default PhoneTokenVerifyComponent;
