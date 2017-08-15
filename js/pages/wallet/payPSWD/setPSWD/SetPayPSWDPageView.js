import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import constStyles from "../../../../styles/constStyles";
const styles = StyleSheet.create(
    {
        input_area: {
            flexDirection: 'row',
            height: 48,
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15
        },
        input_txt: {
            flexGrow: 1,
            marginLeft: 15,
            // textAlign:'center'
        }
    }
);
class SetPayPSWDPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.paid_password ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    {I18n.t( Keys.save )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );
        let isResetAction = false;
        if ( props.navigation.state && props.navigation.state.params && props.navigation.state.params.isResetAction ) {
            isResetAction = props.navigation.state.params.isResetAction;
        }
        this.state = {
            isRequesting: false,
            error: '',
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            isResetAction: isResetAction,
        };
    }

    componentWillMount() {
        if ( this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.isFromSetting ) {
            this.props.navigation.state.key = "backToSettingAction";
        }
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    onTapSave() {
        this._currentPSWDTextInput.blur();
        this._newPSWDTextInput.blur();
        this._newPSWDConfirmTextInput.blur();

        const isNeedOldPass = this.props.user.payPassSet && !this.state.isResetAction;

        if ( isNeedOldPass && ( !this.state.currentPassword || this.state.currentPassword.length <= 0 ) ) {
            this.setState( { error: I18n.t( Keys.plz_input_current_password ) } );
            return;
        }

        if ( !this.state.newPassword || this.state.newPassword.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_input_new_password ) } );
            return;
        }

        if ( this.state.newPassword !== this.state.newPasswordConfirm ) {
            this.setState( { error: I18n.t( Keys.two_time_password_must_be_the_same ) } );
            return;
        }
        this.setState( { isRequesting: true, error: '' } );
        this.props.onTapSave(
            this.state.currentPassword, this.state.newPassword, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    this.setState( { error: err } );
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        )
    };

    componentWillUnmount() {
    }

    render() {
        const isNeedOldPass = this.props.user.payPassSet && !this.state.isResetAction;

        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>
                <View style={{
                    borderRadius: 5,
                    backgroundColor: '#f1f6f8',
                    borderWidth: 1,
                    borderColor: '#e7e7e7',
                }}>
                    <View style={[ commonStyles.commonBorderBottom, styles.input_area ]}>
                        <Text
                            style={
                                {
                                    minWidth: 100
                                }
                            }>{I18n.t( Keys.current_password )}</Text>
                        <TextInput
                            ref={( currentPSWDTextInput ) => {
                                this._currentPSWDTextInput = currentPSWDTextInput;
                            }}
                            secureTextEntry={true}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            editable={isNeedOldPass}
                            placeholder={isNeedOldPass ? "" : "******"}
                            keyboardType="numeric"
                            maxLength={6}
                            onChangeText={
                                ( text ) => {
                                    this.state.currentPassword = text;
                                    this.setState( { error: '' } );
                                }
                            }
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._newPSWDTextInput.focus();
                            }}
                        />
                    </View>
                    <View style={[ commonStyles.commonBorderBottom, styles.input_area ]}>
                        <Text
                            style={
                                {
                                    minWidth: 100,
                                }
                            }
                        >{I18n.t( Keys.new_password )}</Text>
                        <TextInput
                            ref={( newPSWDTextInput ) => {
                                this._newPSWDTextInput = newPSWDTextInput;
                            }}
                            secureTextEntry={true}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
                            keyboardType="numeric"
                            maxLength={6}
                            onChangeText={
                                ( text ) => {
                                    this.state.newPassword = text;
                                    this.setState( { error: '' } );
                                }
                            }
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._newPSWDConfirmTextInput.focus();
                            }}
                        />
                    </View>
                    <View style={[ styles.input_area ]}>
                        <Text
                            style={
                                {
                                    minWidth: 100
                                }
                            }>{I18n.t( Keys.confirm_password )}</Text>
                        <TextInput
                            ref={( newPSWDConfirmTextInput ) => {
                                this._newPSWDConfirmTextInput = newPSWDConfirmTextInput;
                            }}
                            secureTextEntry={true}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
                            keyboardType="numeric"
                            maxLength={6}
                            onChangeText={
                                ( text ) => {
                                    this.state.newPasswordConfirm = text;
                                    this.setState( { error: '' } );
                                }
                            }
                            returnKeyType={'done'}
                            returnKeyLabel={I18n.t( Keys.done )}
                            onSubmitEditing={this
                                .onTapSave
                                .bind( this )}
                        />
                    </View>
                </View>
                <Text
                    style={[
                        commonStyles.errorTipStyle
                    ]}>
                    {this.state.error + ""}
                </Text>
                {
                    isNeedOldPass ?
                        <View style={{
                            marginTop: 10,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end'
                        }}>
                            <Button
                                style={[
                                    {
                                        marginTop: 10,
                                        fontSize: 14
                                    },
                                    commonStyles.commonTextColorStyle
                                ]}
                                onPress={() => {
                                    this.props.onTapForgetPayPassword( this.props.user );
                                }} title="">
                                {I18n.t( Keys.forgot_pay_password )}
                            </Button>
                        </View>
                        :
                        null
                }
                <View style={{
                    marginTop: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: '#c8c9cb',
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        {I18n.t( Keys.not_need_input_current_password_when_first_time )}</Text>
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
        )
    }
}

export default SetPayPSWDPageView;
