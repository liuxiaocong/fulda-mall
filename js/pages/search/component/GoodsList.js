import React from "react";

import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import GoodsShowItem from "./GoodsShowItem";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import LoadingMoreItem from "../../../components/LoadingMoreItem";

class GoodsList extends React.Component {
    static propTypes = {
        getSearchHeader: React.PropTypes.func.isRequired,
        onScroll: React.PropTypes.func,
        searchFunction: React.PropTypes.func.isRequired,
        isNeedRefreshData: React.PropTypes.func.isRequired,
        hasMoreData: React.PropTypes.bool,
        currentPageNum: React.PropTypes.number,
        data: React.PropTypes.array,
        isEmpty: React.PropTypes.bool
    };

    constructor( props ) {
        super( props );

        this.state = {
            refreshing: false,
            waiting: false,
            hasMoreData: this.props.hasMoreData ? this.props.hasMoreData : false,
            currentPageNum: this.props.currentPageNum ? this.props.currentPageNum : 0,
            data: this.props.data ? this.props.data : [],
            isEmpty: this.props.isEmpty
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.isNeedRefreshData() ) {
            this.loadData( 0 );
        }
    }

    loadData( pageNum ) {
        if ( pageNum > 0 ) {
            if ( this.state.waiting || !this.state.hasMoreData ) {
                return;
            }
        }

        this.setState( {
            refreshing: pageNum === 0 ? true : this.state.refreshing,
            waiting: pageNum !== 0 ? true : this.state.waiting,
            isEmpty: false
        } );

        const pageSize = 20;
        this.props.dispatch( this.props.searchFunction(
            pageSize,
            pageNum,
            ( err, res ) => {
                let isEmpty = false;

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

                        if ( res.data.length <= 0 ) {
                            isEmpty = true;

                            data.push( 'emptyTip' );
                        }
                    } else {
                        data = this.state.data.slice();

                        for ( let index = 0; index < res.data.length; index++ ) {
                            data.push( res.data[ index ] );
                        }
                    }
                }

                this.setState( {
                    refreshing: pageNum === 0 ? false : this.state.refreshing,
                    waiting: pageNum !== 0 ? false : this.state.waiting,
                    hasMoreData: hasMoreData,
                    currentPageNum: currentPageNum,
                    data: data,
                    isEmpty: isEmpty
                } );
            } )
        );
    }

    _onRefresh() {
        this.loadData( 0 );
    }

    onEndReached() {
        this.loadData( this.state.currentPageNum + 1 );
    }

    render() {
        const viewHeight = (Dimensions.get( 'window' ).width - 30) / 2 + 55;
        const separatorHeight = 100;
        return (
            <View style={[ this.props.style, commonStyles.wrapper, styles.recommendService ]}>

                <FlatList
                    style={[ { flex: 1 } ]}
                    contentContainerStyle={styles.grid}
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
                        if ( index === 0 && this.state.isEmpty ) {
                            return (
                                <View
                                    style={
                                        {
                                            width: Dimensions.get( 'window' ).width,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    }>
                                    <Text style={commonStyles.emptyTipStyle}>
                                        {I18n.t( Keys.empty_goods )}
                                    </Text>
                                </View>


                            );
                        }
                        else {
                            return (<GoodsShowItem {...this.props}
                                                   goods={ item}
                                                   containerStyle={[
                                                       {
                                                           width: (Dimensions.get( 'window' ).width - 30) / 2,
                                                           marginLeft: 10,
                                                           marginTop: 10,
                                                       }
                                                   ]}
                                                   imageHeight={(Dimensions.get( 'window' ).width - 30) / 2}
                            />);
                        }
                    }}
                    ListHeaderComponent={this.props.getSearchHeader}
                    ListFooterComponent={() => {
                        return (<LoadingMoreItem waiting={this.state.waiting}/>)
                    } }
                    ItemSeparatorComponent={() => {
                        return <View style={[ { height: separatorHeight } ]}/>
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                    onEndReached={this.onEndReached.bind( this )}
                    onScroll={() => {
                        if ( this.props.onScroll ) {
                            this.props.onScroll();
                        }
                    }}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1
    },
    recommendService: {
        flex: 1,
    },
    grid: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
} );

export default GoodsList;
