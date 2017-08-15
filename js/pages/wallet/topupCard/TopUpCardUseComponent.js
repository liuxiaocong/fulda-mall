import React from "react";
import {
    BackHandler,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Modal from "react-native-root-modal";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { connect } from "react-redux";


const styles = StyleSheet.create(
    {
        container: {}
    }
);

class TopUpCardUseComponent extends React.Component {
    static propTypes = {
        onClose: React.PropTypes.func.isRequired,
        onApply: React.PropTypes.func.isRequired,
        isOpen: React.PropTypes.bool,
        errorStr: React.PropTypes.string.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            isOpen: this.props.isOpen,
            error: this.props.errorStr,
            account: '',
            payPassword: '',
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
        this.setState(
            {
                isOpen: nextProps.isOpen,
                error: nextProps.errorStr
            }
        );
    }

    onApply() {
        if ( this.state.account.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_mobile_or_email )
                }
            );

            return;
        }

        if ( this.state.payPassword.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_paid_password )
                }
            );

            return;
        }

        if ( this.props.onApply ) {
            this.props.onApply( this.state.account, this.state.payPassword );
        }
    }

    render() {
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
                            height: 222,
                            marginLeft: 10,
                            marginRight: 10,
                        }}>

                        <View style={[ {
                            width: Dimensions.get( "window" ).width - 20,
                            backgroundColor: 'white',
                            borderRadius: 5,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 20,
                            paddingBottom: 20,
                        } ]}>
                            <View style={[ commonStyles.inputTextGroupStyle ]}>
                                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                                    <TextInput
                                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                        placeholder={I18n.t( Keys.mobile_email )}
                                        autoCapitalize={'none'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        onChangeText={( text ) => {
                                            this.state.account = text;
                                        }}
                                        defaultValue={this.state.account}
                                        returnKeyType={'next'}
                                        returnKeyLabel={I18n.t( Keys.next )}
                                        onSubmitEditing={() => {
                                            this._payPSWDTextInput.focus();
                                        }}
                                    />
                                </View>

                                <View style={[ commonStyles.commonIntervalStyle ]}/>
                                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                                    <TextInput
                                        ref={( payPSWDTextInput ) => {
                                            this._payPSWDTextInput = payPSWDTextInput;
                                        }}
                                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                        placeholder={I18n.t( Keys.paid_password )}
                                        autoCapitalize={'none'}
                                        underlineColorAndroid={'transparent'}
                                        autoCorrect={false}
                                        onChangeText={( text ) => {
                                            this.state.payPassword = text;
                                        }}
                                        defaultValue={this.state.payPassword}
                                        secureTextEntry={true}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        returnKeyType={'done'}
                                        returnKeyLabel={I18n.t( Keys.done )}
                                        onSubmitEditing={this
                                            .onApply
                                            .bind( this )}
                                    />
                                </View>
                            </View>

                            <Text
                                style={[
                                    commonStyles.errorTipStyle, {
                                        marginTop: 20
                                    }
                                ]}>
                                {this.state.error}
                            </Text>
                            <Button
                                containerStyle={[
                                    commonStyles.buttonContainerStyle, {}
                                ]}
                                style={[ commonStyles.buttonContentStyle ]}
                                onPress={this
                                    .onApply
                                    .bind( this )} title="">
                                {I18n.t( Keys.submit )}
                            </Button>
                        </View>

                    </TouchableWithoutFeedback>

                </TouchableOpacity>


            </Modal>

        );
    }
}


function select( store ) {
    return {}
}
export default  connect( select )( TopUpCardUseComponent );
