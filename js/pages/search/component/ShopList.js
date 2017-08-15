import React from "react";

import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import ShopShowItem from "./ShopShowItem2";
import constStyles from "../../../styles/constStyles";
import { shopSearch } from "../../../actions/ShopAction";
import LoadingMoreItem from "../../../components/LoadingMoreItem";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { memberGetFavoritesIds } from "../../../actions/MemberAction";


class ShopList extends React.Component {
    static propTypes = {
        getSearchHeader: React.PropTypes.func.isRequired,
        onScroll: React.PropTypes.func,
        baseQueryData: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        isNeedRefreshData: React.PropTypes.func.isRequired,
        hasMoreData: React.PropTypes.bool,
        currentPageNum: React.PropTypes.number,
        data: React.PropTypes.array,
    };

    constructor( props ) {
        super( props );

        this.state = {
            isRequesting: false,
            refreshing: false,
            waiting: false,
            baseQueryData: this.props.baseQueryData,
            location: this.props.location,
            hasMoreData: this.props.hasMoreData ? this.props.hasMoreData : false,
            currentPageNum: this.props.currentPageNum ? this.props.currentPageNum : 0,
            data: this.props.data ? this.props.data : [],
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps( nextProps ) {
        this.state.baseQueryData = nextProps.baseQueryData;
        this.state.location = nextProps.location;

        this.setState( {
            baseQueryData: nextProps.baseQueryData,
            location: nextProps.location,
        } );

        if ( nextProps.isNeedRefreshData() ) {
            this.loadData( 0 );
        }
    }

    loadData( pageNum ) {
        if ( !this.state.location ) {
            return;
        }

        if ( pageNum > 0 ) {
            if ( this.state.waiting || !this.state.hasMoreData ) {
                return;
            }
        }

        this.setState( {
            refreshing: pageNum === 0 ? true : this.state.refreshing,
            waiting: pageNum !== 0 ? true : this.state.waiting
        } );

        const keys = Object.keys( this.state.baseQueryData );

        const queryData = {};

        for ( let index = 0; index < keys.length; index++ ) {
            queryData[ keys[ index ] ] = this.state.baseQueryData[ keys[ index ] ];
        }

        queryData[ 'lat' ] = this.state.location.latitude;
        queryData[ 'lng' ] = this.state.location.longitude;

        queryData[ 'pageSize' ] = 20;
        queryData[ 'pageNum' ] = pageNum;

        this.props.dispatch( shopSearch(
            queryData,
            ( err, res ) => {
                let data = null;
                let hasMoreData = this.state.hasMoreData;
                let currentPageNum = this.state.currentPageNum;
                if ( err ) {
                    Toast.show( err.message );
                    data = this.state.data;
                } else {
                    hasMoreData = res.data.length >= queryData[ 'pageSize' ];
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

                this.setState( {
                    refreshing: pageNum === 0 ? false : this.state.refreshing,
                    waiting: pageNum !== 0 ? false : this.state.waiting,
                    hasMoreData: hasMoreData,
                    currentPageNum: currentPageNum,
                    data: data,
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
        const viewHeight = 238;
        const separatorHeight = 10;

        return (
            <View style={[ this.props.style, commonStyles.wrapper, styles.recommendService ]}>

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
                        return (<ShopShowItem {...this.props} shop={item}
                                              containerStyle={[
                                                  {
                                                      marginLeft: 10,
                                                      marginRight: 10,
                                                  }
                                              ]}
                                              onDoUnFavorites={() => {
                                                  this.setState( { isRequesting: true } )
                                              }}
                                              onUnFavoritesSuccess={() => {
                                                  this.setState( { isRequesting: false } );
                                                  this.props.dispatch( memberGetFavoritesIds( null ) );
                                              }}
                                              onDoFavorites={() => {
                                                  this.setState( { isRequesting: true } )
                                              }}
                                              onFavoritesSuccess={() => {
                                                  this.setState( { isRequesting: false } );
                                                  this.props.dispatch( memberGetFavoritesIds( null ) );
                                              }}/>);
                    }}
                    ListHeaderComponent={() => {
                        return (
                            <View style={[ { marginBottom: separatorHeight } ]}>
                                {this.props.getSearchHeader()}
                            </View>
                        );
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
                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
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
    }
} );

export default ShopList;
