import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import GoodsList from "./component/GoodsList";
import { shopGoodsSearch } from "../../actions/ShopAction";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import constStyles from "../../styles/constStyles";


class SearchGoodsPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.goods_list ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            baseQueryData: this.props.navigation.state.params.baseQueryData,
            data: this.props.navigation.state.params.data,
            location: this.props.navigation.state.params.location,
            hasMoreData: this.props.navigation.state.params.hasMoreData,
            isNeedRefreshData: false
        };
    }

    searchService( pageSize, pageNum, callback ) {
        const keys = Object.keys( this.state.baseQueryData );

        const queryData = {};

        for ( let index = 0; index < keys.length; index++ ) {
            queryData[ keys[ index ] ] = this.state.baseQueryData[ keys[ index ] ];
        }

        queryData[ 'lat' ] = this.state.location.latitude;
        queryData[ 'lng' ] = this.state.location.longitude;

        queryData[ 'pageSize' ] = pageSize;
        queryData[ 'pageNum' ] = pageNum;

        return ( dispatch ) => {
            dispatch(
                shopGoodsSearch(
                    queryData,
                    ( err, res ) => {
                        if ( !!err ) {
                            for ( let index = 0; index < res.data; index++ ) {
                                res.data[ index ].name = (this.state.tab ? this.state.tab.title : '') + res.data[ index ].name;
                            }
                        }

                        if ( callback ) {
                            callback( err, res );
                        }
                    }
                )
            );
        };
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <GoodsList {...this.props}
                           getSearchHeader={() => {
                               return null;
                           }}
                           location={this.state.location}
                           searchFunction={this.searchService.bind( this )}
                           isNeedRefreshData={() => {
                               if ( this.state.isNeedRefreshData ) {
                                   this.setState( {
                                       isNeedRefreshData: false
                                   } );

                                   return true;
                               }

                               return false;
                           }}
                           hasMoreData={this.state.hasMoreData}
                           currentPageNum={0}
                           data={this.state.data}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( SearchGoodsPage );
