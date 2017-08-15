import React from "react";
import {
    Alert,
    BackHandler,
    Dimensions,
    Modal,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import constStyles from "../../../../styles/constStyles";
import commonStyles from "../../../../styles/commonStyles";
import { connect } from "react-redux";
import Util from "../../../../util/Util";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


class InputPayPasswordComponent extends React.Component {
    static propTypes = {
        onClose: React.PropTypes.func.isRequired,
        onPay: React.PropTypes.func.isRequired,
        onPayByThirdWay: React.PropTypes.func,
        isOpen: React.PropTypes.bool,
        needAmount: React.PropTypes.number,
        customButtons: React.PropTypes.array,
    };

    constructor( props ) {
        super( props );

        this.state = {
            isOpen: this.props.isOpen,
            error: '',
            password: '',
            data: [],
            customButtons: this.props.customButtons
        }
    }

    componentWillMount() {
        BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    _onBack() {
        if ( this.state.isOpen ) {
            if ( this.props.onClose ) {
                this.props.onClose();
            }

            return true;
        }
        return false;
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.isOpen && !this.setState.isOpen ) {
            if ( !nextProps.user.payPassSet ) {
                if ( this.props.onClose ) {
                    this.props.onClose();
                }

                //noinspection JSCheckFunctionSignatures
                Alert.alert(
                    I18n.t( Keys.you_need_to_set_paid_password_first ),
                    "",
                    [
                        { text: I18n.t( Keys.cancel ), onPress: () => console.log( 'cancel' ), style: 'cancel' },
                        {
                            text: I18n.t( Keys.setting ), onPress: () => {
                            if ( this.props.navigation ) {
                                this.props.navigation.navigate( 'setPayPSWDPage', {
                                    isFromSetting: true
                                } );
                            }
                        },
                            style: 'submit'
                        },
                    ],
                    { cancelable: true }
                );
            } else {
                this.setState(
                    {
                        isOpen: nextProps.isOpen,
                        error: '',
                        password: '',
                        data: []
                    }
                );
            }
        }

    }

    closeModal() {
        this.props.onClose();
        this.setState(
            {
                isOpen: false,
            }
        );
    }

    static renderPasswordChar( index, hasChar, hasInterval ) {
        return (
            <View style={[ commonStyles.wrapper, { flexDirection: 'row' } ]}
                  key={"renderPasswordChar" + index}
            >
                <View style={[ commonStyles.wrapper, commonStyles.justAlignCenter, { height: 48 } ]}>
                    {
                        hasChar ?
                            <Icon
                                name={'md-close'}
                                size={21}
                                color={'#000000'}/>
                            : null
                    }
                </View>

                {
                    hasInterval ?
                        <View
                            style={[ commonStyles.commonIntervalStyle, { width: 1, height: 48 } ]}/>
                        :
                        null
                }
            </View>
        );
    }

    render() {
        let customAction = false;
        if ( this.state.customButtons && this.state.customButtons.length > 0 ) {
            customAction = true;
        }
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isOpen}
                onRequestClose={() => {
                    this.props.onClose();
                }}
            >
                <TouchableOpacity style={[ {
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }, commonStyles.justAlignCenter ]}
                                  onPress={() => {
                                      this.props.onClose();
                                  }}
                >


                    <TouchableWithoutFeedback
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                        }}>

                        <View style={[ {
                            width: Dimensions.get( "window" ).width - 20,
                            backgroundColor: 'white',
                            borderRadius: 5,
                        } ]}>
                            <View style={[ {
                                paddingLeft: 32,
                                paddingRight: 32,
                                paddingTop: 20,
                                paddingBottom: 20,
                            } ]}>
                                <Text style={[ commonStyles.commonTextColorStyle, {
                                    fontSize: 16,
                                    textAlign: 'center'
                                } ]}>
                                    {I18n.t( Keys.plz_input_paid_password )}
                                </Text>
                                <Text style={[ {
                                    color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR,
                                    fontSize: 11,
                                    marginTop: 9,
                                    textAlign: 'center'
                                } ]}>
                                    {I18n.t( Keys.your_balance ) + ": "}
                                    <Text style={[ {
                                        color: constStyles.THEME_COLOR,
                                        fontSize: 11,
                                    } ]}>
                                        {
                                            (this.props.user && this.props.balance ) ?
                                                Util.getShowPrice( this.props.user.currency, this.props.balance.memberMoney )
                                                :
                                                ''
                                        }
                                    </Text>
                                    {
                                        this.props.needAmount !== null && this.props.needAmount !== undefined && this.props.needAmount > this.props.balance.memberMoney ?
                                            <Text style={[ {
                                                color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR,
                                                fontSize: 11,
                                            } ]}>
                                                {I18n.t( Keys.not_enough_balance )}
                                            </Text>
                                            :
                                            null
                                    }
                                </Text>


                                <View style={[ { height: 48, marginTop: 20 } ]}>
                                    <TextInput
                                        style={[ commonStyles.wrapper ]}
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        keyboardType="numeric"
                                        underlineColorAndroid={'transparent'}
                                        maxLength={6}
                                        autoFocus={true}
                                        onChangeText={( text ) => {
                                            const data = [];

                                            if ( text ) {
                                                for ( let index = 0; index < text.length; index++ ) {
                                                    data.push( '' + text[ index ] );
                                                }
                                            }

                                            this.setState( {
                                                error: '',
                                                password: text,
                                                data: data
                                            } );
                                        }}
                                    />

                                    <TouchableWithoutFeedback>
                                        <View style={[ commonStyles.wrapper, {
                                            backgroundColor: '#f1f6f8',
                                            borderWidth: 1,
                                            borderColor: constStyles.DIVIDER_COLOR,
                                            height: 48,
                                            left: 0, right: 0, top: 0, bottom: 0,
                                            flexDirection: 'row',
                                            position: 'absolute',
                                        } ]}>
                                            {InputPayPasswordComponent.renderPasswordChar( 0, this.state.data.length >= 1, true )}
                                            {InputPayPasswordComponent.renderPasswordChar( 1, this.state.data.length >= 2, true )}
                                            {InputPayPasswordComponent.renderPasswordChar( 2, this.state.data.length >= 3, true )}
                                            {InputPayPasswordComponent.renderPasswordChar( 3, this.state.data.length >= 4, true )}
                                            {InputPayPasswordComponent.renderPasswordChar( 4, this.state.data.length >= 5, true )}
                                            {InputPayPasswordComponent.renderPasswordChar( 5, this.state.data.length >= 6, false )}

                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                                <Text
                                    style={[
                                        commonStyles.errorTipStyle, {
                                            marginTop: 10
                                        }
                                    ]}>
                                    {this.state.error}
                                </Text>

                            </View>

                            <View style={[ commonStyles.commonIntervalStyle ]}/>

                            <View style={[ { height: 48, flexDirection: 'row' } ]}>
                                {
                                    this.props.needAmount === null || this.props.needAmount === undefined || this.props.needAmount <= this.props.balance.memberMoney ?

                                        <TouchableHighlight
                                            underlayColor='#ddd'
                                            onPress={() => {
                                                if ( this.state.password.length < 6 ) {
                                                    this.setState( {
                                                        error: I18n.t( Keys.paid_password_width_too_short ),
                                                    } );
                                                } else {
                                                    if ( this.props.onPay ) {
                                                        this.props.onPay( this.state.password );
                                                    }

                                                    this.closeModal();
                                                }
                                            }}
                                            style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                height: 48,
                                                borderBottomLeftRadius: 5,
                                                borderBottomRightRadius: 5,
                                            } ]}>
                                            <View>
                                                <Text>
                                                    {I18n.t( Keys.confirm )}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                        :
                                        <TouchableHighlight
                                            underlayColor='#ddd'
                                            onPress={() => {
                                                if ( this.state.password.length < 6 ) {
                                                    this.setState( {
                                                        error: I18n.t( Keys.paid_password_width_too_short )
                                                    } );
                                                } else {
                                                    if ( this.props.onPayByThirdWay ) {
                                                        this.props.onPayByThirdWay( this.state.password );
                                                    }

                                                    this.closeModal();
                                                }
                                            }}
                                            style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                height: 48,
                                                borderBottomLeftRadius: 5,
                                                borderBottomRightRadius: 5,
                                            } ]}>
                                            <View>
                                                <Text>
                                                    {I18n.t( Keys.use_third_party_paid )}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                }
                                {customAction &&
                                this.state.customButtons.map( ( customButton ) => {
                                    let fun = customButton.action;
                                    let title = customButton.title;
                                    return (
                                        <TouchableHighlight
                                            key={'customButtons key = ' + title}
                                            underlayColor='#ddd'
                                            onPress={() => {
                                                if ( fun ) {
                                                    fun( this.state.password );
                                                }
                                                this.closeModal();
                                            }}
                                            style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                                height: 48,
                                                borderBottomLeftRadius: 5,
                                                borderBottomRightRadius: 5,
                                                borderLeftWidth: Util.getDpFromPx( 1 ),
                                                borderLeftColor: '#e7e7e7',
                                            } ]}>
                                            <View>
                                                <Text>
                                                    {title}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>

                                    )
                                } )
                                }
                            </View>
                        </View>

                    </TouchableWithoutFeedback>

                </TouchableOpacity>


            </Modal>

        );
    }
}

function select( store ) {
    return {
        user: store.userStore.user,
        balance: store.walletStore.balance,
    }
}

export default  connect( select )( InputPayPasswordComponent );
