import React from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import { voucherClubReload, voucherClubReloadListProduct } from "../../../actions/VoucherClubAction";
import Picker from "react-native-picker";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import DeviceInfo from "react-native-device-info";
import constStyles from "../../../styles/constStyles";
import countryDataMap from "../../../../data/countryDataMap";
import AmountInputComponent from "../../../components/AmountInputComponent";


class MobileNoTopUpPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.mobile_phone_recharge ),
        };
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
            voucherClubReloadListProduct: this.props.voucherClubReloadListProduct,
            reloadProduct: MobileNoTopUpPage.calcDefaultReloadProduct( this.props.voucherClubReloadListProduct, country ),
            isSupportReloadProductSelect: MobileNoTopUpPage.isSupportReloadProductSelect( this.props.voucherClubReloadListProduct, country ),
            inputAmountStr: '',
            isRequesting: false,
            error: ''
        };
    }

    componentWillMount() {
        if ( !this.state.voucherClubReloadListProduct || Object.keys( this.state.voucherClubReloadListProduct ).length <= 0 ) {
            this.setState( {
                isRequesting: true,
            } );

            this.props.dispatch( voucherClubReloadListProduct( ( err, resBody ) => {
                this.setState( {
                    isRequesting: false,
                    error: err ? err.message : ''
                } );
            } ) );
        }
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            voucherClubReloadListProduct: nextProps.voucherClubReloadListProduct,
            reloadProduct: MobileNoTopUpPage.calcDefaultReloadProduct( nextProps.voucherClubReloadListProduct, this.state.country ),
            isSupportReloadProductSelect: MobileNoTopUpPage.isSupportReloadProductSelect( nextProps.voucherClubReloadListProduct, this.state.country ),
        } );
    }

    handlerSubmit() {
        this._mobileTextInput.blur();
        this._amountInputComponent.blur();
        Picker.hide();

        if ( !this.state.mobile || this.state.mobile.length < 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_correct_amount ),
            } );
            return;
        }

        if ( this.state.isSupportReloadProductSelect && !this.state.reloadProduct ) {
            this.setState( {
                error: I18n.t( Keys.plz_select_network_carriers ),
            } );
            return;
        }

        const amount = parseFloat( this.state.inputAmountStr );
        if ( isNaN( amount ) || amount <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_correct_amount )
                }
            );
            return;
        }

        this.setState(
            {
                isRequesting: true,
                error: ''
            }
        );

        this.props.dispatch( voucherClubReload( this.state.reloadProduct ? this.state.reloadProduct.key : '', this.state.mobile, this.state.inputAmountStr, ( err, resBody ) => {
            this.setState(
                {
                    isRequesting: false,
                    error: err ? err.message : ''
                }
            );

            if ( !err ) {
                //noinspection JSCheckFunctionSignatures
                Alert.alert(
                    I18n.t( Keys.top_up_success ),
                    "",
                    [
                        {
                            text: I18n.t( Keys.common_ok ),
                            onPress: () => {
                                if ( this.props.navigation ) {
                                    this.props.navigation.goBack();
                                }
                            },
                            style: 'submit'
                        },
                    ],
                    { cancelable: true }
                );
            }
        } ) );
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
                        this._amountInputComponent.blur();
                        Picker.hide();

                        this.props.navigation.navigate(
                            'countrySelectPage',
                            {
                                callback: ( value ) => {
                                    this.setState( {
                                        country: value,
                                        reloadProduct: MobileNoTopUpPage.calcDefaultReloadProduct( this.state.voucherClubReloadListProduct, value ),
                                        isSupportReloadProductSelect: MobileNoTopUpPage.isSupportReloadProductSelect( this.state.voucherClubReloadListProduct, value ),
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

                        this.setState( {
                            error: ''
                        } );
                    }}
                    defaultValue={this.state.mobile}
                    keyboardType="numeric"
                    returnKeyType={'next'}
                    returnKeyLabel={I18n.t( Keys.next )}
                    autoFocus={true}
                    onFocus={() => {
                        Picker.hide();
                    }}
                    onSubmitEditing={() => {
                        if ( this.state.isSupportReloadProductSelect ) {
                            this.handleReloadProductSelect();
                        } else {
                            this._amountInputComponent.focus();
                        }
                    }}
                />
            </View>

        );
    }

    static isSupportReloadProductSelect( voucherClubReloadListProduct, country ) {
        const data = voucherClubReloadListProduct[ country.CountryISOCode ];

        return data && data.length > 0;
    }

    static calcDefaultReloadProduct( voucherClubReloadListProduct, country ) {
        const data = voucherClubReloadListProduct[ country.CountryISOCode ];

        return data && data.length > 0 ? data[ 0 ] : null;
    }

    handleReloadProductSelect() {
        this._mobileTextInput.blur();
        this._amountInputComponent.blur();

        let dataArray = [];

        const reloadProductList = this.state.voucherClubReloadListProduct[ this.state.country.CountryISOCode ];
        if ( reloadProductList ) {
            for ( let i = 0; i < reloadProductList.length; i++ ) {
                dataArray.push( reloadProductList[ i ].value );
            }
        }

        Picker.init( {
            pickerCancelBtnText: I18n.t( Keys.cancel ),
            pickerConfirmBtnText: I18n.t( Keys.confirm ),
            pickerTitleText: I18n.t( Keys.plz_select ),
            pickerData: dataArray,
            selectedValue: this.state.reloadProduct ? [ this.state.reloadProduct.value ] : [],
            onPickerConfirm: data => {
                console.log( data );

                this.setState( {
                    reloadProduct: reloadProductList[ dataArray.indexOf( data[ 0 ] ) ]
                } );
            },
            onPickerCancel: data => {
                console.log( data );
            },
            onPickerSelect: data => {
                console.log( data );
            }
        } );
        Picker.show();
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon,
                    {
                        backgroundColor: 'white',
                        paddingTop: 20
                    }
                ]}>

                <View style={[ commonStyles.inputTextGroupStyle ]}>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        {this.getCountrySelectItem()}
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        {this.getPhoneInputItem()}
                    </View>

                    {
                        this.state.isSupportReloadProductSelect ?
                            <View>
                                <View style={[ commonStyles.commonIntervalStyle ]}/>
                                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                                    <TouchableItemComponent
                                        containerStyle={[ {} ]}
                                        style={[ {
                                            backgroundColor: 'transparent',
                                            paddingLeft: 0,
                                            paddingRight: 0
                                        }
                                        ]}
                                        title={I18n.t( Keys.network_carriers )}
                                        content={this.state.reloadProduct ? this.state.reloadProduct.value : '' }
                                        titleFontSize={16}
                                        onPress={() => {
                                            this.handleReloadProductSelect();
                                        }}
                                        headerInterval={false}
                                        footerInterval={false}/>

                                </View>
                            </View>
                            :
                            null
                    }

                    <View style={[ commonStyles.commonIntervalStyle ]}/>

                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                            },
                            commonStyles.inputTextGroupItemStyle
                        ]}>
                        <Text style={[ { fontSize: 16 }, commonStyles.commonTextColorStyle ]}>
                            {I18n.t( Keys.money )}
                        </Text>
                        <AmountInputComponent
                            ref={( amountInputComponent ) => {
                                this._amountInputComponent = amountInputComponent;
                            }}
                            style={[ {
                                height: 46,
                                flex: 1,
                                borderWidth: 0
                            } ]}
                            amountStr={this.state.inputAmountStr}
                            currency={this.props.user.currency}
                            onAmountChange={( amountStr ) => {
                                this.setState( {
                                    inputAmountStr: amountStr,
                                    error: ''
                                } );
                            }}
                            autoFocus={false}
                            onFocus={() => {
                                Picker.hide();
                            }}
                            returnKeyType={'done'}
                            returnKeyLabel={I18n.t( Keys.done )}
                            onSubmitEditing={() => {
                                this.handlerSubmit();
                            }}
                        />
                    </View>
                </View>

                <Text
                    style={[
                        commonStyles.errorTipStyle
                    ]}>
                    {this.state.error}
                </Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this.handlerSubmit.bind( this )} title="">
                    {I18n.t( Keys.submit )}
                </Button>

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>

            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        user: store.userStore.user,
        voucherClubReloadListProduct: store.metaStore.voucherClubReloadListProduct,
    }
}

export default connect( select )( MobileNoTopUpPage );
