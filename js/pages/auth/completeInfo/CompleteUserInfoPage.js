import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import Picker from "react-native-picker";
import { NavigationActions } from "react-navigation";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { connect } from "react-redux";
import currencyTypes from "../../../../data/currencyType";
import * as UtilConfig from "../../../configs/UtilConfig";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import { completeUserInfo } from "../../../actions/MemberAction";


class CompleteUserInfoPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: params.title,
        };
    };


    constructor( props ) {
        super( props );

        let currency = currencyTypes[ 0 ];

        for ( let index = 0; index < currencyTypes.length; index++ ) {
            if ( props.user.currency === currencyTypes[ index ].code ) {
                currency = currencyTypes[ index ];
                break;
            }
        }

        this.state = {
            name: props.user.name,
            idNo: props.user.idNo,
            currency: currency,
            password: props.account && props.account.password,
            error: '',
            isRequesting: false,
        };
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    static isNeedSetName( user ) {
        return !user || !user.name || user.name.length <= 0;
    }

    static isNeedSetIdNO( user ) {
        return !user || !user.idNo || user.idNo.length <= 0;
    }

    static  isNeedSetCurrency( user ) {
        return !user || !user.currency || user.currency.length <= 0;
    }

    static  isNeedSetPassword( account, facebookToken ) {
        if ( facebookToken && facebookToken.length > 0 ) {
            return false;
        }

        return !account || !account.password || account.password.length <= 0;
    }

    onComplete() {
        for ( let index = 0; index < this._renderData.length; index++ ) {
            this._renderData[ index ].onBlur();
        }

        if ( !this.state.name || this.state.name.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_name )
            } );
            return;
        }

        if ( !this.state.idNo || this.state.idNo.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_id_number )
            } );
            return;
        }

        if ( !this.state.password ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_password )
            } );
            return;
        }

        const queryData = {};

        if ( CompleteUserInfoPage.isNeedSetName( this.props.user ) ) {
            queryData[ 'name' ] = this.state.name;
        }

        if ( CompleteUserInfoPage.isNeedSetIdNO( this.props.user ) ) {
            queryData[ 'idNo' ] = this.state.idNo;
        }

        if ( CompleteUserInfoPage.isNeedSetCurrency( this.props.user ) ) {
            queryData[ 'currency' ] = this.state.currency.code;
        }

        if ( CompleteUserInfoPage.isNeedSetPassword( this.props.account, this.props.facebookToken ) ) {
            queryData[ 'password' ] = this.state.password;
        }

        this.setState( {
            error: '',
            isRequesting: true
        } );
        this.props.dispatch( completeUserInfo( queryData, ( err, resBody ) => {
            this.setState( {
                error: err ? err.message : '',
                isRequesting: false
            } );

            if ( !err ) {
                this.props.navigation.dispatch( NavigationActions.reset(
                    {
                        index: 0,
                        actions: [
                            NavigationActions.navigate( { routeName: 'mainPage' } ),
                        ]
                    }
                ) );
            }
        } ) );
    }


    renderUserNameInput( hasNext, onSubmitEditing ) {
        return {
            content: (
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( nameTextInput ) => {
                            this._nameTextInput = nameTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.name )}
                        autoCapitalize={'none'}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        onChangeText={( text ) => {
                            this.setState( {
                                name: text,
                                error: ''
                            } );
                        }}
                        defaultValue={this.state.name}
                        returnKeyType={hasNext ? 'next' : 'done'}
                        returnKeyLabel={hasNext ? I18n.t( Keys.next ) : I18n.t( Keys.done )}
                        onSubmitEditing={() => {
                            if ( onSubmitEditing ) {
                                onSubmitEditing()
                            }
                        }}
                    />
                </View>
            ),
            onFocus: () => {
                this._nameTextInput.focus();
            },
            onBlur: () => {
                this._nameTextInput.blur();
            }
        };
    }

    renderUserIdNoInput( hasNext, onSubmitEditing ) {
        return {
            content: (
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( idTextInput ) => {
                            this._idTextInput = idTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.id_number )}
                        autoCapitalize={'none'}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        maxLength={UtilConfig.MAX_LENGTH.USER_ID_NO}
                        onChangeText={( text ) => {
                            this.setState( {
                                idNo: text,
                                error: ''
                            } );
                        }}
                        defaultValue={this.state.idNo}
                        returnKeyType={hasNext ? 'next' : 'done'}
                        returnKeyLabel={hasNext ? I18n.t( Keys.next ) : I18n.t( Keys.done )}
                        onSubmitEditing={() => {
                            if ( onSubmitEditing ) {
                                onSubmitEditing()
                            }
                        }}
                    />
                </View>
            ),
            onFocus: () => {
                this._idTextInput.focus();
            },
            onBlur: () => {
                this._idTextInput.blur();
            }
        };
    }

    renderPSWDInput( hasNext, onSubmitEditing ) {
        return {
            content: (
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( idTextInput ) => {
                            this._passwordTextInput = idTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.password )}
                        autoCapitalize={'none'}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={( text ) => {
                            this.setState( {
                                password: text,
                                error: ''
                            } );
                        }}
                        defaultValue={this.state.password}
                        returnKeyType={hasNext ? 'next' : 'done'}
                        returnKeyLabel={hasNext ? I18n.t( Keys.next ) : I18n.t( Keys.done )}
                        onSubmitEditing={() => {
                            if ( onSubmitEditing ) {
                                onSubmitEditing()
                            }
                        }}
                    />
                </View>
            ),
            onFocus: () => {
                this._passwordTextInput.focus();
            },
            onBlur: () => {
                this._passwordTextInput.blur();
            }
        };
    }

    static getCurrencyDescription( currency ) {
        return currency.name + ' ' + currency.symbol;
    }

    handleCurrencySelect( onSubmitEditing ) {
        let dataArray = [];
        for ( let i = 0; i < currencyTypes.length; i++ ) {
            dataArray.push( CompleteUserInfoPage.getCurrencyDescription( currencyTypes[ i ] ) );
        }

        Picker.init( {
            pickerCancelBtnText: I18n.t( Keys.cancel ),
            pickerConfirmBtnText: I18n.t( Keys.confirm ),
            pickerTitleText: I18n.t( Keys.plz_select ),
            pickerData: dataArray,
            selectedValue: [ CompleteUserInfoPage.getCurrencyDescription( this.state.currency ) ],
            onPickerConfirm: data => {
                console.log( data );

                this.setState( {
                    currency: currencyTypes[ dataArray.indexOf( data[ 0 ] ) ],
                    error: ''
                } );

                if ( onSubmitEditing ) {
                    onSubmitEditing();
                }
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


    renderCurrency( hasNext, onSubmitEditing ) {
        return {
            content: (
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
                        content={CompleteUserInfoPage.getCurrencyDescription( this.state.currency )}
                        titleFontSize={16}
                        onPress={() => {
                            this.setState( {
                                error: ''
                            } );

                            this.handleCurrencySelect( onSubmitEditing );
                        }}
                        headerInterval={false}
                        footerInterval={false}/>

                </View>
            ),
            onFocus: () => {
                this.handleCurrencySelect( onSubmitEditing );
            },
            onBlur: () => {
                Picker.hide();
            }
        };
    }

    renderItem( type, hasNext, onSubmitEditing ) {
        switch ( type ) {
            case 'setName':
                return this.renderUserNameInput( hasNext, onSubmitEditing );
            case 'setIdNo':
                return this.renderUserIdNoInput( hasNext, onSubmitEditing );
            case 'setCurrency':
                return this.renderCurrency( hasNext, onSubmitEditing );
            case 'setPassword':
                return this.renderPSWDInput( hasNext, onSubmitEditing );
        }
    }

    calcRenderData() {
        const types = [];

        if ( CompleteUserInfoPage.isNeedSetName( this.props.user ) ) {
            types.push( 'setName' );
        }

        if ( CompleteUserInfoPage.isNeedSetIdNO( this.props.user ) ) {
            types.push( 'setIdNo' );
        }

        if ( CompleteUserInfoPage.isNeedSetCurrency( this.props.user ) ) {
            types.push( 'setCurrency' );
        }

        if ( CompleteUserInfoPage.isNeedSetPassword( this.props.account, this.props.facebookToken ) ) {
            types.push( 'setPassword' );
        }

        const renderData = [];

        let nextItem = null;
        for ( let index = types.length - 1; index >= 0; index-- ) {
            nextItem = this.renderItem( types[ index ], index !== types.length - 1, nextItem ? nextItem.onFocus : this.onComplete );

            renderData.push( nextItem );
        }

        return renderData.reverse();
    }

    render() {
        this._renderData = this.calcRenderData();

        const showContent = [];

        for ( let index = 0; index < this._renderData.length; index++ ) {
            showContent.push( this._renderData[ index ].content );
            if ( index < this._renderData.length - 1 ) {
                showContent.push( (<View style={[ commonStyles.commonIntervalStyle ]}/>) );
            }
        }

        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.inputTextGroupStyle ]}>
                    {showContent}
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
                    onPress={this
                        .onComplete
                        .bind( this )} title={null}>
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

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        account: store.userStore.account,
        facebookToken: store.userStore.facebookToken
    }
}

export default connect( select )( CompleteUserInfoPage );

