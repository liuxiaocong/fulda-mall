import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Toast from "react-native-root-toast";
import Communications from "react-native-communications";
import getDirections from "react-native-google-maps-directions";
import FDLocationServices from "../../../FDNativePackage/FDLocationServices";
import I18n from "../../../I18n";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ShopInfoComponent from "./component/ShopInfoComponent";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import StarComponent from "../../../components/StarComponent";
import { shopGet } from "../../../actions/ShopAction";
import { netMemberEditFavorites } from "../../../net/MemberNet";
import * as UtilConfig from "../../../configs/UtilConfig";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";
import Util from "../../../util/Util";
import { memberGetFavoritesIds } from "../../../actions/MemberAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";


class ShopDetailInfoPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_detail ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            business: this.props.navigation.state.params.data,
            businessId: this.props.navigation.state.params.dataId,
            location: this.props.navigation.state.params.location,
            isRequesting: false,
            favoriteShopIds: this.props.favoriteShopIds
        };
    }

    componentWillMount() {
        this.props.dispatch(
            shopGet(
                this.state.businessId, ( err, res ) => {
                    if ( err ) {
                        Toast.show( err.message );
                    }
                    else {
                        this.setState(
                            {
                                business: res.data,
                            }
                        );
                    }
                }
            )
        );
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        FDLocationServices.cancelGetLocation();
    }

    componentWillReceiveProps( nextProps ) {
        //Toast.show("update");
        this.setState(
            {
                favoriteShopIds: nextProps.favoriteShopIds
            }
        );
    }

    renderSection1() {
        return (
            <View style={[ { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[ {
                    paddingLeft: 15,
                    paddingRight: 15,
                    height: 100,
                    flexDirection: 'row'
                }, commonStyles.justAlignCenter ]}>

                    <ImageWithPlaceHolder
                        style={{
                            width: 70,
                            height: 70,
                        } }
                        placeholderForIcon={'md-image'}
                        source={this.props.business && this.props.business.logo ? { uri: this.props.business.logo } : null}/>

                    <View style={[ commonStyles.wrapper, { marginLeft: 13 } ]}>
                        <Text style={[
                            { fontSize: 16 },
                            commonStyles.commonTextColorStyle
                        ]}>
                            {this.state.business ? this.state.business.name : null}
                        </Text>
                    </View>
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <ShopInfoComponent business={this.state.business}/>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }

    renderSection2() {
        return (
            <View style={[ { marginTop: 10, backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <View style={[ {
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 12,
                    paddingBottom: 12,
                } ]}>

                    <View style={[ { flexDirection: 'row', justifyContent: 'space-between', } ]}>
                        <Text
                            style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>{I18n.t( Keys.shop_goods_match_rate )}</Text>
                        <StarComponent style={[ {} ]} starCount={
                            this.state.business && this.state.business.statistics && this.state.business.statistics.goodsMatchRate ? this.state.business.statistics.goodsMatchRate : 0
                        }/>
                    </View>

                    <View style={[ { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 } ]}>
                        <Text
                            style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>{I18n.t( Keys.shop_customer_service_rate )}</Text>
                        <StarComponent style={[ {} ]} starCount={
                            this.state.business && this.state.business.statistics && this.state.business.statistics.customerServiceRate ? this.state.business.statistics.customerServiceRate : 0
                        }/>
                    </View>

                    <View style={[ { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 } ]}>
                        <Text
                            style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>{I18n.t( Keys.shop_delivery_speed_rate )}</Text>
                        <StarComponent style={[ {} ]} starCount={
                            this.state.business && this.state.business.statistics && this.state.business.statistics.deliverySpeedRate ? this.state.business.statistics.deliverySpeedRate : 0
                        }/>
                    </View>
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }

    renderSection3() {
        return (
            <View style={[ { marginTop: 10 } ]}>
                {/*<TouchableItemComponent*/}
                {/*style={[ {} ]}*/}
                {/*title="微信二维码"*/}
                {/*onPress={() => {*/}
                {/*Toast.show( "微信二维码" );*/}
                {/*}}*/}
                {/*headerInterval={false}*/}
                {/*footerInterval={true}/>*/}
                <TouchableItemComponent
                    style={[ {} ]}
                    title={I18n.t( Keys.shop_qrcode )}
                    onPress={() => {
                        this.props.navigation.navigate(
                            'shopQRCodePage',
                            {
                                data: this.state.business,
                                dataId: this.state.businessId
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
            </View>
        );
    }

    static renderTextItem( title, content, marginTop ) {
        return (
            <Text
                style={[ {
                    fontSize: 13, fontWeight: 'bold', marginTop: marginTop
                }, commonStyles.commonTextColorStyle ]}>
                {title}
                <Text
                    style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal', } ]}>
                    {content}
                </Text>
            </Text>

        );
    }


    renderSection4() {
        return (
            <View style={[
                {
                    marginTop: 10,
                    backgroundColor: 'white',
                }
            ]}>
                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <View style={[ {
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                    paddingBottom: 15,
                } ]}>
                    {ShopDetailInfoPage.renderTextItem(
                        I18n.t( Keys.category ) + "：",
                        this.state.business ?
                            Util.getCategoryDisplay( this.state.business )
                            :
                            null,
                        0
                    )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.count ) + "：", '' + (this.state.business && this.state.business.goodsCount ? this.state.business.goodsCount : 0), 4 )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.discount ) + "：", '' + (this.state.business ? this.state.business.discount : '') + '%', 4 )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.main_business ) + "：", this.state.business ? this.state.business.business : '', 4 )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.description ) + "：", this.state.business ? this.state.business.intro : '', 4 )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.phone ) + "：", this.state.business ? this.state.business.telephone : '', 4 )}
                    {ShopDetailInfoPage.renderTextItem( I18n.t( Keys.address ) + "：", this.state.business ? (this.state.business.address + ' ' + this.state.business.postalCode) : '', 4 )}
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }

    renderOperationItem( title, onPress ) {
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( onPress ) {
                        onPress();
                    }
                }}
                style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub ]}>
                <View style={{
                    alignItems: 'center'
                }}>
                    <Text>{title}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderOperation() {
        let isFav = false;
        if ( this.state.favoriteShopIds !== null && this.state.favoriteShopIds.includes( this.state.business.id ) ) {
            isFav = true;
        }
        return (
            <View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={[
                    {
                        height: 50,
                        flexDirection: 'row',
                        backgroundColor: 'white'
                    }
                ]}>

                    {
                        this.renderOperationItem(
                            I18n.t( Keys.navigator ), () => {
                                if ( this.state.business ) {

                                    if ( this.state.location ) {
                                        const data = {
                                            source: {
                                                latitude: this.state.location.latitude,
                                                longitude: this.state.location.longitude
                                            },
                                            destination: {
                                                latitude: this.state.business.lat,
                                                longitude: this.state.business.lng,
                                            },
                                            params: [
                                                {
                                                    key: "dirflg",
                                                    value: "w"
                                                }
                                            ]
                                        };

                                        getDirections( data );
                                    } else {
                                        this.setState( { isRequesting: true } );
                                        FDLocationServices.getCurrentLocation( {} )
                                            .then( ( location ) => {
                                                this.setState( {
                                                    isRequesting: false,
                                                    location: location,
                                                } );

                                                const data = {
                                                    source: {
                                                        latitude: location.latitude,
                                                        longitude: location.longitude
                                                    },
                                                    destination: {
                                                        latitude: this.state.business.lat,
                                                        longitude: this.state.business.lng,
                                                    },
                                                    params: [
                                                        {
                                                            key: "dirflg",
                                                            value: "w"
                                                        }
                                                    ]
                                                };

                                                getDirections( data );
                                            } )
                                            .catch( ( error ) => {
                                                this.setState( { isRequesting: false } );
                                                Toast.show( I18n.t( Keys.failed_to_get_location ) )
                                            } );
                                    }
                                }
                            }
                        )
                    }

                    <View style={[
                        {
                            width: 1,
                            backgroundColor: '#e7e7e7',
                            marginTop: 12,
                            marginBottom: 12
                        }
                    ]}/>

                    {
                        this.renderOperationItem(
                            I18n.t( Keys.phone ), () => {
                                if ( this.state.business && this.state.business.telephone && this.state.business.telephone.length > 0 ) {
                                    Communications.phonecall( this.state.business.telephone, true );
                                }
                            }
                        )
                    }

                    <View style={[
                        {
                            width: 1,
                            backgroundColor: '#e7e7e7',
                            marginTop: 12,
                            marginBottom: 12
                        }
                    ]}/>

                    {
                        isFav ?
                            this.renderOperationItem(
                                I18n.t( Keys.un_favorite ), () => {
                                    if ( !this.props.isLoggedIn ) {
                                        this.props.navigation.navigate( 'loginPage' );
                                    } else {
                                        netMemberEditFavorites(
                                            this.state.business.id, UtilConfig.FAV_TYPE_SHOP, 0, true, ( err, res ) => {
                                                if ( err ) {
                                                    Toast.show( I18n.t( Keys.un_favorite_fail ) + ': ' + err.message );
                                                } else {
                                                    Toast.show( I18n.t( Keys.un_favorite_success ) );
                                                    this.props.dispatch( memberGetFavoritesIds( null ) );
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                            :
                            this.renderOperationItem(
                                I18n.t( Keys.favorite ), () => {
                                    if ( !this.props.isLoggedIn ) {
                                        this.props.navigation.navigate( 'loginPage' );
                                    } else {
                                        netMemberEditFavorites(
                                            this.state.business.id, UtilConfig.FAV_TYPE_SHOP, 0, false, ( err, res ) => {
                                                if ( err ) {
                                                    Toast.show( I18n.t( Keys.favorite_fail ) + ': ' + err.message );
                                                } else {
                                                    Toast.show( I18n.t( Keys.favorite_success ) );
                                                    this.props.dispatch( memberGetFavoritesIds( null ) );
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                    }

                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />
                <ScrollView style={[ commonStyles.wrapper, ]}>
                    <View
                        style={[
                            {
                                paddingTop: 10,
                                paddingBottom: 10
                            }
                        ]}>

                        {this.renderSection1()}

                        {this.renderSection2()}

                        {this.renderSection3()}

                        {this.renderSection4()}
                    </View>
                </ScrollView>

                {this.renderOperation()}

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

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, favoriteShopIds: store.userStore.favoriteShopIds }
}

export default  connect( select )( ShopDetailInfoPage );
