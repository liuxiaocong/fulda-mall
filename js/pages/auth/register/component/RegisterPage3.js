import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import Picker from "react-native-picker";
import constStyles from "../../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import TouchableItemComponent from "../../../../components/TouchableItemComponent";
import { memberCompleteSignUp2 } from "../../../../actions/MemberAction";
import ModalBox from "react-native-modalbox";
import I18n from "../../../../I18n";
import Spinner from "react-native-spinkit";
import Keys from "../../../../configs/Keys";
import currencyTypes from "../../../../../data/currencyType";


class RegisterPage3 extends React.Component {
    static propTypes = {
        onComplete: React.PropTypes.func.isRequired,
        isFinish: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );
        this.state = {
            password1: '',
            password2: '',
            currency: currencyTypes[ 0 ],
            error: '',
            isRequesting: false,
            isFinish: this.props.isFinish
        };
    }

    onComplete() {
        console.log( "currencyTypes = " + currencyTypes );
        this.setState( {
            isFinish: true
        } );

        this
            .props
            .onComplete( {} );
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    onNext() {
        this._PSWDTextInput1.blur();
        this._PSWDTextInput2.blur();

        if ( this.state.password1.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_input_password ) } );
            return;
        }

        if ( this.state.password1 !== this.state.password2 ) {
            this.setState( { error: I18n.t( Keys.password_not_the_same ) } );
            return;
        }

        this.setState( {
            isRequesting: true,
            error: ''
        } );

        this.props.dispatch( memberCompleteSignUp2( this.props.user.mobile, this.state.password1, this.state.currency.code, ( err ) => {
            this.setState( {
                isRequesting: false,
                error: err !== null ? err.message : ''
            } );

            if ( err === null ) {
                this.onComplete();
            }
        } ) );
    }

    static getCurrencyDescription( currency ) {
        return currency.name + ' ' + currency.symbol;
    }

    handleCurrencySelect() {
        let dataArray = [];
        for ( let i = 0; i < currencyTypes.length; i++ ) {
            dataArray.push( RegisterPage3.getCurrencyDescription( currencyTypes[ i ] ) );
        }

        Picker.init( {
            pickerCancelBtnText: I18n.t( Keys.cancel ),
            pickerConfirmBtnText: I18n.t( Keys.confirm ),
            pickerTitleText: I18n.t( Keys.plz_select ),
            pickerData: dataArray,
            selectedValue: [ RegisterPage3.getCurrencyDescription( this.state.currency ) ],
            onPickerConfirm: data => {
                console.log( data );

                this.setState( {
                    currency: currencyTypes[ dataArray.indexOf( data[ 0 ] ) ]
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
        if ( this.state.isFinish ) {
            return <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}/>;
        }

        return (
            <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}>

                <View style={[ commonStyles.inputTextGroupStyle ]}>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        <TextInput
                            ref={( PSWDTextInput1 ) => {
                                this._PSWDTextInput1 = PSWDTextInput1;
                            }}
                            style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                            placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                            placeholder={I18n.t( Keys.password )}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={( text ) => {
                                this.state.password1 = text;
                                this.setState( {
                                    error: ''
                                } );
                            }}
                            defaultValue={this.state.password1}
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._PSWDTextInput2.focus();
                            }}
                        />
                    </View>

                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        <TextInput
                            ref={( PSWDTextInput2 ) => {
                                this._PSWDTextInput2 = PSWDTextInput2;
                            }}
                            style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                            placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                            placeholder={I18n.t( Keys.confirm_password )}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={( text ) => {
                                this.state.password2 = text;
                                this.setState( {
                                    error: ''
                                } );
                            }}
                            defaultValue={this.state.password2}
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this.handleCurrencySelect();
                            }}
                        />
                    </View>
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
                            title={I18n.t( Keys.currency_title )}
                            content={RegisterPage3.getCurrencyDescription( this.state.currency )}
                            titleFontSize={16}
                            onPress={() => {
                                this.handleCurrencySelect();
                            }}
                            headerInterval={false}
                            footerInterval={false}/>

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
                            marginLeft: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this.onNext.bind( this )} title="">
                    {I18n.t( Keys.complete )}
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
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status }
}

export default connect( select )( RegisterPage3 );
