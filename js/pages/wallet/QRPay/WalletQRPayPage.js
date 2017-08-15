import React from "react";
import { StatusBar, Text, View } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import { memberGetById } from "../../../actions/MemberAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../../util/Util";
import AmountInputComponent from "../../../components/AmountInputComponent";
import { paymentPayment } from "../../../actions/PaymentAction";
import InputPayPasswordComponent from "../payPSWD/inputPSWD/InputPayPasswordComponent";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class WalletQRPayPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.qr_pay ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            id: this.props.navigation.state.params.id,
            user: null,
            currency: this.props.navigation.state.params.currency,
            amount: this.props.navigation.state.params.amount,
            inputAmountStr: '',
            error: '',
            isPayPSWDInputOpen: false,
            isProgress: false,
        };
    }

    componentWillMount() {
        this.setState( {
            isProgress: true,
        } );
        memberGetById(
            this.state.id, ( err, res ) => {
                this.setState(
                    {
                        error: err !== null ? err.message : '',
                        user: err === null ? res.data : null,
                        isProgress: false,
                    }
                );
            }
        );
    }

    handlePay() {
        if ( this._amountInputComponent ) {
            this._amountInputComponent.blur();
        }

        if ( !this.state.amount && this.state.inputAmountStr.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_amount )
                }
            );

            return;
        }

        const amount = this.state.amount || parseFloat( this.state.inputAmountStr );

        if ( isNaN( amount ) || amount <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_amount )
                }
            );

            return;
        }


        this.setState(
            {
                error: '',
                isPayPSWDInputOpen: true
            }
        );
    }

    doTransfer( payPassword ) {
        const amount = this.state.amount || parseFloat( this.state.inputAmountStr );

        // this.props.navigation.navigate(
        //     'walletQRPaySuccessPage', {
        //         data: this.state.user,
        //         amount: '' + amount,
        //         useFromMemberCurrency: false,
        //     }
        // );

        this.setState(
            {
                isProgress: true,
                error: ''
            }
        );

        if ( this.state.user === null ) {
            memberGetById(
                this.state.id, ( err, res ) => {

                    if ( err ) {
                        this.setState(
                            {
                                error: err.message,
                                isProgress: false,
                            }
                        );
                    } else {
                        this.setState(
                            {
                                user: res.data
                            }
                        );

                        paymentPayment(
                            this.state.id, amount, payPassword, ( err, res ) => {
                                this.setState(
                                    {
                                        error: err !== null ? err.message : '',
                                        isProgress: false,
                                    }
                                );

                                if ( err === null ) {
                                    this.props.navigation.navigate(
                                        'walletQRPaySuccessPage', {
                                            data: this.state.user,
                                            amount: '' + amount,
                                            useFromMemberCurrency: false,
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        } else {
            paymentPayment(
                this.state.id, amount, payPassword, ( err, res ) => {
                    this.setState(
                        {
                            error: err !== null ? err.message : '',
                            isProgress: false,
                        }
                    );

                    if ( err === null ) {
                        this.props.navigation.navigate(
                            'walletQRPaySuccessPage', {
                                data: this.state.user,
                                amount: '' + amount,
                                useFromMemberCurrency: false
                            }
                        );
                    }
                }
            );
        }
    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop, {
                paddingTop: 20,
                paddingLeft: 10,
                paddingRight: 10
            } ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />
                <View
                    style={[
                        {
                            backgroundColor: '#f5f7fa',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            flexDirection: 'row',
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 8,
                            paddingBottom: 8,
                            alignItems: 'center'
                        }
                    ]}
                >

                    <ImageWithPlaceHolder
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: 27,
                        } }
                        placeholderForSource={require( '../../../imgs/bg_avatar.png' )}
                        source={this.state.user && this.state.user.logo ? { uri: this.state.user.logo } : null}
                    />


                    <View style={[ { marginLeft: 10, flex: 1 } ]}>
                        <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 16, fontWeight: 'bold' } ]}>
                            {this.state.user && this.state.user.name}
                        </Text>

                        {
                            this.state.user && this.state.user.shopExists ?
                                <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                                    {I18n.t( Keys.normal_shop )}
                                </Text>
                                :
                                null
                        }
                    </View>
                </View>
                <View
                    style={[
                        {
                            backgroundColor: 'white',
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            paddingTop: 20,
                            paddingBottom: 20,
                        }
                    ]}
                >

                    {
                        this.state.amount !== null && this.state.amount !== undefined && this.state.amount > 0 ?
                            <Text style={[ {
                                fontSize: 14,
                                color: constStyles.THEME_COLOR,
                                textAlign: 'center'
                            } ]}>
                                {Util.getDisplaySymbol( this.state.currency )}
                                <Text style={[ { fontSize: 24 } ]}>
                                    {Util.getDisplayPrice( this.state.amount )}
                                </Text>
                            </Text>
                            :
                            <AmountInputComponent
                                ref={( amountInputComponent ) => {
                                    this._amountInputComponent = amountInputComponent;
                                }}
                                style={[ {
                                    height: 40,
                                    backgroundColor: '#f1f6f8',
                                    borderColor: '#e7e7e7',
                                    marginLeft: 18,
                                    marginRight: 18,
                                } ]}
                                amountStr={this.state.inputAmountStr}
                                currency={this.state.currency}
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
                                    .handlePay
                                    .bind( this )}
                            />
                    }

                    <Text
                        style={[
                            commonStyles.errorTipStyle
                        ]}>
                        {this.state.error}
                    </Text>


                    <Button
                        containerStyle={[
                            commonStyles.buttonContainerStyle, {
                                marginRight: 28,
                                marginLeft: 28,
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this
                            .handlePay
                            .bind( this )} title="">
                        {I18n.t( Keys.pay )}
                    </Button>

                </View>


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
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}
                    isOpen={this.state.isProgress}
                >
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        );
    }
}

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default connect( select )( WalletQRPayPage );
