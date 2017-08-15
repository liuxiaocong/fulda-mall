import React from "react";

import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import LoadingMoreItem from "../../../components/LoadingMoreItem";
import { paymentTransactionMoneyList } from "../../../actions/PaymentAction";
import Util from "../../../util/Util";
import { connect } from "react-redux";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class TransactionRecordListComponent extends React.Component {
    static propTypes = {
        getHeader: React.PropTypes.func.isRequired,
    };

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

        paymentTransactionMoneyList(
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
                } ]}
                      numberOfLines={1}>
                    {title}
                    <Text style={[ commonStyles.wrapper, {
                        color: '#717789',
                        fontSize: 14,
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
                height: 18 * 6 + 10 * 9,
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
                                {TransactionRecordListComponent.renderContent( I18n.t( Keys.trade_type ), item.typeText, 0 )}
                                {TransactionRecordListComponent.renderContent( I18n.t( Keys.trade_reason ), '' + item.reasonText, 10 )}
                                {TransactionRecordListComponent.renderContent( I18n.t( Keys.create_time ), Util.getDateDescription( item.transactionDate ), 10 )}
                            </View>


                            <View style={[ commonStyles.justAlignCenter, {
                                backgroundColor: item.status === 1 ? '#0ed912' : '#e72545',
                                borderRadius: 3, paddingLeft: 8,
                                paddingRight: 8, height: 30,
                            } ]}>
                                <Text style={[ {
                                    color: 'white',
                                    fontSize: 12,
                                } ]}>
                                    {item.status === 1 ? I18n.t( Keys.trade_success ) : I18n.t( Keys.trade_fail ) }
                                </Text>
                            </View>
                        </View>
                        {TransactionRecordListComponent.renderContent( I18n.t( Keys.trade_order_number ), item.reference, 10 )}
                    </View>
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[ commonStyles.wrapper, {
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10
                } ]}>
                    {TransactionRecordListComponent.renderContent( I18n.t( Keys.money ), Util.getShowPrice( this.props.user.currency, item.money ), 0 )}
                    {TransactionRecordListComponent.renderContent( I18n.t( Keys.cost ), Util.getShowPrice( this.props.user.currency, item.fee ), 10 )}
                </View>
            </View>
        );
    }

    render() {
        const viewHeight = 18 * 6 + 10 * 9;
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
                                {I18n.t( Keys.empty_trade_record )}
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

                            ListHeaderComponent={this.props.getHeader}
                            ListFooterComponent={() => {
                                return (
                                    <View>
                                        <View style={[ { height: separatorHeight } ]}/>
                                        <LoadingMoreItem {...this.props} waiting={this.state.waiting}/>
                                    </View>)
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

export default  connect( select )( TransactionRecordListComponent );