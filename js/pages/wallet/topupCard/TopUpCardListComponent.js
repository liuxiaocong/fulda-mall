import React from "react";

import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import LoadingMoreItem from "../../../components/LoadingMoreItem";
import { paymentSystemCouponList } from "../../../actions/PaymentAction";
import Util from "../../../util/Util";
import { connect } from "react-redux";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class TopUpCardListComponent extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
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

        paymentSystemCouponList(
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
            <View style={[ { flexDirection: 'row', marginTop: marginTop, height: 14 } ]}>
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
        const itemWidth = Dimensions.get( 'window' ).width - 12 * 2;
        const itemHeight = itemWidth * 107.5 / 350;

        const topHeight = itemWidth * 76 / 350;
        const bottomHeight = itemHeight - topHeight;

        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ {
                width: itemWidth,
                height: itemHeight,
                marginLeft: 12,
                marginRight: 12,
                borderRadius: 5,
            } ]}>
                <Image
                    style={{
                        width: itemWidth,
                        height: itemHeight,
                    }}
                    source={item.used ? require( '../../../imgs/bg_recharge_disable.png' ) : require( '../../../imgs/bg_recharge.png' )}/>


                <TouchableHighlight
                    underlayColor='#ddd5'
                    onPress={item.used ? null : () => {
                        if ( this.props.onSelect ) {
                            this.props.onSelect( item );
                        }
                    }}
                    style={[ {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: 5,
                    } ]}>
                    <View >

                        <View style={[ {
                            width: itemWidth,
                            height: topHeight,
                            paddingLeft: 15,
                            paddingRight: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        } ]}>
                            <View style={[ commonStyles.wrapper, ]}>
                                <Text style={[ { fontSize: 10, color: 'white' } ]}>
                                    {item.ref}
                                </Text>
                                <Text style={[ { fontSize: 14, color: 'white', marginTop: 15 } ]}>
                                    {I18n.t( Keys.user ) + ":"}
                                    <Text>
                                        {item.usedUsername ? item.usedUsername : 'NULL'}
                                    </Text>
                                </Text>
                            </View>

                            <Text style={[ { fontSize: 12, color: 'white' } ]}>
                                {Util.getDisplaySymbol( item.currency )}
                                <Text style={[ { fontSize: 30, color: 'white' } ]}>
                                    {Util.getDisplayPrice( item.price )}
                                </Text>
                            </Text>

                        </View>

                        <View style={[ {
                            width: itemWidth,
                            height: bottomHeight,
                            paddingLeft: 15,
                            paddingRight: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                        } ]}>
                            <Text style={[ { fontSize: 12, color: '#b4b8c0' } ]}>
                                {I18n.t( Keys.start_time )}
                                <Text>
                                    {Util.getDateDescriptionYMD( item.startDate )}
                                </Text>
                            </Text>

                            {
                                item.endDate && item.endDate !== 0 ?
                                    <Text style={[ { fontSize: 12, color: '#b4b8c0', marginLeft: 20 } ]}>
                                        {I18n.t( Keys.stop_time )}
                                        <Text>
                                            2017-11-10
                                        </Text>
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                    </View>
                </TouchableHighlight>


                {
                    item.used ?
                        <Image
                            style={{
                                width: 62,
                                height: 55,
                                position: 'absolute',
                                bottom: 0,
                                right: 0
                            }}
                            source={require( '../../../imgs/ic_used.png' )}/>
                        :
                        null
                }
            </View>
        );
    }

    render() {
        const itemWidth = Dimensions.get( 'window' ).width - 12 * 2;
        const viewHeight = itemWidth * 107.5 / 350;
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
                                {I18n.t( Keys.empty_top_up_card_list )}
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
                                return (<LoadingMoreItem {...this.props} waiting={this.state.waiting}/>)
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

export default  connect( select )( TopUpCardListComponent );