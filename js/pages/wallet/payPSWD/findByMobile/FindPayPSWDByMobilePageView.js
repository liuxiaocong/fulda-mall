/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import TimerMixin from "react-timer-mixin";
import { NavigationActions } from "react-navigation";
import * as UtilConfig from "../../../../configs/UtilConfig";
import { memberForgotPassword } from "../../../../actions/MemberAction";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

const styles = StyleSheet.create( {} );
class FindPayPSWDByMobilePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.find_back_pay_password ),
            headerRight: (
                state.params && state.params.canFindByEmail ?
                    <Button
                        style={[
                            {
                                fontSize: 14,
                                color: constStyles.THEME_COLOR,
                                marginRight: 10
                            }
                        ]}
                        title=''
                        onPress={() => {
                            state.params.findByEmail();
                        }}
                    >
                        {I18n.t( Keys.find_back_by_email )}
                    </Button>
                    :
                    null
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            token: "",
            getTokenButtonDisabled: false,
            getTokenButtonDisabledTime: 60,
            error: ''
        };
    }

    componentWillMount() {
        this.props.navigation.setParams( {
            findByEmail: this.findByEmail.bind( this )
        } );
    }

    findByEmail() {
        this.props.navigation.navigate( 'findPayPSWDByEmailPage', {
            canFindByMobile: this.props.user.mobile && this.props.user.mobile.length > 0,
        } );
    }

    componentWillUnmount() {
        TimerMixin.clearInterval( this.tokenCountDown );
    }

    handlerRefreshTokenTimer() {
        if ( this.state.getTokenButtonDisabledTime > 1 ) {
            this.setState( { getTokenButtonDisabledTime: (this.state.getTokenButtonDisabledTime - 1) } );
            this.setState( { getTokenButtonDisabled: true } );
        }
        else {
            if ( this.tokenCountDown ) {
                TimerMixin.clearInterval( this.tokenCountDown );
            }
            this.setState( { getTokenButtonDisabled: false } );
        }
    }

    startCountDownToken() {
        this.tokenCountDown = TimerMixin.setInterval(
            () => {
                this.handlerRefreshTokenTimer();
            }, 1000
        );
    }

    requestToken() {
        this.setState( { isRequesting: true } );
        memberForgotPassword(
            UtilConfig.FORGOT_PASSWORD_BY_MOBILE, ( err, res ) => {

                if ( err ) {
                    this.setState( {
                        isRequesting: false,
                        error: err.message
                    } );
                } else {
                    //do nothing
                    this.setState( {
                        isRequesting: false,
                        error: '',
                        getTokenButtonDisabledTime: 60,
                        getTokenButtonDisabled: true
                    } );

                    this.startCountDownToken();
                }
            }
        );
    }


    handleVerifyToken() {
        if ( !this.state.token || this.state.token.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_token )
            } );
            return;
        }


        this.setState( {
            isRequesting: true,
            error: ''
        } );

        this.props.verifyToken(
            this.state.token, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    this.setState( { error: err.message } );
                } else {
                    this.props.navigation.dispatch(
                        NavigationActions.navigate(
                            {
                                routeName: 'setPayPSWDPage',
                                params: {
                                    isResetAction: true
                                }
                            }
                        )
                    )
                }
            }
        );
    }

    render() {
        let { user } = this.props;
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.inputTextGroupStyle ]}>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        <View
                            style={[
                                commonStyles.wrapper,
                                commonStyles.justAlignCenter, {
                                    flexDirection: 'row',

                                }
                            ]}>
                            <Text
                                style={[
                                    commonStyles.commonTextColorStyle, {
                                        flex: 1,
                                        fontSize: 16
                                    }
                                ]}>
                                {I18n.t( Keys.mobile_number )}
                            </Text>
                            <Text
                                style={[
                                    {
                                        flex: 2
                                    },
                                    commonStyles.commonTextColorStyle
                                ]}>
                                {user.mobile + ""}
                            </Text>
                        </View>
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
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
                                {I18n.t( Keys.verify_code )}
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
                                        this.setState( {
                                            error: ''
                                        } );
                                    }}
                                    defaultValue={this.state.token}
                                    maxLength={4}
                                    returnKeyType={'done'}
                                    returnKeyLabel={I18n.t( Keys.done )}
                                    onSubmitEditing={this
                                        .handleVerifyToken
                                        .bind( this )}
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
                                        this.requestToken();
                                    }}
                                    title={null}
                                    disabled={this.state.getTokenButtonDisabled}>
                                    {this.state.getTokenButtonDisabled ? (this.state.getTokenButtonDisabledTime + 's') : I18n.t( Keys.get_token )}
                                </Button>
                            </View>
                        </View>
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
                    onPress={
                        () =>
                            this.handleVerifyToken()
                    }
                    title={I18n.t( Keys.submit )}>
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

        )
    }
}

export default FindPayPSWDByMobilePageView;
