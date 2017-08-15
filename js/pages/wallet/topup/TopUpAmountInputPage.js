import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import { paymentTopUp } from "../../../actions/PaymentAction";
import constStyles from "../../../styles/constStyles";
import AmountInputComponent from "../../../components/AmountInputComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class TopUpAmountInputPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params.title + "",
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isProgressing: false,
            paymentMethod: this.props.navigation.state.params.paymentMethod,
            inputAmountStr: '',
            error: ''
        };
    }


    topUp() {
        this._amountInputComponent.blur();

        const amount = parseFloat( this.state.inputAmountStr );
        if ( isNaN( amount ) || amount <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_correct_amount )
                }
            );
            return;
        }

        this.doTopUp( amount );
    }

    doTopUp( amount ) {
        this.setState(
            {
                isProgressing: true
            }
        );

        paymentTopUp(
            amount, this.state.paymentMethod, ( err, res ) => {
                this.setState(
                    {
                        isProgressing: false,
                        error: err ? err.message : ''
                    }
                );

                if ( !err ) {
                    switch ( this.state.paymentMethod ) {
                        case "paypal": {
                            this.props.navigation.navigate(
                                'topUpByPayPalPage', {
                                    url: res.data,
                                    callback: ( isSuccess ) => {
                                        if ( !isSuccess ) {
                                            Toast.show( I18n.t( Keys.top_up_failed ) );
                                        }
                                    }
                                }
                            );
                        }
                            break;
                        case "sinopay": {
                            this.props.navigation.navigate(
                                'topUpByUnionPayPage', {
                                    content: res.data,
                                    callback: ( isSuccess ) => {
                                        if ( !isSuccess ) {
                                            Toast.show( I18n.t( Keys.top_up_failed ) );
                                        }
                                    }
                                }
                            );
                        }

                            break;
                    }


                }
            }
        );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBG, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <Text style={[ { fontSize: 11, color: '#b4b8c0' } ]}>
                    {I18n.t( Keys.plz_input_top_up_amount )}
                </Text>

                <AmountInputComponent
                    ref={( amountInputComponent ) => {
                        this._amountInputComponent = amountInputComponent;
                    }}
                    style={[ {
                        height: 40,
                        backgroundColor: '#f1f6f8',
                        borderColor: '#e7e7e7',
                        marginTop: 10
                    } ]}
                    amountStr={this.state.inputAmountStr}
                    currency={this.props.user.currency}
                    onAmountChange={( amountStr ) => {
                        this.setState( {
                            inputAmountStr: amountStr,
                            error: ''
                        } );
                    }}
                    autoFocus={true}
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .topUp
                        .bind( this )}
                />

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
                        .topUp
                        .bind( this )} title="">
                    {I18n.t( Keys.top_up )}
                </Button>

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}
                    isOpen={this.state.isProgressing}
                >
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

export default  connect( select )( TopUpAmountInputPage );
