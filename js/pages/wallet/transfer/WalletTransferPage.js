import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import Spinner from "react-native-spinkit";
import ModalBox from "react-native-modalbox";
import { memberGetByAccount } from "../../../actions/MemberAction";
import Util from "../../../util/Util";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class WalletTransferPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.transfer ),
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
            error: '',
            account: '',
            amount: null,
            isRequesting: false
        };
    }

    componentWillMount() {
        this.props.navigation.state.key = "walletTransferPage";
    }

    componentDidMount() {
        this.props.navigation.setParams( {
            isOpenDebugMode: this.props.isOpenDebugMode,
            onTapLoginHisTory: this.onTapLoginHisTory.bind( this )
        } );
    }

    onTapLoginHisTory() {
        this._accountTextInput.blur();
        this._amountTextInput.blur();

        this.props.navigation.navigate(
            'debugLoginHistoryPage',
            {
                callback: ( item ) => {
                    this.setState( {
                        account: item.account,
                    } );
                }
            }
        );
    };

    onNext() {
        this._accountTextInput.blur();
        this._amountTextInput.blur();

        if ( !this.state.account || this.state.account.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_phone_email )
            } );

            return;
        }

        if ( this.state.amount === null || this.state.amount <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_amount )
            } );

            return;
        }

        let amount = parseFloat( this.state.amount );

        if ( isNaN( amount ) || amount <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_amount )
            } );

            return;
        }

        this.setState( {
            isRequesting: true,
            error: ''
        } );

        memberGetByAccount( this.state.account, ( err, res ) => {
            this.setState( {
                error: err !== null ? err.message : '',
                isRequesting: false
            } );

            if ( err === null ) {
                this.props.navigation.navigate( 'walletTransferNextStepPage', {
                    data: res.data,
                    amount: this.state.amount
                } );
            }
        } );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.wrapper ]}>
                    <View style={[ commonStyles.inputTextGroupStyle ]}>
                        <View
                            style={[ commonStyles.inputTextGroupItemStyle, { flexDirection: 'row' }, commonStyles.justAlignCenter ]}>
                            <Text style={[ { width: 100 } ]}>
                                {I18n.t( Keys.phone_or_email )}
                            </Text>

                            <TextInput
                                ref={( accountTextInput ) => {
                                    this._accountTextInput = accountTextInput;
                                }}
                                style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                placeholder={I18n.t( Keys.plz_input_phone_email )}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'default'}
                                underlineColorAndroid={'transparent'}
                                onChangeText={( text ) => {
                                    this.state.account = text;
                                    this.setState( {
                                        error: ''
                                    } );
                                }}
                                defaultValue={this.state.account}
                                returnKeyType={'next'}
                                returnKeyLabel={I18n.t( Keys.next )}
                                onSubmitEditing={() => {
                                    this._amountTextInput.focus();
                                }}
                            />
                        </View>

                        <View style={[ commonStyles.commonIntervalStyle ]}/>
                        <View
                            style={[ commonStyles.inputTextGroupItemStyle, { flexDirection: 'row' }, commonStyles.justAlignCenter ]}>
                            <Text style={[ { width: 100 } ]}>
                                {I18n.t( Keys.money ) + "(" + Util.getDisplaySymbol( this.props.user.currency ) + ')'}
                            </Text>

                            <TextInput
                                ref={( amountTextInput ) => {
                                    this._amountTextInput = amountTextInput;
                                }}
                                style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                placeholder={I18n.t( Keys.plz_input_amount )}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'numeric'}
                                underlineColorAndroid={'transparent'}
                                onChangeText={( text ) => {
                                    this.state.amount = parseFloat( text );
                                    this.setState( {
                                        error: ''
                                    } );
                                }}
                                defaultValue={this.state.amount !== null ? '' + this.state.amount : ''}
                                returnKeyType={'done'}
                                returnKeyLabel={I18n.t( Keys.done )}
                                onSubmitEditing={this
                                    .onNext
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
                                marginLeft: 10
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this
                            .onNext
                            .bind( this )} title="">
                        {I18n.t( Keys.next_step )}
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
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        user: store.userStore.user,
        isOpenDebugMode: store.settingStore.isOpenDebugMode,
    }
}

export default  connect( select )( WalletTransferPage );
