/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import * as UtilConfig from "../../../../configs/UtilConfig";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
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
class WithdrawAccountAddPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.add_account ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            accountNo: "",
            extraInfo: "",
            memberName: "",
            error: ""
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    addAccount() {
        this._accountNoInputText.blur();
        this._extraInfoInputText.blur();
        this._memberNameInputText.blur();

        if ( !this.state.accountNo || this.state.accountNo.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_account_no )
            } );
            return;
        }

        if ( !this.state.extraInfo || this.state.extraInfo.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_bank_name )
            } );
            return;
        }

        if ( !this.state.memberName || this.state.memberName.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_bank_account_name )
            } );
            return;
        }

        this.setState( {
            isRequesting: true,
            error: ''
        } );
        this.props.onTapFinish(
            this.state.accountNo, this.state.extraInfo, this.state.memberName, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    Toast.show( I18n.t( Keys.add_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.add_success ) );
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
                    height: 144,
                    borderRadius: 5,
                    backgroundColor: '#f1f6f8',
                    borderWidth: 1,
                    borderColor: '#e7e7e7',
                }}>
                    <View style={[ commonStyles.commonBorderBottom, styles.input_area ]}>
                        <Text
                            style={
                                {
                                    color: '#3e3c43',
                                    width: 100
                                }
                            }>{I18n.t( Keys.account )}</Text>
                        <TextInput
                            ref={( accountNoInputText ) => {
                                this._accountNoInputText = accountNoInputText;
                            }}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            autoFocus={true}
                            editable={true}
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_ACCOUNT_NO}
                            keyboardType={"numeric"}
                            onChangeText={
                                ( text ) => {
                                    this.state.accountNo = text;
                                    this.setState( { error: null } );
                                }
                            }
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._extraInfoInputText.focus();
                            }}
                        />
                    </View>
                    <View style={[ commonStyles.commonBorderBottom, styles.input_area ]}>
                        <Text
                            style={
                                {
                                    color: '#3e3c43',
                                    width: 100
                                }
                            }
                        >{I18n.t( Keys.bank_name )}</Text>
                        <TextInput
                            ref={( extraInfoInputText ) => {
                                this._extraInfoInputText = extraInfoInputText;
                            }}
                            style={[ styles.input_txt ]}
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_EXTRA_INFO}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
                            onChangeText={
                                ( text ) => {
                                    this.state.extraInfo = text;
                                    this.setState( { error: null } );
                                }
                            }
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._memberNameInputText.focus();
                            }}
                        />
                    </View>
                    <View style={[ commonStyles.commonBorderBottom, styles.input_area ]}>
                        <Text
                            style={
                                {
                                    color: '#3e3c43',
                                    width: 100
                                }
                            }>{I18n.t( Keys.bank_account_name )}</Text>
                        <TextInput
                            ref={( memberNameInputText ) => {
                                this._memberNameInputText = memberNameInputText;
                            }}
                            style={[ styles.input_txt ]}
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_MEMBER_NAME}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
                            onChangeText={
                                ( text ) => {
                                    this.state.memberName = text;
                                    this.setState( { error: null } );
                                }
                            }
                            returnKeyType={'done'}
                            returnKeyLabel={I18n.t( Keys.done )}
                            onSubmitEditing={this
                                .addAccount
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

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.addAccount()} title={I18n.t( Keys.finish )}>
                    {I18n.t( Keys.finish )}
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

export default WithdrawAccountAddPageView;
