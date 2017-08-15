import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import { paymentWithdraw } from "../../../actions/PaymentAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import InputPayPasswordComponent from "../payPSWD/inputPSWD/InputPayPasswordComponent";
import Util from "../../../util/Util";


class WalletWithdrawPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.withdraw ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapWithdrawRecord()
                    }}
                >
                    {I18n.t( Keys.withdraw_record )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            error: '',
            withdrawAccount: null,
            amount: null,
            isRequesting: false,
            isPayPSWDInputOpen: false,
            user: this.props.user,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapWithdrawRecord: this.onTapWithdrawRecord.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapWithdrawRecord() {
        this.props.navigation.navigate( 'walletWithdrawRecordPage' );
    }

    handleWithdraw() {
        if ( this.state.withdrawAccount === null ) {
            this.setState( {
                error: I18n.t( Keys.plz_select_withdraw_account )
            } );

            return;
        }

        if ( this.state.amount === null || this.state.amount <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_correct_amount )
            } );

            return;
        }

        this.setState( {
            error: '',
            isPayPSWDInputOpen: true
        } );
    }

    doWithdraw( password ) {
        this.setState( {
            isRequesting: true,
            error: ''
        } );

        paymentWithdraw( this.state.amount, this.state.withdrawAccount.id, password, ( err, res ) => {
            this.setState( {
                error: err !== null ? err.message : '',
                isRequesting: false
            } );


            Toast.show( I18n.t( Keys.withdraw_success ) );

            if ( err === null ) {
                this.props.navigation.goBack();
            }
        } );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <ScrollView style={[ commonStyles.wrapper ]}>

                    <Text style={[ commonStyles.paddingCommon, { fontSize: 14, color: '#c8c9cb', paddingBottom: 15 } ]}>
                        {I18n.t( Keys.withdraw_tips )}
                    </Text>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.plz_select_account )}
                        content={this.state.withdrawAccount ? this.state.withdrawAccount.accountNo : ''}
                        onPress={() => {
                            this.setState( { error: '' } );

                            this.props.navigation.navigate( 'walletWithdrawAccountSelectPage', {
                                callback: ( value ) => {
                                    this.setState( {
                                        withdrawAccount: value
                                    } )
                                }
                            } );
                        }}
                        headerInterval={true}
                        footerInterval={true}/>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.money )}
                        content={this.state.amount ? Util.getShowPrice( this.state.user.currency, this.state.amount ) : ''}
                        onPress={() => {
                            this.setState( { error: '' } );

                            this.props.navigation.navigate(
                                'walletWithdrawSetAmountPage',
                                {
                                    callback: ( value ) => {
                                        this.setState( {
                                            amount: value
                                        } )
                                    }
                                }
                            );
                        }}
                        headerInterval={false}
                        footerInterval={true}/>

                    <Text
                        style={[
                            commonStyles.errorTipStyle, {
                                paddingLeft: 28,
                                paddingRight: 28
                            }
                        ]}>
                        {this.state.error}
                    </Text>

                    <Button
                        containerStyle={[
                            commonStyles.buttonContainerStyle, {
                                marginRight: 38,
                                marginLeft: 38
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this
                            .handleWithdraw
                            .bind( this )} title="">
                        {I18n.t( Keys.confirm )}
                    </Button>

                </ScrollView>

                <InputPayPasswordComponent
                    navigation={this.props.navigation}
                    isOpen={this.state.isPayPSWDInputOpen}
                    onClose={() => {
                        this.setState( {
                            isPayPSWDInputOpen: false
                        } );
                    }}
                    onPay={( password ) => {
                        this.doWithdraw( password );
                    }}
                />


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
    }
}

export default  connect( select )( WalletWithdrawPage );
