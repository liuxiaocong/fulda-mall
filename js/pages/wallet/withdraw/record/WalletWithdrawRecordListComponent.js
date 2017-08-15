import React from "react";

import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import LoadingMoreItem from "../../../../components/LoadingMoreItem";
import { paymentWithdrawList } from "../../../../actions/PaymentAction";
import Util from "../../../../util/Util";
import { connect } from "react-redux";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


class WalletWithdrawRecordListComponent extends React.Component {
    static propTypes = {};

    constructor( props ) {
        super( props );

        this.state = {
            refreshing: false,
            waiting: false,
            hasMoreData: false,
            currentPageNum: 0,
            data: [],
        };
    }

    componentWillMount() {
        this.loadData( 0 );
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    loadData( pageNum ) {
        if ( pageNum > 0 ) {
            if ( this.state.waiting || !this.state.hasMoreData ) {
                return;
            }
        }

        this.setState(
            {
                refreshing: pageNum === 0 ? true : this.state.refreshing,
                waiting: pageNum !== 0 ? true : this.state.waiting
            }
        );


        const pageSize = 20;

        paymentWithdrawList(
            pageSize, pageNum,
            ( err, res ) => {
                let data = null;
                let hasMoreData = this.state.hasMoreData;
                let currentPageNum = this.state.currentPageNum;
                if ( err ) {
                    Toast.show( err.message );
                    data = this.state.data;
                } else {
                    hasMoreData = res.data.length >= pageSize;
                    currentPageNum = pageNum;

                    if ( pageNum === 0 ) {
                        data = res.data;
                    } else {
                        data = this.state.data.slice();

                        for ( let index = 0; index < res.data.length; index++ ) {
                            data.push( res.data[ index ] );
                        }
                    }
                }

                this.setState(
                    {
                        refreshing: pageNum === 0 ? false : this.state.refreshing,
                        waiting: pageNum !== 0 ? false : this.state.waiting,
                        hasMoreData: hasMoreData,
                        currentPageNum: currentPageNum,
                        data: data,
                    }
                );
            }
        );
    }

    _onRefresh() {
        this.loadData( 0 );
    }

    onEndReached() {
        this.loadData( this.state.currentPageNum + 1 );
    }

    static renderContent( title, content, marginTop ) {
        title = title + ' ';
        return (
            <View style={[ { flexDirection: 'row', marginTop: marginTop, alignItems: 'center', } ]}>
                <Text style={[ commonStyles.commonTextColorStyle, {
                    fontSize: 14,
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                } ]}
                      numberOfLines={1}>
                    {title}
                    <Text style={[ commonStyles.wrapper, {
                        color: '#717789',
                        fontSize: 14,
                        textAlignVertical: 'center',
                    } ]}>
                        {content}
                    </Text>
                </Text>
            </View>
        );
    }

    renderItem( { item, index } ) {
        return (
            <View style={[ {
                height: 18 * 7 + 10 * 11,
                borderWidth: 1,
                borderColor: '#e7e7e7',
                backgroundColor: 'white',
                marginLeft: 15,
                marginRight: 15,
                borderRadius: 5,
            } ]}>
                <View style={[ {
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingTop: 10
                }, ]}>
                    <View>
                        <View style={[ { flexDirection: 'row' } ]}>
                            <View style={[ commonStyles.wrapper ]}>
                                {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.withdraw_amount ), Util.getShowPrice( this.props.user.currency, item.amount ), 0 )}

                            </View>
                            <View style={[ commonStyles.wrapper ]}>
                                {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.actually_amount ), Util.getShowPrice( this.props.user.currency, item.actualAmount ), 0 )}

                            </View>
                        </View>

                    </View>
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <View style={[ {
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingTop: 10
                }, ]}>
                    {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.serial_number ), item.serialNo, 0 )}
                    {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.withdraw_time ), Util.getDateDescription( item.registerDate ), 10 )}
                </View>

                <View style={[ commonStyles.commonIntervalStyle, {} ]}/>

                <View style={[ commonStyles.wrapper, {
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10
                } ]}>

                    <Text style={[ commonStyles.commonTextColorStyle, {
                        color: '#717789',
                        fontSize: 14,
                        textAlignVertical: 'center',
                        height: 14,
                        includeFontPadding: false,
                    } ]}>
                        {I18n.t( Keys.account_info )}
                    </Text>

                    {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.way ), item.typeText ? item.typeText : I18n.t( Keys.null ), 10 )}
                    {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.account ), item.accountNo, 10 )}
                    {WalletWithdrawRecordListComponent.renderContent( I18n.t( Keys.phone ), I18n.t( Keys.null ), 10 )}
                </View>
            </View>
        );
    }

    render() {
        const viewHeight = 14 * 7 + 10 * 10;
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
                                {I18n.t( Keys.empty_withdraw_record )}
                            </Text>
                        </View>
                        :
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind( this )}
                                />
                            }
                            data={this.state.data}
                            keyExtractor={( item, index ) => {
                                return index;
                            }}
                            renderItem={( { item, index } ) => {
                                return this.renderItem( { item, index } );
                            }}
                            ListHeaderComponent={() => {
                                return <View style={[ { height: separatorHeight } ]}/>
                            }}
                            ListFooterComponent={() => {
                                return (
                                    <View>
                                        <View style={[ { height: separatorHeight } ]}/>
                                        <LoadingMoreItem {...this.props} waiting={this.state.waiting}/>
                                    </View>
                                )
                            } }
                            onEndReached={this.onEndReached.bind( this )}
                            ItemSeparatorComponent={() => {
                                return <View style={[ { height: separatorHeight } ]}/>
                            }}
                            getItemLayout={( data, index ) => (
                                { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                            )}
                            onScroll={() => {
                                if ( this.props.onScroll ) {
                                    this.props.onScroll();
                                }
                            }}
                        />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        recommendService: {
            flex: 1,
        }
    }
);

function select( store ) {
    return {
        user: store.userStore.user,
    }
}

export default  connect( select )( WalletWithdrawRecordListComponent );