import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import StarComponent from "../../../../components/StarComponent";
import ShopTypeComponent from "./ShopTypeComponent";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


class ShopInfoComponent extends React.Component {
    static propTypes = {
        business: React.PropTypes.object,
    };

    constructor( props ) {
        super( props );
        this.state = {
            currentSelect: null,
        };
    }

    render() {
        return (
            <View style={[ this.props.style, { flexDirection: 'row', height: 56 } ]}>
                <TouchableHighlight
                    underlayColor='#ddd'
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub, {
                        paddingLeft: 10,
                        paddingRight: 10,
                    } ]}
                    onPress={() => {

                    }}
                >
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={[ { fontSize: 14, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.shop_credit_title )}
                        </Text>

                        <StarComponent style={[ { marginTop: 6 } ]}
                                       starCount={this.state.business && this.state.business.statistics ? this.state.business.statistics.goodRate / 100 * 5 : 0}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#ddd'
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub, {
                        paddingLeft: 10,
                        paddingRight: 10,
                    } ]}
                    onPress={() => {

                    }}
                >
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={[ { fontSize: 14, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.good_rate )}
                        </Text>
                        <Text style={[ { fontSize: 12, color: 'black', marginTop: 6 } ]} numberOfLines={1}>
                            {this.state.business && this.state.business.statistics ? this.state.business.statistics.goodRate : 0}
                            <Text>%</Text>
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#ddd'
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub, {
                        paddingLeft: 10,
                        paddingRight: 10,
                    } ]}
                    onPress={() => {

                    }}
                >
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={[ { fontSize: 14, color: '#717789', } ]}
                              numberOfLines={1}>
                            {I18n.t( Keys.shop_type_data_short_title )}
                        </Text>
                        <ShopTypeComponent style={[ { marginTop: 6 } ]}
                                           type={this.props.business ? this.props.business.type : 1}/>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( ShopInfoComponent );
