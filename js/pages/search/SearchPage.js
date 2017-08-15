import React from "react";
import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import FDLocationServices from "../../FDNativePackage/FDLocationServices";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import format from "string-format";
import constStyles from "../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import SearchBar from "../../components/SearchBar";
import ShopShowItem from "./component/ShopShowItem2";
import GoodsShowItem from "./component/GoodsShowItem";
import SearchHistoryComponent from "./component/SearchHistoryComponent";
import { shopGoodsSearch, shopSearch } from "../../actions/ShopAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";


class SearchPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.search ),
            header: null
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            location: null,
            isSearchHistoryOpen: false,
            hasData: false,
            goodsTotalCount: 0,
            goods: [],
            showGoods: [],
            hasGoods: false,
            hasGoodsMoreData: false,
            shopTotalCount: 0,
            shops: [],
            hasShop: false,
            hasShopMoreData: false,
            baseQueryData: null,
            isRequesting: false,
        };
    }

    componentDidMount() {
        // this._searchBar.setTextWithSubmit( '复古铁艺蝴蝶组合壁饰装饰画壁挂画家饰' );
    }

    searchByKeyword( keyword ) {
        this.setState(
            {
                isRequesting: true
            }
        );

        this.loadData(
            keyword, ( err1, err2, shopTotalCount, shops, goodsTotalCount, goods ) => {
                let errMsg = '';

                if ( err1 ) {
                    errMsg += err1.message;
                }

                if ( err2 ) {
                    errMsg += err2.message;
                }

                if ( errMsg ) {
                    Toast.show( errMsg );
                }
                const hasGoods = goods && goods.length > 0;
                const hasShop = shops && shops.length > 0;

                const hasGoodsMoreData = goods && goods.length >= 20;
                const hasShopMoreData = shops && shops.length >= 20;

                const showGoods = [];
                for ( let index = 0; index < goods.length && index < 2; index++ ) {
                    showGoods.push( goods[ index ] );
                }

                this.setState(
                    {
                        hasData: hasGoods || hasShop,
                        goodsTotalCount: goodsTotalCount,
                        goods: goods,
                        showGoods: showGoods,
                        hasGoods: hasGoods,
                        hasGoodsMoreData: hasGoodsMoreData,
                        shopTotalCount: shopTotalCount,
                        shops: shops,
                        hasShop: hasShop,
                        hasShopMoreData: hasShopMoreData,
                        isRequesting: false,
                    }
                );

            }
        );
    }

    loadData( keyword, callback ) {
        FDLocationServices
            .getCurrentLocation( {} )

            .then(
                ( location ) => {
                    this
                        .setState( {
                                location: location,
                                baseQueryData: {
                                    lat: location

                                        .latitude
                                    ,
                                    lng: location.longitude
                                    ,
                                    keyword: keyword
                                    ,
                                    pageSize: 20
                                    ,
                                    pageNum: 0
                                }
                            }
                        )
                    ;

                    this.props.dispatch(
                        shopSearch(
                            {
                                lat: location.latitude,
                                lng: location.longitude,
                                keyword: keyword,
                                pageSize: 20,
                                pageNum: 0
                            },
                            ( errForBusiness, resForBusiness ) => {
                                this.props.dispatch(
                                    shopGoodsSearch(
                                        {
                                            lat: location.latitude,
                                            lng: location.longitude,
                                            keyword: keyword,
                                            pageSize: 20,
                                            pageNum: 0
                                        },
                                        ( errForService, resForService ) => {
                                            callback( errForBusiness, errForService, !errForBusiness ? resForBusiness.info : 0, !errForBusiness ? resForBusiness.data : null, !errForService ? resForService.info : 0, !errForService ? resForService.data : null );
                                        }
                                    )
                                );
                            }
                        )
                    );
                }
            )
            .catch(
                ( error ) => {
                    callback( Error( I18n.t( Keys.failed_to_get_location ) ), null, 0, null, 0, null );
                }
            );
    }

    renderSearchHeader() {
        return (
            <View style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 7,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 10,
                    backgroundColor: 'white',
                },
            ]}>
                <SearchBar
                    style={[ {
                        flex: 1,
                    } ]}
                    ref={( searchBar ) => {
                        this._searchBar = searchBar;
                    }}
                    onlyShow={false}
                    autoFocus={true}
                    placeholder={I18n.t( Keys.search_tip )}
                    onSearchChange={( text ) => {
                        console.log( "onSearchChange text = " + text );
                    }}
                    onEndEditing={( text ) => {
                        console.log( "onEndEditing text = " + text );
                    }}
                    onSubmitEditing={( text ) => {
                        // console.log( "onSubmitEditing text = " + text );
                        // hijasgdhgadhasd

                        if ( text && text.length > 0 ) {
                            this.searchByKeyword( text );
                        }

                    }}
                    onClose={() => {
                        this.props.navigation.goBack();
                    }}
                    onStartSearch={() => {
                        console.log( "onStartSearch" );
                    }}
                    onFocus={() => {
                        this.setState( {
                            isSearchHistoryOpen: true
                        } );
                    }}
                    onBlur={() => {
                        this.setState( {
                            isSearchHistoryOpen: false
                        } );
                    }}
                />
            </View>
        )
            ;
    }


    renderBusinessResult() {
        return (
            this.state.hasShop ?
                (
                    <View style={[ { marginTop: 25 } ]}>
                        <Text style={[
                            {
                                marginLeft: 15,
                                marginRight: 15,
                                fontSize: 12,
                                color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR
                            }
                        ]}>
                            {format( I18n.t( Keys.search_shop_result ), this.state.shopTotalCount )}
                        </Text >
                        < ShopShowItem
                            {...this.props}
                            shop={this.state.shops[ 0 ]}
                            location={this.state.location}
                            onDoFavorites={() => {
                                this.setState( { isRequesting: true } )
                            }}
                            onFavoritesSuccess={() => {
                                this.setState( { isRequesting: false } )
                            }}
                            containerStyle={[
                                {
                                    marginLeft: 10,
                                    marginRight: 10,
                                    marginTop: 5,
                                }
                            ]}/>

                        <Button
                            style={[
                                {
                                    fontSize: 14,
                                    color: constStyles.THEME_COLOR,
                                    marginTop: 20
                                }
                            ]}
                            onPress={() => {
                                this.props.navigation.navigate(
                                    'searchShopPage',
                                    {
                                        baseQueryData: this.state.baseQueryData,
                                        data: this.state.shops,
                                        location: this.state.location,
                                        hasMoreData: this.state.hasShopMoreData
                                    } );
                            }} title="">
                            {I18n.t( Keys.more )}
                        </Button>
                    </View>
                )
                :
                null);
    }

    renderServiceResult() {
        const serviceItemSeparatorWidth = 10;
        const serviceItemWidth = (Dimensions.get( 'window' ).width - 30) / 2;
        const serviceItemHeight = serviceItemWidth + 55;

        return (
            this.state.hasGoods ?
                (
                    <View style={[ { marginTop: 25 } ]}>
                        <Text style={[
                            {
                                marginLeft: 15,
                                marginRight: 15,
                                fontSize: 12,
                                color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR
                            }
                        ]}>
                            {format( I18n.t( Keys.search_goods_result ), this.state.goodsTotalCount )}
                        </Text>


                        <FlatList
                            style={[ {
                                width: Dimensions.get( 'window' ).width - 20,
                                marginTop: 5,
                                marginLeft: 10,
                                marginRight: 10,
                            } ]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.showGoods}
                            keyExtractor={( item, index ) => {
                                return index;
                            }}
                            renderItem={( { item, index } ) => {
                                return (<GoodsShowItem
                                    {...this.props}
                                    goods={item}
                                    containerStyle={[
                                        {
                                            width: serviceItemWidth,
                                        }
                                    ]}
                                    imageHeight={serviceItemWidth}
                                />);
                            }}
                            ItemSeparatorComponent={() => {
                                return <View style={[ { width: serviceItemSeparatorWidth } ]}/>
                            }}
                            getItemLayout={( data, index ) => (
                                {
                                    length: serviceItemWidth,
                                    offset: (serviceItemWidth + serviceItemSeparatorWidth) * index,
                                    index
                                }
                            )}
                        />

                        <Button
                            style={[
                                {
                                    fontSize: 14,
                                    color: constStyles.THEME_COLOR,
                                    marginTop: 20,
                                    marginBottom: 10
                                }
                            ]}
                            onPress={() => {
                                this.props.navigation.navigate(
                                    'searchGoodsPage',
                                    {
                                        baseQueryData: this.state.baseQueryData,
                                        data: this.state.goods,
                                        location: this.state.location,
                                        hasMoreData: this.state.hasGoodsMoreData
                                    } );
                            }} title="">
                            {I18n.t( Keys.more )}
                        </Button>
                    </View>
                )
                :
                null
        );

    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, {
                backgroundColor: 'white',
                paddingTop: constStyles.STATE_BAR_HEIGHT
            }, ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={true}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                {
                    this.renderSearchHeader()
                }

                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <View style={[ commonStyles.wrapper, ]}>
                    <ScrollView style={[ commonStyles.wrapper, ]}>
                        <View>
                            {
                                this.renderBusinessResult()
                            }

                            {
                                this.renderServiceResult()
                            }

                        </View>

                    </ScrollView>

                    <SearchHistoryComponent
                        style={[ {} ]}
                        ref={( searchHistoryComponent ) => {
                            this._searchHistoryComponent = searchHistoryComponent;
                        }}
                        isOpen={this.state.isSearchHistoryOpen}
                        onSearch={
                            ( keyword ) => {
                                this._searchBar.setTextWithSubmit( keyword );
                            }
                        }
                        onClose={
                            () => {
                                this._searchBar.blur();
                            }
                        }
                    />
                </View>


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
            ;
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status }
}

export default  connect( select )( SearchPage );
