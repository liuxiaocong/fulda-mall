import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import getDirections from "react-native-google-maps-directions";
import commonStyles from "../../../styles/commonStyles";
import StarComponent from "../../../components/StarComponent";
import Util from "../../../util/Util";
import { connect } from "react-redux";
import format from "string-format";
import { netMemberEditFavorites } from "../../../net/MemberNet";
import * as UtilConfig from "../../../configs/UtilConfig";
import Keys from "../../../configs/Keys";
import I18n from "../../../I18n";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class FavShopItem extends React.Component {
    static propTypes = {
        business: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        containerStyle: View.propTypes.style,
        onUnFavoritesSuccess: React.PropTypes.func,
    };

    constructor( props ) {
        super( props );
    }

    renderNavigationView() {
        let location = this.props.business.location;
        if ( !location && this.props.business.lat ) {
            location = { lat: this.props.business.lat, lng: this.props.business.lng }
        }
        //noinspection JSCheckFunctionSignatures
        return (
            this.props.location && location ?
                <TouchableHighlight
                    underlayColor='#ddd'
                    onPress={() => {
                        const data = {
                            source: {
                                latitude: this.props.location.latitude,
                                longitude: this.props.location.longitude
                            },
                            destination: {
                                latitude: location.lat,
                                longitude: location.lng,
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
                                    Util.getDistanceDescription( this.props.location.latitude, this.props.location.longitude, location.lat, location.lng )
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

    renderCancelFavorites() {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( !this.props.isLoggedIn ) {
                        this.props.navigation.navigate( 'loginPage' );
                    } else {
                        netMemberEditFavorites( this.props.business.id, UtilConfig.FAV_TYPE_SHOP, 0, true, ( err, res ) => {
                            if ( !err ) {
                                Toast.show( I18n.t( Keys.un_favorite_success ) );
                                if ( this.props.onUnFavoritesSuccess ) {
                                    this.props.onUnFavoritesSuccess( this.props.business )
                                }
                            } else {
                                Toast.show( I18n.t( Keys.un_favorite_fail ) + ': ' + err.message );
                            }
                        } )
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
                            width: 15,
                            height: 15
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
        return (
            <TouchableOpacity style={[
                commonStyles.wrapper,
                commonStyles.inputTextGroupStyle, {
                    backgroundColor: 'white',
                },
                this.props.containerStyle
            ]}
                              underlayColor='#ddd'
                              onPress={() => {
                                  this.props.navigation.navigate( 'shopDetailPage', {
                                      data: this.props.business,
                                      dataId: this.props.business.id,
                                      location: this.props.location
                                  } );
                              }}>
                <View
                    style={[
                        commonStyles.wrapper,
                        {
                            overflow: 'hidden'
                        }
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
                                    style={[ {
                                        width: 100,
                                        height: 100
                                    }
                                    ]}
                                    placeholderForIcon={'md-image'}
                                    source={this.props.business.logo ? { uri: this.props.business.logo } : null}/>
                            </View>

                            <View style={[ commonStyles.wrapper, { marginLeft: 10 } ]}>
                                <Text style={[ {
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    paddingTop: 0,
                                    paddingBottom: 0
                                }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                    {this.props.business.name}
                                </Text>
                                <View
                                    style={[ {
                                        flexDirection: 'row',
                                        marginTop: 4
                                    } ]}>
                                    <Text
                                        style={[ {
                                            fontSize: 13, fontWeight: 'bold',
                                        }, commonStyles.commonTextColorStyle ]} numberOfLines={1}>
                                        {I18n.t( Keys.classification_title )}
                                        <Text
                                            style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal', } ]}>
                                            {this.props.business.name}
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
                                        starCount={this.props.business && this.props.business.statistics ? this.props.business.statistics.goodRate / 100 * 5 : 0}/>
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
                                            {'' + this.props.business.goodsCount}
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
                                                this.props.business.discount
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
                                    {this.props.business.business}
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
                                    {this.props.business.intro}
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
                        {this.renderCancelFavorites()}
                    </View>
                    {this.props.business.close &&
                    <Text style={{
                        color: '#e72545',
                        fontSize: 11,
                        position: 'absolute',
                        backgroundColor: '#f1f3f5',
                        marginLeft: -15,
                        marginTop: 10,
                        width: 60,
                        transform: [ { rotate: '-45deg' } ],
                        textAlign: 'center'
                    }}>
                        {I18n.t( Keys.already_close )}
                    </Text>
                    }
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
    return { isLoggedIn: store.userStore.isLoggedIn }
}
export default connect( select )( FavShopItem );