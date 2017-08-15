import React from "react";
import { Share, StatusBar, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import I18n from "../../I18n";
import constStyles from "../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import CommonNavigationComponent from "../../components/CommonNavigationComponent";
import GoodsDetailHeader from "./component/GoodsDetailHeader";
import GoodsDetailDataListComponent from "./component/GoodsDetailDataListComponent";
import GoodsChooseComponent from "./component/GoodsChooseComponent";
import { memberGetFavoritesIds } from "../../actions/MemberAction";
import { netMemberEditFavorites } from "../../net/MemberNet";
import * as UtilConfig from "../../configs/UtilConfig";
import UrlActionHandlerUtil from "../../util/UrlActionHandlerUtil";
import Keys from "../../configs/Keys";
import format from "string-format";
import CartGoodsBean from "../../model/CartGoodsBean";
import orderActionTypes from "../../reducers/order/orderActionTypes";


class GoodsDetailPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params.data ? state.params.data.name : I18n.t( Keys.goods_detail ),
            header: null
        };
    };

    constructor( props ) {
        super( props );

        const tabData = [
            {
                title: I18n.t( Keys.goods_detail ),
                index: 0
            },
            {
                title: I18n.t( Keys.goods_comment ),
                index: 1
            },
            {
                title: I18n.t( Keys.done_trade_record ),
                index: 2
            },
        ];

        const service = this.props.navigation.state.params.data;

        const stockTypes = service && service.detail && service.detail.stockTypes ? service.detail.stockTypes : [];
        const stocks = service && service.detail && service.detail.stocks ? service.detail.stocks : {};

        this.state = {
            business: null,
            service: service,
            serviceId: this.props.navigation.state.params.dataId,
            location: this.props.navigation.state.params.location,
            tabData: tabData,
            favoriteGoodsIds: this.props.favoriteGoodsIds,
            tab: tabData[ 0 ],
            menuData: [
                {
                    title: I18n.t( Keys.shop_detail ),
                    index: 0
                },
                {
                    title: I18n.t( Keys.goods_qrcode ),
                    index: 1
                },
                {
                    title: I18n.t( Keys.share_shop ),
                    index: 2
                },
            ],
            serviceChooseComponentIsOpen: false,
            stockTypes: stockTypes,
            stocks: stocks,
            currentStockSelectTypes: GoodsDetailPage.calcStockSelectTypes( stockTypes ),
            currentStockSelectCount: 0,
        };
        this._operation = this.renderOperation();
        this._navigationComponent = this.renderNavigationComponent();
    }

    componentWillMount() {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ( nextState.service !== this.state.service ) {

        }
        nextState.favoriteGoodsIds = nextProps.favoriteGoodsIds;
        return true;
    }

    static calcStockSelectTypes( stockTypes ) {
        const currentStockSelectTypes = [];

        for ( let index = 0; index < stockTypes.length; index++ ) {
            currentStockSelectTypes.push(
                {
                    key: stockTypes[ index ].key,
                    value: null
                }
            );
        }

        return currentStockSelectTypes;
    }

    checkStockSelect() {
        for ( let index = 0; index < this.state.currentStockSelectTypes.length; index++ ) {
            if ( this.state.currentStockSelectTypes[ index ].value === null ) {
                Toast.show( I18n.t( Keys.plz_select ) + ": " + this.state.currentStockSelectTypes[ index ].key );

                return false;
            }
        }

        if ( this.state.currentStockSelectCount <= 0 ) {
            Toast.show( I18n.t( Keys.plz_select_goods_count ) );

            return false;
        }

        return true;

    }

    addIntoFav() {
        if ( !this.props.isLoggedIn ) {
            this.props.navigation.navigate( 'loginPage' );
        } else {
            netMemberEditFavorites(
                this.state.serviceId, UtilConfig.FAV_TYPE_GOODS, 0, false, ( err, res ) => {
                    if ( err ) {
                        Toast.show( I18n.t( Keys.favorite_fail ) + ': ' + err.message );
                    } else {
                        this.props.dispatch( memberGetFavoritesIds( null ) );
                        Toast.show( I18n.t( Keys.favorite_success ) );
                    }
                }
            )
        }
    }

    unFav() {
        if ( !this.props.isLoggedIn ) {
            this.props.navigation.navigate( 'loginPage' );
        } else {
            netMemberEditFavorites(
                this.state.serviceId, UtilConfig.FAV_TYPE_GOODS, 0, true, ( err, res ) => {
                    if ( err ) {
                        Toast.show( I18n.t( Keys.un_favorite_fail ) + ': ' + err.message );
                    } else {
                        this.props.dispatch( memberGetFavoritesIds( null ) );
                        Toast.show( I18n.t( Keys.un_favorite_success ) );
                    }
                }
            )
        }
    }

    renderOperationButton( flex, backgroundColor, textColor, title, onPress ) {
        return (
            <Button
                containerStyle={[
                    commonStyles.buttonContainerStyle, {
                        flex: flex,
                        borderRadius: 0,
                        backgroundColor: backgroundColor,
                        marginTop: 0,
                        height: 50
                    }
                ]}
                style={[ commonStyles.buttonContentStyle, {
                    fontSize: 13,
                    color: textColor
                } ]}
                onPress={() => {
                    if ( onPress ) {
                        onPress();
                    }
                }} title="">
                {title}
            </Button>
        );
    }

    renderOperation() {
        let isFav = false;
        if ( this.state.favoriteGoodsIds !== null && this.state.favoriteGoodsIds.includes( this.state.serviceId ) ) {
            isFav = true;
        }
        return (
            <View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[ commonStyles.justAlignCenter, { flexDirection: 'row', } ]}>

                    {
                        this.renderOperationButton(
                            74, 'white', '#616775', I18n.t( Keys.shop ), () => {
                                if ( this.state.service ) {
                                    this.props.navigation.navigate(
                                        'shopDetailPage', {
                                            data: this.state.business,
                                            dataId: this.state.service.shopId,
                                            location: this.state.location
                                        }
                                    );
                                }
                            }
                        )
                    }

                    <View style={[ commonStyles.commonIntervalStyle, {
                        width: 1,
                        height: 27,
                        backgroundColor: '#e7e7e7'
                    } ]}/>

                    {
                        isFav ?
                            this.renderOperationButton(
                                74, 'white', '#616775', I18n.t( Keys.un_favorite ), () => {
                                    this.unFav();
                                }
                            )
                            :
                            this.renderOperationButton(
                                74, 'white', '#616775', I18n.t( Keys.favorite ), () => {
                                    this.addIntoFav();
                                }
                            )
                    }

                    {
                        this.renderOperationButton( 112, '#ea5050', 'white', I18n.t( Keys.buy_immediately ), () => {
                            if ( !this.props.isLoggedIn ) {
                                this.props.navigation.navigate( 'loginPage' );
                            } else {
                                if ( this.checkStockSelect() ) {
                                    //Toast.show( I18n.t(Keys.buy_immediately) );
                                    let shopObject = this.state.business;
                                    let goodObject = this.state.service;
                                    let cartGoodsBean = new CartGoodsBean(
                                        goodObject.id,
                                        goodObject.shopId,
                                        goodObject.logo,
                                        goodObject.name,
                                        goodObject.displayCurrency,
                                        goodObject.displayPrice,
                                        this.state.currentStockSelectCount,
                                        this.state.currentStockSelectTypes,
                                        goodObject
                                    );
                                    //to do
                                    if ( !shopObject ) {
                                        shopObject = { id: goodObject.shopId }
                                    }
                                    this.props.dispatch( {
                                        'type': orderActionTypes.ADD_TO_SHOPPING_CART,
                                        shop: shopObject,
                                        cartGoodsBean: cartGoodsBean
                                    } );
                                    Toast.show( I18n.t( Keys.add_to_shopping_cart_success ) );
                                    this.props.navigation.navigate( "checkOutPage" );
                                    //to do create order?
                                }
                            }
                        } )
                    }

                    {
                        this.renderOperationButton( 112, constStyles.THEME_COLOR, 'white', I18n.t( Keys.add_to_shopping_cart ), () => {
                            if ( !this.props.isLoggedIn ) {
                                this.props.navigation.navigate( 'loginPage' );
                            } else {
                                if ( this.checkStockSelect() ) {
                                    //Toast.show(stockSelectTypesStr);
                                    let shopObject = this.state.business;
                                    let goodObject = this.state.service;
                                    let cartGoodsBean = new CartGoodsBean(
                                        goodObject.id,
                                        goodObject.shopId,
                                        goodObject.logo,
                                        goodObject.name,
                                        goodObject.displayCurrency,
                                        goodObject.displayPrice,
                                        this.state.currentStockSelectCount,
                                        this.state.currentStockSelectTypes,
                                        goodObject
                                    );
                                    //to do
                                    if ( !shopObject ) {
                                        shopObject = { id: goodObject.shopId }
                                    }
                                    this.props.dispatch( {
                                        'type': orderActionTypes.ADD_TO_SHOPPING_CART,
                                        shop: shopObject,
                                        cartGoodsBean: cartGoodsBean
                                    } );
                                    Toast.show( I18n.t( Keys.add_to_shopping_cart_success ) );
                                }
                            }
                        } )
                    }
                </View>
            </View>
        );
    }

    renderHeader() {
        return (<GoodsDetailHeader
            onTabSelect={( tab ) => {
                this.setState( {
                    tab: tab
                } );
            }}
            onServiceChoose={() => {
                this.setState( {
                    serviceChooseComponentIsOpen: true
                } );
            }}
            tabData={this.state.tabData}
            tab={this.state.tab}
            service={this.state.service}
            location={this.state.location}
        />);
    }

    renderServiceChoose() {
        return (
            <GoodsChooseComponent
                onSelect={( currentStockSelectTypes, currentStockSelectCount ) => {
                    this.setState( {
                        currentStockSelectTypes: currentStockSelectTypes,
                        currentStockSelectCount: currentStockSelectCount,
                    } );


                    let stockSelectTypesStr = '';
                    for ( let index = 0; index < currentStockSelectTypes.length; index++ ) {
                        stockSelectTypesStr += currentStockSelectTypes[ index ].key + ':' + currentStockSelectTypes[ index ].value + '; ';
                    }
                    format( I18n.t( Keys.your_select_s_count_is_s ), stockSelectTypesStr, currentStockSelectCount );
                }}
                onClose={() => {
                    this.setState( {
                        serviceChooseComponentIsOpen: false
                    } );
                }}
                isOpen={this.state.serviceChooseComponentIsOpen}
                stockTypes={this.state.stockTypes}
                stocks={this.state.stocks}
                currentStockSelectTypes={this.state.currentStockSelectTypes}
                currentStockSelectCount={this.state.currentStockSelectCount}
            />
        );
    }

    renderNavigationComponent() {
        return (
            <CommonNavigationComponent
                navigation={this.props.navigation}
                menuData={this.state.menuData}
                onSelectMenu={( menu ) => {
                    if ( menu.index === 0 ) {
                        if ( this.state.service ) {
                            this.props.navigation.navigate( 'shopDetailInfoPage', {
                                data: this.state.business,
                                dataId: this.state.service.shopId,
                                location: this.state.location
                            } );
                        }
                    } else if ( menu.index === 1 ) {
                        this.props.navigation.navigate( 'goodsQRCodePage', {
                            data: this.state.service,
                            dataId: this.state.serviceId
                        } );
                    } else if ( menu.index === 2 ) {
                        //noinspection JSCheckFunctionSignatures
                        Share.share( {
                            message: I18n.t( Keys.download_fulda_at_once ),
                            url: UrlActionHandlerUtil.genGoodsUrl( this.state.serviceId, this.state.service ? this.state.service.shopId : null ),
                            title: this.state.service ? this.state.service.name : I18n.t( Keys.app_name )
                        }, {
                            dialogTitle: I18n.t( Keys.app_name ),
                            excludedActivityTypes: [],
                            tintColor: constStyles.THEME_COLOR
                        } )
                            .then( ( result ) => {
                                if ( result.action === Share.sharedAction ) {
                                    if ( result.activityType ) {
                                        console.log( 'shared with an activityType: ' + result.activityType );
                                    } else {
                                        console.log( 'Shared success!' );
                                    }
                                } else if ( result.action === Share.dismissedAction ) {
                                    console.log( 'dismissed' );
                                }
                            } )
                            .catch( ( error ) => {
                                Toast.show( error.message );
                            } );
                    }
                }}
            />
        );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, { backgroundColor: 'white', }
                ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_LIGHT}
                    translucent={true}
                    backgroundColor='#00000000'
                />

                <GoodsDetailDataListComponent
                    getPageHeader={() => {
                        return this.renderHeader();
                    }}
                    onScroll={() => {

                    }}
                    onRefreshData={( service, business ) => {
                        const stockTypes = service && service.detail && service.detail.stockTypes ? service.detail.stockTypes : [];
                        const stocks = service && service.detail && service.detail.stocks ? service.detail.stocks : {};

                        this.setState( {
                            service: service,
                            business: business,
                            stockTypes: stockTypes,
                            stocks: stocks,
                            currentStockSelectTypes: GoodsDetailPage.calcStockSelectTypes( stockTypes ),
                            currentStockSelectCount: 0,
                        } );

                        this.props.navigation.setParams( { data: service } );
                    }}
                    business={this.state.business}
                    service={this.state.service}
                    serviceId={this.state.serviceId}
                    tab={this.state.tab}
                />

                {this.renderOperation()}

                {this.renderServiceChoose()}

                {this._navigationComponent}
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, favoriteGoodsIds: store.userStore.favoriteGoodsIds }
}

export default connect( select )( GoodsDetailPage );
