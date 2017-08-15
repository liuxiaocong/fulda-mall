import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import AmountInputComponent from "../../../components/AmountInputComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";

class WalletWithdrawSetAmountPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.withdraw_amount ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            amount: "",
            currency: this.props.user.currency
        };
    }

    componentDidMount() {
    }

    onPressSubmit() {
        const amount = parseFloat( this.state.amount );
        if ( isNaN( amount ) || amount <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_amount )
                }
            );

            return;
        }

        this._amountInputComponent.blur();

        let callback = this.props.navigation.state.params.callback;
        if ( typeof callback === 'function' ) {
            callback( parseFloat( this.state.amount ) );
        }
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <Text style={[ { fontSize: 11, color: '#b4b8c0' } ]}>
                    {I18n.t( Keys.withdraw_amount_title )}
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
                    amountStr={this.state.amount}
                    currency={this.state.currency}
                    onAmountChange={( amountStr ) => {
                        this.setState( {
                            amount: amountStr
                        } );
                    }}
                    autoFocus={true}
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .onPressSubmit
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
                        .onPressSubmit
                        .bind( this )} title="">
                    {I18n.t( Keys.submit )}
                </Button>

            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        tips_wrap: {
            width: Dimensions.get( 'window' ).width - 60,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        tips: {},
        submit_btn: {
            borderWidth: 1,
            borderColor: '#eee',
            padding: 10,
            borderRadius: 8,
            justifyContent: 'center',
            backgroundColor: '#841584',
            alignItems: 'center',
            marginTop: 20,
            width: Dimensions.get( 'window' ).width - 80,
        },
        submit_btn_txt: {
            color: '#fff',
        }
    }
);

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status
    }
}

export default  connect( select )( WalletWithdrawSetAmountPage );
