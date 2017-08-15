import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import getDirections from "react-native-google-maps-directions";
import I18n from "../../../I18n";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import StarComponent from "../../../components/StarComponent";
import Util from "../../../util/Util";
import format from "string-format";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class ShopShowItem1 extends React.Component {
    static propTypes = {
        shop: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        containerStyle: View.propTypes.style,
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
                                width: 14,
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

    render() {
        return (
            <TouchableOpacity style={[
                commonStyles.wrapper,
                {
                    borderRadius: 5,
                    backgroundColor: 'white',
                    borderColor: '#e7e7e7',
                    borderWidth: Util.getDpFromPx( 1 )
                },
                this.props.containerStyle
            ]}
                              underlayColor='#ddd'
                              onPress={() => {
                                  this.props.navigation.navigate(
                                      'shopDetailPage',
                                      {
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
                            height: 149,
                        }
                    ]}>
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    backgroundColor: 'transparent'
                                }
                            ]}>
                            <View style={[ {
                                width: 60,
                                height: 60
                            }
                            ]}>
                                <ImageWithPlaceHolder
                                    style={{
                                        width: 60,
                                        height: 60
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
                                }, commonStyles.commonTextColorStyle ]}
                                      numberOfLines={1}>{this.props.shop.name}</Text>
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
                                            style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal' } ]}>
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
                                    style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal', } ]}>
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
                                    style={[ { fontSize: 13, color: '#717789', fontWeight: 'normal', } ]}>
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
                                height: 36
                            }
                        ]}>

                        {this.renderNavigationView()}

                        <Text style={[ commonStyles.wrapper, {
                            paddingLeft: 10,
                            paddingRight: 10,
                            fontSize: 13,
                            color: '#717789',
                            textAlign: 'right'
                        } ]}>
                            {
                                format(
                                    I18n.t( Keys.fulda_rewards_credit_support_value ),
                                    this.props.shop.discount
                                )
                            }
                        </Text>
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
    return { isLoggedIn: store.userStore.isLoggedIn }
}
export default  connect( select )( ShopShowItem1 );
