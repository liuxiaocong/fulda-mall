import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: 'center'
        },
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
        }
    }
);
class SetPSWDPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.user_password ),
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
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            error: '',
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        };
    }

    componentWillMount() {
        if ( this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.isFromSetting ) {
            this.props.navigation.state.key = "backToSettingAction";
        }

        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onTapSave() {
        this._currentPSWDTextInput.blur();
        this._newPSWDTextInput.blur();
        this._newPSWDConfirmTextInput.blur();

        if ( !this.state.currentPassword || this.state.currentPassword.length <= 0 ) {
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
                    this.setState( { error: err.toString() } );
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        )
    };

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
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
                                    width: 100
                                }
                            }>{I18n.t( Keys.current_password )}</Text>
                        <TextInput
                            ref={( currentPSWDTextInput ) => {
                                this._currentPSWDTextInput = currentPSWDTextInput;
                            }}
                            secureTextEntry={true}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
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
                                    width: 100
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
                                    width: 100
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
                    {this.state.error}
                </Text>
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
                            this._currentPSWDTextInput.blur();
                            this._newPSWDTextInput.blur();
                            this._newPSWDConfirmTextInput.blur();

                            this.props.onTapForgetPassword( this.props.user );
                        }} title="">
                        {I18n.t( Keys.forget_password )}
                    </Button>
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

export default SetPSWDPageView;
