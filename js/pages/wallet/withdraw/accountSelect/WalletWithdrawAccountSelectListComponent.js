import React from "react";

import { FlatList, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../../../../styles/commonStyles";
import { connect } from "react-redux";
import { shopGetWithdrawAccount } from "../../../../actions/ShopAction";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


class WalletWithdrawAccountSelectListComponent extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
    };

    constructor( props ) {
        super( props );
        let withdrawAccounts = props.withdrawAccounts;
        if ( withdrawAccounts && withdrawAccounts.length > 0 ) {
            withdrawAccounts.sort( function ( a, b ) {
                let valA = a.default ? 1 : 0;
                let valB = b.default ? 1 : 0;
                return valB - valA
            } )
        }

        this.state = {
            data: withdrawAccounts,
        };
    }

    componentWillMount() {
        this.props.dispatch( shopGetWithdrawAccount( ( err, res ) => {
            if ( err ) {
                console.log( err.message );
            }
        } ) );
    }

    //noinspection JSMethodCanBeStatic
    componentWillUpdate( nextProps, nextState ) {
        let withdrawAccounts = nextProps.withdrawAccounts;
        if ( withdrawAccounts && withdrawAccounts.length > 0 ) {
            withdrawAccounts.sort( function ( a, b ) {
                let valA = a.default ? 1 : 0;
                let valB = b.default ? 1 : 0;
                return valB - valA
            } )
        }
        nextState.data = withdrawAccounts;
        return true;
    }

    renderItem( { item, index } ) {
        return (

            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( this.props.onSelect ) {
                        this.props.onSelect( item );
                    }
                }}
                style={[ commonStyles.wrapper, {
                    backgroundColor: 'white'
                } ]}>
                <View
                    style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                    }}>
                    {
                        item.default ?
                            <Text style={{
                                fontSize: 14,
                                color: '#e72545',
                                flexGrow: 1,
                            }}>
                                {I18n.t( Keys.default_account )}
                            </Text>
                            :
                            null
                    }

                    <View style={ styles.item_style }>
                        <Text style={styles.label_style} numberOfLines={1}>
                            {I18n.t( Keys.bank_account ) + ": "}
                            <Text style={styles.value_style}>
                                { item.accountNo}
                            </Text>
                        </Text>

                    </View>

                    <View style={ styles.item_style  }>
                        <Text style={styles.label_style} numberOfLines={1}>
                            {I18n.t( Keys.bank_name ) + ": "}
                            <Text style={styles.value_style}>
                                { item.extraInfo}
                            </Text>
                        </Text>

                    </View>

                    <View style={ styles.item_style  }>
                        <Text style={styles.label_style} numberOfLines={1}>
                            {I18n.t( Keys.bank_account_name ) + ": "}
                            <Text style={styles.value_style}>
                                {item.memberName}
                            </Text>
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const separatorHeight = 10;
        let isEmpty = true;
        if ( this.state.data && this.state.data.length > 0 ) {
            isEmpty = false;
        }
        return (
            <View style={[ this.props.style, commonStyles.wrapper, styles.recommendService ]}>
                {
                    isEmpty ?
                        <View
                            style={
                                {
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            }>
                            <Text style={commonStyles.emptyTipStyle}>
                                {I18n.t( Keys.empty_withdraw_account_data )}
                            </Text>
                        </View>
                        :
                        <FlatList
                            data={this.state.data}
                            keyExtractor={( item, index ) => {
                                return index;
                            }}
                            renderItem={( { item, index } ) => {
                                return this.renderItem( { item, index } );
                            }}
                            ItemSeparatorComponent={() => {
                                return <View style={[ { height: separatorHeight } ]}/>
                            }}
                            ListHeaderComponent={() => {
                                return <View style={[ { height: separatorHeight } ]}/>
                            }}
                        />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create( {
    item_style: {
        height: 30,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    label_style: {
        color: '#3e3c43',
        fontSize: 14,
    },
    value_style: {
        color: '#717789',
        fontSize: 14,
    }
} );

function select( store ) {
    return {
        withdrawAccounts: store.walletStore.withdrawAccounts
    }
}

export default  connect( select )( WalletWithdrawAccountSelectListComponent );