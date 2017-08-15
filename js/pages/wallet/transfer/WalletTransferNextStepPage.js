import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { paymentTransfer } from "../../../actions/PaymentAction";
import InputPayPasswordComponent from "../payPSWD/inputPSWD/InputPayPasswordComponent";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const CALC_CURRENCY_BY_RECEIVER = 'CALC_CURRENCY_BY_RECEIVER';
const CALC_CURRENCY_BY_ME = 'CALC_CURRENCY_BY_ME';
class WalletTransferNextStepPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.transfer ),
        };
    };

    constructor( props ) {
        super( props );

        let data = [
            CALC_CURRENCY_BY_RECEIVER,
            CALC_CURRENCY_BY_ME
        ];

        this.state = {
            error: '',
            user: props.navigation.state.params.data,
            amount: props.navigation.state.params.amount,
            userMe: this.props.user,
            data: data,
            selectType: CALC_CURRENCY_BY_RECEIVER,
            isPayPSWDInputOpen: false,
            isRequesting: false,
        };
    }

    componentWillMount() {

    }

    onTransfer() {
        this.setState(
            {
                isPayPSWDInputOpen: true
            }
        );
    }

    doTransfer( payPassword ) {
        this.setState(
            {
                isRequesting: true,
            }
        );
        paymentTransfer(
            this.state.user.id, this.state.amount, this.state.selectType !== CALC_CURRENCY_BY_RECEIVER, payPassword, ( err, res ) => {
                this.setState(
                    {
                        error: err !== null ? err.message : '',
                        isRequesting: false,
                    }
                );
                if ( err === null ) {
                    this.props.navigation.navigate(
                        'walletTransferSuccessPage', {
                            data: this.props.user,
                            amount: this.state.amount,
                            useFromMemberCurrency: this.state.selectType !== CALC_CURRENCY_BY_RECEIVER,
                        }
                    );
                }
            }
        );
    }


    renderItem( type ) {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    this.setState( {
                        selectType: type
                    } );
                }}
                style={[ commonStyles.justAlignCenter, {
                    paddingLeft: 16,
                    paddingRight: 16,
                    backgroundColor: 'white',
                    height: 48
                } ]}>

                <View style={[ commonStyles.justAlignCenter, { flexDirection: 'row' } ]}>
                    <Text style={[ commonStyles.wrapper ]}>
                        {type === CALC_CURRENCY_BY_RECEIVER ? I18n.t( Keys.settle_with_recipient_currency ) : I18n.t( Keys.settle_with_merchant_currency )}
                    </Text>

                    {
                        type === this.state.selectType ?
                            <Image
                                style={{
                                    width: 15,
                                    height: 10,
                                    right: 0
                                }}
                                source={require( '../../../imgs/ic_confirm.png' )}/> : null}
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop, { paddingTop: 20 }
                ]}>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
                {this.renderItem( this.state.data[ 0 ] )}
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                {this.renderItem( this.state.data[ 1 ] )}
                <View style={[ commonStyles.commonIntervalStyle ]}/>

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
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this
                        .onTransfer
                        .bind( this )} title="">
                    {I18n.t( Keys.transfer )}
                </Button>

                <InputPayPasswordComponent
                    navigation={this.props.navigation}
                    isOpen={this.state.isPayPSWDInputOpen}
                    onClose={() => {
                        this.setState( {
                            isPayPSWDInputOpen: false
                        } );
                    }}
                    onPay={( password ) => {
                        this.doTransfer( password );
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
        user: store.userStore.user
    }
}

export default  connect( select )( WalletTransferNextStepPage );
