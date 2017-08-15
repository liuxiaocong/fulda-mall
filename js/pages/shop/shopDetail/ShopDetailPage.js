import React from "react";
import { Share, StatusBar, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import GoodsList from "../../search/component/GoodsList";
import ShopDetailHeader from "./component/ShopDetailHeader";
import CommonNavigationComponent from "../../../components/CommonNavigationComponent";
import { shopGet, shopGoodsList } from "../../../actions/ShopAction";
import UrlActionHandlerUtil from "../../../util/UrlActionHandlerUtil";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class ShopDetailPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params.data ? state.params.data.name : I18n.t( Keys.shop_detail ),
            header: null
        };
    };

    constructor( props ) {
        super( props );


        const menuData = [
            {
                title: I18n.t( Keys.shop_detail ),
                index: 0
            },
            {
                title: I18n.t( Keys.shop_qrcode ),
                index: 1
            },
            {
                title: I18n.t( Keys.share_shop ),
                index: 2
            },
        ];

        const business = this.props.navigation.state.params.data;

        let tabData = [];
        let tab = null;
        if ( business ) {
            tabData = ShopDetailPage.calcTabData( business.goodsCategories );
            tab = tabData.length > 0 ? tabData[ 0 ] : null;
        }

        this.state = {
            business: this.props.navigation.state.params.data,
            businessId: this.props.navigation.state.params.dataId,
            location: this.props.navigation.state.params.location,
            isNeedRefreshData: false,
            tabData: tabData,
            tab: tab,
            menuData: menuData
        };

        this._navigationComponent = this.renderNavigationComponent();
    }

    componentWillMount() {
        this.props.dispatch(
            shopGet(
                this.state.businessId, ( err, res ) => {
                    if ( err ) {
                        Toast.show( err.message );
                    }
                    else {
                        const tabData = ShopDetailPage.calcTabData( res.data.goodsCategories );
                        const tab = tabData.length > 0 ? tabData[ 0 ] : null;

                        this.setState(
                            {
                                business: res.data,
                                tabData: tabData,
                                tab: tab,
                                isNeedRefreshData: true,
                            }
                        );

                        this.props.navigation.setParams( { data: res.data } );
                    }
                }
            )
        );
    }

    componentDidMount() {
        this.setState(
            {
                isNeedRefreshData: true,
            }
        );
    }

    static calcTabData( goodsCategories ) {
        const tabData = [];

        if ( !goodsCategories ) {
            return tabData;
        }

        for ( let index = 0; index < goodsCategories.length; index++ ) {
            tabData.push(
                {
                    title: goodsCategories[ index ].name,
                    index: index,
                }
            );
        }

        return tabData;
    }

    searchService( pageSize, pageNum, callback ) {
        return ( dispatch ) => {
            if ( this.state.tab === null ) {
                callback( null, { data: [] } );
                return;
            }

            dispatch(
                shopGoodsList(
                    this.state.businessId,
                    this.state.business.goodsCategories[ this.state.tab.index ].id,
                    pageSize,
                    pageNum,
                    ( err, res ) => {
                        if ( callback ) {
                            callback( err, res );
                        }
                    }
                )
            );
        };
    }

    renderNavigationComponent() {
        return (
            <CommonNavigationComponent
                navigation={this.props.navigation}
                menuData={this.state.menuData}
                onSelectMenu={( menu ) => {
                    if ( menu.index === 0 ) {
                        this.props.navigation.navigate(
                            'shopDetailInfoPage',
                            {
                                data: this.state.business,
                                dataId: this.state.businessId,
                                location: this.state.location
                            } );
                    } else if ( menu.index === 1 ) {
                        this.props.navigation.navigate(
                            'shopQRCodePage',
                            {
                                data: this.state.business,
                                dataId: this.state.businessId
                            } );
                    } else if ( menu.index === 2 ) {
                        //noinspection JSCheckFunctionSignatures
                        Share.share( {
                            message: I18n.t( Keys.download_fulda ),
                            url: UrlActionHandlerUtil.genShopUrl( this.state.businessId ),
                            title: this.state.business ? this.state.business.name : I18n.t( Keys.fulda_mall )
                        }, {
                            dialogTitle: I18n.t( Keys.fulda_mall ),
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

                <GoodsList style={[ commonStyles.wrapper, {} ]} {...this.props} tab={this.state.tab}
                           getSearchHeader={() => {
                               return (
                                   <ShopDetailHeader
                                       onTabSelect={( tab ) => {
                                           if ( tab !== this.state.tab ) {
                                               this.setState( {
                                                   tab: tab,
                                                   isNeedRefreshData: true,
                                               } );
                                           }
                                       }}
                                       business={this.state.business}
                                       tabData={this.state.tabData}
                                       tab={this.state.tab}
                                   />
                               );
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
                           tag={this.state.tab ? this.state.tab.title : ''}
                />

                {this._navigationComponent}
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default  connect( select )( ShopDetailPage );
