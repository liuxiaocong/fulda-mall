import React from "react";

import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import LoadingMoreItem from "../../../components/LoadingMoreItem";
import GoodsDetailDataDetail from "./GoodsDetailData/GoodsDetailDataDetail";
import GoodsDetailDataComments from "./GoodsDetailData/GoodsDetailDataComments";
import GoodsDetailDataRecords from "./GoodsDetailData/GoodsDetailDataRecords";
import { shopGet, shopGoodsCommentList, shopGoodsGet, shopGoodsOrderList } from "../../../actions/ShopAction";
import { connect } from "react-redux";


class GoodsDetailDataListComponent extends React.Component {
    static propTypes = {
        getPageHeader: React.PropTypes.func.isRequired,
        onScroll: React.PropTypes.func,
        onRefreshData: React.PropTypes.func.isRequired,
        business: React.PropTypes.object,
        service: React.PropTypes.object,
        serviceId: React.PropTypes.number,
        tab: React.PropTypes.object.isRequired,
    };

    constructor( props ) {
        super( props );

        this.serviceDetailDataDetail = GoodsDetailDataDetail.createNew();
        this.serviceDetailDataComments = GoodsDetailDataComments.createNew();
        this.serviceDetailDataRecords = GoodsDetailDataRecords.createNew();

        this.serviceDetailDataComments.onSegmentChanged = this.onSegmentChanged.bind( this );

        let content = null;
        if ( this.props.tab.index === 0 ) {
            content = this.serviceDetailDataDetail;
        } else if ( this.props.tab.index === 1 ) {
            content = this.serviceDetailDataComments;
        } else if ( this.props.tab.index === 2 ) {
            content = this.serviceDetailDataRecords;
        }

        if ( this.props.service && this.props.service.statistics ) {
            this.serviceDetailDataComments.updateSegmentedData( this.props.service.statistics.good, this.props.service.statistics.normal, this.props.service.statistics.bad );
        } else {
            this.serviceDetailDataComments.updateSegmentedData( null, null, null );
        }

        this.serviceDetailDataDetail.replaceData( this.props.service );

        this.state = {
            business: this.props.business,
            service: this.props.service,
            serviceId: this.props.serviceId,
            tab: this.props.tab,
            content: content,
            data: content.data,
            refreshing: false,
            waiting: false,
        };
    }

    componentWillReceiveProps( nextProps ) {
        let content = null;
        if ( nextProps.tab.index === 0 ) {
            content = this.serviceDetailDataDetail;
        } else if ( nextProps.tab.index === 1 ) {
            content = this.serviceDetailDataComments;
        } else if ( nextProps.tab.index === 2 ) {
            content = this.serviceDetailDataRecords;
        }

        if ( nextProps.service && nextProps.service.statistics ) {
            this.serviceDetailDataComments.updateSegmentedData( nextProps.service.statistics.good, nextProps.service.statistics.normal, nextProps.service.statistics.bad );
        } else {
            this.serviceDetailDataComments.updateSegmentedData( null, null, null );
        }

        this.setState( {
            business: nextProps.business,
            service: nextProps.service,
            tab: nextProps.tab,
            content: content,
            data: content.data,
        } );
    }

    componentDidMount() {
        this.loadData( false );
    }

    onSegmentChanged() {
        this.loadData( false );
    }

