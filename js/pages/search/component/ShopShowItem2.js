import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import Icon from "react-native-vector-icons/Ionicons";
import getDirections from "react-native-google-maps-directions";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import StarComponent from "../../../components/StarComponent";
import Util from "../../../util/Util";
import { connect } from "react-redux";
import format from "string-format";
import { netMemberEditFavorites } from "../../../net/MemberNet";
import * as UtilConfig from "../../../configs/UtilConfig";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class ShopShowItem2 extends React.Component {
    static propTypes = {
        shop: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        containerStyle: View.propTypes.style,
        onDoFavorites: React.PropTypes.func,
        onDoUnFavorites: React.PropTypes.func,
        onFavoritesSuccess: React.PropTypes.func,
        onUnFavoritesSuccess: React.PropTypes.func,
    };

    constructor( props ) {
        super( props );
    }

    renderNavigationView() {
        //noinspection JSCheckFunctionSignatures
        return (
            this.props.location && this.props.shop.location ?
                <TouchableHighlight
                    underlayColor='#ddd'
                    onPress={() => {
                        const data = {
                            source: {
                                latitude: this.props.location.latitude,
                                longitude: this.props.location.longitude
                            },
                            destination: {
                                latitude: this.props.shop.location.lat,
                                longitude: this.props.shop.location.lon,
                            },
                            params: [
                                {
                                    key: "dirflg",
                                    value: "w"
                                }
                            ]
                        };

                        getDirections( data );
                    }}
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                        paddingLeft: 10,
                        paddingRight: 10,
                        height: 44
                    } ]}>
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                            },
                            commonStyles.wrapper,
                        ]}>

                        <Image
                            style={{
                                width: 13,
                                height: 16
                            }}
                            source={require( '../../../imgs/ic_position.png' )}/>
                        <Text
                            style={[ commonStyles.wrapper, { fontSize: 13, color: '#717789', marginLeft: 7 } ]}>
                            {
                                format(
                                    I18n.t( Keys.distance_description ),
                                    Util.getDistanceDescription( this.props.location.latitude, this.props.location.longitude, this.props.shop.lat, this.props.shop.lng )
                                )
                            }
                        </Text>
                    </View>
                </TouchableHighlight>
                :
                null

        )
            ;
    }

    favorites = () => {
        if ( this.props.onDoFavorites ) {
            this.props.onDoFavorites();
        }
        netMemberEditFavorites(
            this.props.shop.id, UtilConfig.FAV_TYPE_SHOP, 0, false, ( err, res ) => {
                if ( this.props.onFavoritesSuccess ) {
                    this.props.onFavoritesSuccess();
                }

                if ( err ) {
                    Toast.show( I18n.t( Keys.favorite_fail ) + ': ' + err.message );
                } else {
                    Toast.show( I18n.t( Keys.favorite_success ) );
                }
            }
        )
    };

    unFavorites = () => {
        if ( this.props.onDoUnFavorites ) {
            this.props.onDoUnFavorites();
        }
        netMemberEditFavorites(
            this.props.shop.id, UtilConfig.FAV_TYPE_SHOP, 0, true, ( err, res ) => {
                if ( this.props.onUnFavoritesSuccess ) {
                    this.props.onUnFavoritesSuccess();
                }

                if ( err ) {
                    Toast.show( I18n.t( Keys.un_favorite_fail ) + ': ' + err.message );
                } else {
                    Toast.show( I18n.t( Keys.un_favorite_success ) );
                }
            }
        )
    };

    renderAddFavorites() {
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( !this.props.isLoggedIn ) {
                        this.props.navigation.navigate( 'loginPage' );
                    } else {
                        this.favorites();
                    }
                }}
                style={[ commonStyles.wrapper, {
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: 44,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                } ]}>

                <View
                    style={[
                        commonStyles.wrapper,
                        commonStyles.justAlignCenter,
                        {
                            flexDirection: 'row',
                        }
                    ]}
                >
                    <Icon
                        name={'md-heart'}
                        size={16}
                        color={'#c3c6d0'}
                    />

                    <Text
                        style={[ { fontSize: 13, color: '#717789', marginLeft: 7 } ]}>
                        {I18n.t( Keys.favorite )}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderRemoveFavorites() {
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( !this.props.isLoggedIn ) {
                        this.props.navigation.navigate( 'loginPage' );
                    } else {
                        this.unFavorites();
                    }
                }}
                style={[ commonStyles.wrapper, {
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: 44,
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                } ]}>

                <View
                    style={[
                        commonStyles.wrapper,
                        commonStyles.justAlignCenter,
                        {
                            flexDirection: 'row',
                        }
                    ]}
                >
                    <Image
                        style={{
                            width: 16,
                            height: 16
                        }}
                        source={require( '../../../imgs/ic_collection_cancel.png' )}/>

                    <Text
                        style={[ { fontSize: 13, color: '#717789', marginLeft: 7 } ]}>
                        {I18n.t( Keys.un_favorite )}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }


    render() {
        let isFav = false;
        if ( this.props.favoriteShopIds !== null && this.props.favoriteShopIds.includes( this.props.shop.id ) ) {
            isFav = true;
        }
        return (
            <TouchableOpacity style={[
                commonStyles.wrapper,
                commonStyles.inputTextGroupStyle, {
                    height: 238,
                    backgroundColor: 'white',
                },
                this.props.containerStyle
            ]}
                              underlayColor='#ddd'
                              onPress={() => {
                                  this.props.navigation.navigate( 'shopDetailPage', {
                                      data: this.props.shop,
                                      dataId: this.props.shop.id,
                                      location: this.props.location
                                  } );
                              }}>
                <View
                    style={[
                        commonStyles.wrapper,
                    ]}>
                    <View style={[
                        {
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 10,
                            height: 194,
                        }
                    ]}>
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    backgroundColor: 'transparent'
                                }
                            ]}>
                            <View
                                style={[ {
                                    width: 100,
                                    height: 100
                                }
                                ]}>
                                <ImageWithPlaceHolder
                                    style={{
                                        width: 100,
                                        height: 100
                                    } }
                                    placeholderForIcon={'md-image'}
                                    source={this.props.shop.logo ? { uri: this.props.shop.logo } : null}
                                />
                            </View>

                            <View style={[ commonStyles.wrapper, { marginLeft: 10 } ]}>
                                <Text style={[ {
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    paddingTop: 0,
                                    paddingBottom: 0
                                }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                    {this.props.shop.name}
                                </Text>
                                <View
                                    style={[ {
                                        flexDirection: 'row',
                                        marginTop: 4
                                    } ]}>
                                    <Text
                                        style={[ {
                                            fontSize: 13, fontWeight: 'bold'
                                        }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                        {I18n.t( Keys.classification_title )}
                                        <Text
                                            style={[ { fontSize: 13, color: '#ffc515', fontWeight: 'normal', } ]}>
                                            {this.props.shop.name}
                                        </Text>
                                    </Text>

                                </View>
                                <View
                                    style={[ {
                                        flexDirection: 'row',
                                        marginTop: 4,
                                        alignItems: 'center',
                                    } ]}>
                                    <Text
                                        style={[ {
                                            fontSize: 13, fontWeight: 'bold',
                                        }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                        {I18n.t( Keys.credit_title )}
                                    </Text>
                                    <StarComponent
                                        starCount={this.props.shop && this.props.shop.statistics ? this.props.shop.statistics.goodRate / 100 * 5 : 0}/>
                                </View>

                                <View
                                    style={[ {
                                        flexDirection: 'row',
                                        backgroundColor: 'transparent',
                                        marginTop: 4
                                    } ]}>
                                    <Text
                                        style={[ {
                                            fontSize: 13, fontWeight: 'bold',
                                        }, commonStyles.commonTextColorStyle ]}
                                        numberOfLines={1}>
                                        {I18n.t( Keys.service_account_title )}
                                        <Text
                                            style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal' } ]}>
                                            {'' + this.props.shop.goodsCount}
                                        </Text>
                                    </Text>
                                </View>

                                <View
                                    style={[ {
                                        flexDirection: 'row',
                                        backgroundColor: 'transparent',
                                        marginTop: 4
                                    } ]}>
                                    <Text
                                        style={[ {
                                            fontSize: 13, fontWeight: 'bold',
                                        }, commonStyles.commonTextColorStyle ]}>
                                        {
                                            format(
                                                I18n.t( Keys.fulda_rewards_credit_support_value ),
                                                this.props.shop.discount
                                            )
                                        }
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={[ {
                                flexDirection: 'row',
                                marginTop: 10,
                                backgroundColor: 'transparent'
                            } ]}>
                            <Text
                                style={[ {
                                    fontSize: 13, fontWeight: 'bold',
                                }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                {I18n.t( Keys.main_business_title )}
                                <Text
                                    style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal' } ]}>
                                    {this.props.shop.business}
                                </Text>
                            </Text>

                        </View>

                        <View
                            style={[ {
                                flexDirection: 'row',
                                marginTop: 5,
                                backgroundColor: 'transparent'
                            } ]}>
                            <Text
                                style={[ {
                                    fontSize: 13, fontWeight: 'bold',
                                }, commonStyles.commonTextColorStyle ]} numberOfLines={2}>
                                {I18n.t( Keys.description_title )}
                                <Text
                                    style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal' } ]}>
                                    {this.props.shop.intro}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <View style={[ commonStyles.commonIntervalStyle ]}/>

                    <View
                        style={[
                            commonStyles.justAlignCenter, {
                                flexDirection: 'row',
                                height: 44
                            }
                        ]}>
                        {this.renderNavigationView()}
                        {
                            isFav
                                ?
                                this.renderRemoveFavorites()
                                :
                                this.renderAddFavorites()}
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#0000007f'
        }
    }
);

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        favoriteShopIds: store.userStore.favoriteShopIds
    }
}
export default  connect( select )( ShopShowItem2 );