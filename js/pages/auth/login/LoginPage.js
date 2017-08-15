import React from "react";
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import userActionTypes from "../../../reducers/user/userActionTypes";
import I18n from "../../../I18n";
import { connect } from "react-redux";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { authFacebook, authLogIn } from "../../../actions/AuthAction";
import commonStyles from "../../../styles/commonStyles";
import FBSDK from "react-native-fbsdk";
import { isNeedAdditionalInformation } from "../../../actions/MemberAction";
import Keys from "../../../configs/Keys";


const { LoginManager, AccessToken } = FBSDK;


class LoginPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.login ),
            headerRight: (
                state.params && state.params.isOpenDebugMode ?
                    <Button
                        style={commonStyles.top_info_right_btn}
                        title=''
                        onPress={() => {
                            state.params.onTapLoginHisTory()
                        }}
                    >
                        Login history
                    </Button>
                    :
                    null
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            username: '',
            password: '',
            error: '',
            isRequesting: false,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.props.navigation.setParams( {
            isOpenDebugMode: this.props.isOpenDebugMode,
            onTapLoginHisTory: this.onTapLoginHisTory.bind( this )
        } );
    }

    componentWillUnmount() {
    }

    onTapLoginHisTory() {
        this._accountTextInput.blur();
        this._passwordTextInput.blur();

        this.props.navigation.navigate(
            'debugLoginHistoryPage',
            {
                callback: ( item ) => {
                    this.setState( {
                        username: item.account,
                        password: item.password,
                    } );
                }
            }
        );
    };

    handleLogin() {
        this._accountTextInput.blur();
        this._passwordTextInput.blur();

        if ( !this.state.username || this.state.username.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_input_mobile_or_email ) } );
            return;
        }

        if ( !this.state.password || this.state.password.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_input_password ) } );
            return;
        }

        this.setState( {
            isRequesting: true,
            error: ''
        } );

        this
            .props
            .dispatch( authLogIn( this.state.username, this.state.password, ( err, resBody ) => {
                this.setState( {
                    isRequesting: false,
                    error: err !== null ? err.message : ''
                } );
                if ( !err ) {
                    if ( isNeedAdditionalInformation( this.props.user ) ) {
                        this.props.navigation.navigate( 'completeUserInfoPage', {
                            title: I18n.t( Keys.complete_user_info )
                        } );
                    } else {
                        this.props.navigation.goBack();
                    }
                }
            } ) );
    }

    handleFacebookLogin() {
        // this.props.navigation.navigate( 'bindSelectPage' );

        this._accountTextInput.blur();
        this._passwordTextInput.blur();

        this
            .props
            .dispatch(
                ( dispatch ) => {
                    dispatch( { 'type': userActionTypes.LOGOUT_SUCCESS } );
                }
            );

        LoginManager
            .logInWithReadPermissions( [ 'public_profile', 'email' ] )
            .then( (( result ) => {
                if ( !result.isCancelled ) {
                    this.setState( {
                        isRequesting: true
                    } );

                    AccessToken
                        .getCurrentAccessToken()
                        .then( ( data ) => {
                            this
                                .props
                                .dispatch( authFacebook( data.accessToken.toString(), false, ( err, resBody ) => {

                                    this.setState( {
                                        isRequesting: false,
                                        error: err && err.message !== 'account_not_exists' ? err.message : ''
                                    } );

                                    if ( err ) {
                                        if ( err.message === 'account_not_exists' ) {
                                            this.props.navigation.navigate( 'bindSelectPage' );
                                        }
                                    } else {
                                        if ( isNeedAdditionalInformation( this.props.user ) ) {
                                            this.props.navigation.navigate( 'registerPage' );
                                        } else {
                                            this.props.navigation.goBack();
                                        }
                                    }
                                } ) );

                        } )
                }
            }), (( error ) => {
                this.setState( { error: error.message } );
            }) );
    }

    handlerRegister() {
        this._accountTextInput.blur();
        this._passwordTextInput.blur();

        this
            .props
            .dispatch(
                ( dispatch ) => {
                    dispatch( { 'type': userActionTypes.LOGOUT_SUCCESS } );
                }
            );

        this.props.navigation.navigate( 'registerPage' );
    }

    getInputContainer() {
        return (
            <View style={[ commonStyles.inputTextGroupStyle ]}>
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( accountTextInput ) => {
                            this._accountTextInput = accountTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.mobile_email )}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'default'}
                        underlineColorAndroid={'transparent'}
                        onChangeText={( text ) => {
                            this.state.username = text;
                            this.setState( {
                                error: ''
                            } );
                        }}
                        defaultValue={this.state.username}
                        returnKeyType={'next'}
                        returnKeyLabel={I18n.t( Keys.next )}
                        onSubmitEditing={() => {
                            this._passwordTextInput.focus();
                        }}
                    />
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View
                    style={[
                        commonStyles.inputTextGroupItemStyle,
                        commonStyles.justAlignCenter, {
                            flexDirection: 'row'
                        }
                    ]}>
                    <TextInput
                        ref={( passwordTextInput ) => {
                            this._passwordTextInput = passwordTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.password )}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'default'}
                        underlineColorAndroid={'transparent'}
                        secureTextEntry={true}
                        onChangeText={( text ) => {
                            this.state.password = text;

                            this.setState( {
                                error: ''
                            } );
                        }}
                        defaultValue={this.state.password}
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        onSubmitEditing={this
                            .handleLogin
                            .bind( this )}/>
                    <Button
                        style={[
                            {
                                fontSize: 14
                            },
                            commonStyles.commonTextColorStyle
                        ]}
                        onPress={() => {
                            this.props.navigation.navigate( 'findPSWDByPhonePage', { canFindByEmail: true } );
                        }} title="">
                        {I18n.t( Keys.forget_password )}
                    </Button>
                </View>
            </View>
        );
    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <View style={[ commonStyles.wrapper ]}>
                    {this.getInputContainer()}

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
                            .handleLogin
                            .bind( this )} title="">
                        {I18n.t( Keys.login )}
                    </Button>
                    <Button
                        style={[
                            {
                                marginTop: 39,
                                fontSize: 16
                            },
                            commonStyles.commonTextColorStyle
                        ]}
                        onPress={() => {
                            this.handlerRegister();
                        }} title="">
                        {I18n.t( Keys.register )}
                    </Button>
                </View>

                <View style={[ styles.floatView ]}>
                    <Text
                        style={[
                            {
                                flex: 1,
                                textAlign: 'center'
                            }, {
                                fontSize: 11,
                                color: '#b4b8c0'
                            }, {
                                marginBottom: 10
                            }
                        ]}>
                        {I18n.t( Keys.login_by_other_account )}
                    </Text>
                    <View style={[ styles.operation ]}>
                        <TouchableHighlight
                            underlayColor='#ddd'
                            onPress={this
                                .handleFacebookLogin
                                .bind( this )}
                            style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub ]}>
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <Image
                                    style={{
                                        width: 55,
                                        height: 55
                                    }}
                                    source={require( '../../../imgs/ic_login_fb.png' )}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

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

const styles = StyleSheet.create( {
    floatView: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    flexSub: {
        flex: 1,
        height: 100,
        marginRight: 0
    },
    operation: {
        height: 100,
        flexDirection: 'row',
        backgroundColor: '#f1f3f5'
    }
} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        isOpenDebugMode: store.settingStore.isOpenDebugMode,
    }
}
export default  connect( select )( LoginPage );