    loadData( isLoadMore ) {
        if ( this.state.refreshing || this.state.waiting ) {
            return;
        }

        if ( this.state.waiting || (isLoadMore && !this.state.content.supportLoadMore) || (isLoadMore && !this.state.content.hasMoreData) ) {
            return;
        }

        this.setState( {
            refreshing: !isLoadMore ? true : this.state.refreshing,
            waiting: isLoadMore ? true : this.state.waiting
        } );

        if ( isLoadMore ) {

            if ( this.props.tab.index === 0 ) {
                // content = this.serviceDetailDataDetail;
            } else if ( this.props.tab.index === 1 ) {
                // content = this.serviceDetailDataComments;

                shopGoodsCommentList( this.state.serviceId, this.serviceDetailDataComments.selectedCustomSegment.value, 20, this.serviceDetailDataComments.currentPageNum + 1, ( err, res ) => {
                    if ( err ) {
                        Toast.show( err.message );
                    } else {
                        this.serviceDetailDataComments.hasMoreData = res.data.length >= 20;
                        this.serviceDetailDataComments.currentPageNum = this.serviceDetailDataComments.currentPageNum + 1;

                        this.serviceDetailDataComments.appendData( res.data );
                    }

                    this.onLoadFinish( isLoadMore );
                } );

            } else if ( this.props.tab.index === 2 ) {
                shopGoodsOrderList( this.state.serviceId, 20, this.serviceDetailDataRecords.currentPageNum + 1, ( err, res ) => {
                    if ( err ) {
                        Toast.show( err.message );
                    } else {
                        this.serviceDetailDataRecords.hasMoreData = res.data.length >= 20;
                        this.serviceDetailDataRecords.currentPageNum = this.serviceDetailDataRecords.currentPageNum + 1;

                        this.serviceDetailDataRecords.appendData( res.data );
                    }

                    this.onLoadFinish( isLoadMore );
                } );
            }

        } else {
            let newService = null;
            let newBusiness = null;

            shopGoodsGet( this.state.serviceId, ( err, res ) => {
                if ( err ) {
                    Toast.show( err.message );
                    this.onLoadFinish( isLoadMore );
                } else {
                    newService = res.data;

                    this.serviceDetailDataDetail.replaceData( newService );

                    this.props.dispatch( shopGet( newService.shopId, ( err, res ) => {
                        if ( err ) {
                            Toast.show( err.message );
                            this.onLoadFinish( isLoadMore );
                        } else {
                            newBusiness = res.data;

                            shopGoodsCommentList( this.state.serviceId, this.serviceDetailDataComments.selectedCustomSegment.value, 20, 0, ( err, res ) => {
                                if ( err ) {
                                    Toast.show( err.message );
                                    this.onLoadFinish( isLoadMore );
                                } else {
                                    this.serviceDetailDataComments.hasMoreData = res.data.length >= 20;
                                    this.serviceDetailDataComments.currentPageNum = 0;

                                    this.serviceDetailDataComments.replaceData( res.data );

                                    shopGoodsOrderList( this.state.serviceId, 20, 0, ( err, res ) => {
                                        if ( err ) {
                                            Toast.show( err.message );
                                            this.onLoadFinish( isLoadMore );
                                        } else {
                                            this.serviceDetailDataRecords.replaceData( res.data );

                                            this.serviceDetailDataRecords.hasMoreData = res.data.length >= 20;
                                            this.serviceDetailDataRecords.currentPageNum = 0;

                                            this.state.refreshing = !isLoadMore ? false : this.state.refreshing;
                                            this.state.waiting = isLoadMore ? false : this.state.waiting;

                                            if ( this.props.onRefreshData ) {
                                                this.props.onRefreshData( newService, newBusiness );
                                            }
                                        }
                                    } );
                                }
                            } );
                        }
                    } ) );

                }
            } );
        }
    }

    onLoadFinish( isLoadMore ) {
        this.setState( {
            refreshing: !isLoadMore ? false : this.state.refreshing,
            waiting: isLoadMore ? false : this.state.waiting,
        } );
    }

    _onRefresh() {
        this.loadData( false );
    }

    onEndReached() {
        this.loadData( true );
    }

    renderItem( { item, index } ) {
        return this.state.content.renderItem( { item, index } );
    }

    getItemLayout( data, index ) {
        return this.state.content.getItemLayout( data, index );
    }

    render() {
        return (
            <View style={[ this.props.style, commonStyles.wrapper, styles.recommendService ]}>

                <FlatList
                    style={[ { flex: 1 } ]}
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
                    renderItem={this.renderItem.bind( this )}
                    ListHeaderComponent={this.props.getPageHeader}
                    ListFooterComponent={() => {
                        return (<LoadingMoreItem {...this.props} waiting={this.state.waiting}/>);
                    }}
                    onEndReached={this.onEndReached.bind( this )}
                    getItemLayout={this.state.content.isSupportItemLayout ? this.getItemLayout.bind( this ) : null}
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
} );

//
// function select( store ) {
//     return {}
// }

function mapStateToProps( state ) {
    return {
        user: state.userStore.user,
    }
}

export default connect( mapStateToProps, null, null, { withRef: true } )( GoodsDetailDataListComponent );
