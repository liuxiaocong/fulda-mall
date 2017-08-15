import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import Util from "../../../util/Util";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class WalletBalanceComponent extends React.Component {
    static propTypes = {
        totalMoneyShow: React.PropTypes.bool,
        availableMoneyShow: React.PropTypes.bool,
        FRCShow: React.PropTypes.bool,

    };

    constructor( props ) {
        super( props );
        this.state = {
            user: this.props.user,
            balance: this.props.balance,
            totalMoneyShow: this.props.totalMoneyShow !== undefined ? this.props.totalMoneyShow : true,
            availableMoneyShow: this.props.availableMoneyShow !== undefined ? this.props.availableMoneyShow : true,
            FRCShow: this.props.FRCShow !== undefined ? this.props.FRCShow : true
        };
    }

    componentWillMount() {

    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            user: nextProps.user,
            balance: nextProps.balance
        } );
    }

    static renderItem( title, symbol, amount, onPress ) {
        symbol = symbol + ' ';
        return (
            <TouchableHighlight
                style={[
                    {
                        backgroundColor: "white",
                        flex: 1,
                        height: 60,
                    },
                ]}
                underlayColor='#ddd'
                onPress={() => {
                    if ( onPress ) {
                        onPress();
                    }
                }}>
                <View
                    style={[
                        {
                            flex: 1,
                            height: 60,
                            paddingLeft: 20,
                            alignItems: 'center',
                            flexDirection: 'row'
                        } ]}
                >

                    <View style={[ commonStyles.wrapper, {} ]}>
                        <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 17, fontWeight: 'bold' } ]}
                              numberOfLines={1}>
                            {symbol}
                            <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 17 } ]}>
                                {amount}
                            </Text>
                        </Text>

                        <Text style={[ { fontSize: 10, color: '#717789', marginTop: 4 } ]}>
                            {title}
                        </Text>
                    </View>

                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View
                style={[
                    { backgroundColor: 'white', flexDirection: 'row' }, commonStyles.commonBorderBottom
                ]}>

                {
                    this.state.totalMoneyShow ?
                        WalletBalanceComponent.renderItem(
                            I18n.t( Keys.account_balance ),
                            Util.getDisplaySymbol( this.state.user.currency ),
                            this.state.balance !== null ? Util.getDisplayPrice( this.state.balance.memberMoney + this.state.balance.memberMoneyFreeze ) : '_.__',
                            () => {
                                this.props.navigation.navigate( 'walletBalancePieChartPage', { type: 0 } );
                            }
                        )
                        :
                        null
                }

                {
                    this.state.totalMoneyShow && (this.state.availableMoneyShow || (!this.state.availableMoneyShow && this.state.FRCShow)) ?
                        <View style={[ commonStyles.commonIntervalStyle, { width: 1, height: 32, marginTop: 14 } ]}/>
                        :
                        null
                }

                {
                    this.state.availableMoneyShow ?
                        WalletBalanceComponent.renderItem(
                            I18n.t( Keys.available_balance ),
                            Util.getDisplaySymbol( this.state.user.currency ),
                            this.state.balance !== null ? Util.getDisplayPrice( this.state.balance.memberMoney ) : '_.__',
                            () => {
                                this.props.navigation.navigate( 'walletBalancePieChartPage', { type: 1 } );
                            }
                        )
                        :
                        null
                }

                {
                    this.state.availableMoneyShow && this.state.FRCShow ?
                        <View style={[ commonStyles.commonIntervalStyle, { width: 1, height: 32, marginTop: 14 } ]}/>
                        :
                        null
                }

                {
                    this.state.FRCShow ?
                        WalletBalanceComponent.renderItem(
                            I18n.t( Keys.fulda_balance ),
                            Util.getDisplaySymbol( this.state.user.currency ),
                            this.state.balance !== null ? Util.getDisplayPrice( this.state.balance.memberPoint ) : '_.__',
                            () => {
                                this.props.navigation.navigate( 'walletBalancePieChartPage', { type: 2 } );
                            }
                        )
                        :
                        null
                }


            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        user: store.userStore.user,
        balance: store.walletStore.balance,
    }
}

export default connect( select )( WalletBalanceComponent );
