import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FDLocationServices from "../../FDNativePackage/FDLocationServices";
import * as UtilConfig from "../../configs/UtilConfig";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { netMemberListFavorites } from "../../net/MemberNet";
import ShopItem from "./component/FavShopItem";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";


const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#f1f3f5',
            paddingLeft: 0,
            paddingRight: 0,
        },
    }
);

class FavoritesShopPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop ),
            // tabBar: ( { state, setParams } ) => ({
            //     label: I18n.t( Keys.shop )
            // }),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            data: [],
            err: "",
            isRequesting: false,
            hasMore: true,
            currentPageNum: UtilConfig.DEFAULT_PAGE_START
        };
    }

    componentDidMount() {
        this.loadData( true );

        FDLocationServices.getCurrentLocation( {} )
            .then(
                ( location ) => {
                    this.setState( { data: this.state.data } );
                }
            )
            .catch(
                ( error ) => {

                }
            );
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        FDLocationServices.cancelGetLocation();
    }


    onEndReached() {
        if ( this.state.hasMore ) {
            this.loadData( false );
        }
    }

    loadData( isRefresh ) {
        if ( isRefresh ) {
            this.setState( { isRequesting: true, currentPageNum: UtilConfig.DEFAULT_PAGE_START, hasMore: true } );
        }
        if ( !this.state.hasMore ) {
            return;
        }
        netMemberListFavorites(
            UtilConfig.FAV_TYPE_SHOP, UtilConfig.DEFAULT_PAGE_SIZE, this.state.currentPageNum, ( err, res ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    this.setState( { err: err + "" } )
                } else {
                    let hasMore = true;
                    let page = this.state.currentPageNum++;
                    if ( res.data === null || res.data.length < UtilConfig.DEFAULT_PAGE_SIZE ) {
                        hasMore = false;
                    }
                    let data = this.state.data;
                    if ( isRefresh ) {
                        data = res.data;
                    } else if ( res.data ) {
                        data = data.concat( res.data )
                    }
                    this.setState( { data: data, hasMore: hasMore, currentPageNum: page } )
                }
            }
        )
    }

    _renderItem = ( item, index ) => {
        return (
            <View
                style={{
                    marginBottom: 10
                }}>
                <ShopItem {...this.props} location={this.state.location}
                          business={item.item}
                          onUnFavoritesSuccess={( shopItem ) => {
                              this.removeData( shopItem );
                              this.props.refreshFavIds();
                          }}
                          containerStyle={[
                              {
                                  marginLeft: 10,
                                  marginRight: 10,
                              }
                          ]}/>
            </View>
        )
    };

    removeData = ( shopItem ) => {
        let data = [];
        for ( let i = 0; i < this.state.data.length; i++ ) {
            if ( this.state.data[ i ].id !== shopItem.id ) {
                data.push( this.state.data[ i ] );
            }
        }
        this.setState( { data: data } )
    };

    render() {
        let haveData = false;
        if ( this.state.data && this.state.data.length > 0 ) {
            haveData = true;
        }
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                {
                    this.state.err ?
                        <Text
                            style={[
                                commonStyles.errorTipStyle
                            ]}>
                            {this.state.err}
                        </Text>
                        :
                        null
                }
                {haveData ?
                    <FlatList
                        renderItem={this._renderItem}
                        data={this.state.data}
                        onEndReached={this.onEndReached.bind( this )}
                        keyExtractor={( item, index ) => {
                            return index;
                        }}
                        style={
                            {
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 10
                            }
                        }>
                    </FlatList>
                    :
                    <View
                        style={
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                        <Text style={commonStyles.emptyTipStyle}>
                            {I18n.t( Keys.empty_fav_shop )}
                        </Text>
                    </View>
                }
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
        )
    }
}

export default FavoritesShopPageView;
