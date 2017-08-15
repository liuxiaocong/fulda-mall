import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import StarComponent from "../../../../../components/StarComponent";
import I18n from "../../../../../I18n";
import Keys from "../../../../../configs/Keys";
import ImageWithPlaceHolder from "../../../../../components/ImageWithPlaceHolder";

class OrderShopInfoComponent extends React.Component {
    static propTypes = {
        business: React.PropTypes.object,
        style: View.propTypes.style,
    };

    constructor( props ) {
        super( props );
        this.state = {
            currentSelect: null,
        };
    }

    render() {
        let item = this.props.business;
        let type = item ? item.type : 1;
        return (
            <View style={[
                {
                    flexDirection: 'row',
                    backgroundColor: '#fff'
                }, this.props.style
            ]}>
                <View
                    style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                    <ImageWithPlaceHolder
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 4
                        } }
                        placeholderForIcon={'md-image'}
                        source={item.logo ? { uri: item.logo } : null}
                    />
                </View>
                <View style={[ {
                    marginTop: 10,
                    marginRight: 10,
                    flex: 1
                } ]}>
                    <Text
                        numberOfLines={1}
                        style={
                            {
                                color: '#3e3c43',
                                fontSize: 15,
                                fontWeight: 'bold'
                            }
                        }>
                        {item.name}
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={
                            {
                                marginTop: 4,
                                color: '#717789',
                                fontSize: 11,
                            }
                        }>
                        {item.intro}
                    </Text>
                    <View style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 4
                        }
                    }>
                        <Text style={[ { fontSize: 12, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.shop_credit_title )}
                        </Text>

                        <StarComponent style={[ { marginLeft: 10 } ]}
                                       starCount={this.state.business && this.state.business.statistics ? this.state.business.statistics.goodRate / 100 * 5 : 0}/>
                    </View>

                    <View style={
                        {

                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2
                        }
                    }>
                        <Text style={[ { fontSize: 12, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.good_rate )}
                        </Text>
                        <Text style={[ { fontSize: 12, color: 'black', marginLeft: 10 } ]} numberOfLines={1}>
                            {this.state.business && this.state.business.statistics ? this.state.business.statistics.goodRate : 0}
                            <Text>%</Text>
                        </Text>
                    </View>

                    <View style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2
                        }
                    }>
                        <Text style={[ { fontSize: 12, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.shop_type_data_short_title )}
                        </Text>
                        <View style={{
                            marginLeft: 10
                        }}>
                            <Icon.Button
                                style={[
                                    {
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                        borderRadius: 5
                                    } ]}
                                name={type === 1 ? "md-globe" : "md-home"}
                                backgroundColor={type === 1 ? "#49da42" : "#1586fe"}
                                size={12}
                                color={'white'}
                            >
                                <Text style={{ color: 'white', fontSize: 12, marginLeft: -5 }}>
                                    {type === 1 ? I18n.t( Keys.shop_type_data_short_child_1 ) : I18n.t( Keys.shop_type_data_short_child_2 )}
                                </Text>
                            </Icon.Button>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( OrderShopInfoComponent );
