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
import Keys from "../../../../configs/Keys";
import I18n from "../../../../I18n";
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
class WithdrawAccountEditPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.withdraw_account_edit ),
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
        let pendingWithdrawAccount = {};
        if ( props.navigation.state.params.pendingWithdrawAccount ) {
            pendingWithdrawAccount = props.navigation.state.params.pendingWithdrawAccount;
        }
        this.state = {
            pendingWithdrawAccount: pendingWithdrawAccount,
            isRequesting: false,
            error: ''
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._accountNoInputText.blur();
        this._extraInfoInputText.blur();
        this._memberNameInputText.blur();

        if ( !this.state.pendingWithdrawAccount.accountNo || this.state.pendingWithdrawAccount.accountNo.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_account_no )
                }
            );
            return;
        }

        if ( !this.state.pendingWithdrawAccount.extraInfo || this.state.pendingWithdrawAccount.extraInfo.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_bank_name )
                }
            );
            return;
        }

        if ( !this.state.pendingWithdrawAccount.memberName || this.state.pendingWithdrawAccount.memberName.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_bank_account_name )
                }
            );
            return;
        }

        this.setState( { isRequesting: true, error: '' } );
        this.props.onTapSave(
            this.state.pendingWithdrawAccount, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        );
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
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_ACCOUNT_NO}
                            editable={true}
                            keyboardType={"numeric"}
                            onChangeText={
                                ( text ) => {
                                    this.state.pendingWithdrawAccount.accountNo = text;
                                    this.setState( {
                                        error: ''
                                    } );
                                }
                            }
                            defaultValue={this.state.pendingWithdrawAccount.accountNo}
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
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_EXTRA_INFO}
                            style={[ styles.input_txt ]}
                            underlineColorAndroid={'transparent'}
                            placeholder=""
                            onChangeText={
                                ( text ) => {
                                    this.state.pendingWithdrawAccount.extraInfo = text;
                                    this.setState( {
                                        error: ''
                                    } );
                                }
                            }
                            defaultValue={this.state.pendingWithdrawAccount.extraInfo}
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
                            underlineColorAndroid={'transparent'}
                            maxLength={UtilConfig.MAX_LENGTH.WITHDRAW_ACCOUNT_MEMBER_NAME}
                            placeholder=""
                            onChangeText={
                                ( text ) => {
                                    this.state.pendingWithdrawAccount.memberName = text;
                                    this.setState( {
                                        error: ''
                                    } );
                                }
                            }
                            defaultValue={this.state.pendingWithdrawAccount.memberName}
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

export default WithdrawAccountEditPageView;
