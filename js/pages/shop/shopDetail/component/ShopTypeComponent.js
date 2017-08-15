import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


class ShopTypeComponent extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        type: React.PropTypes.number,
    };

    constructor( props ) {
        super( props );
        this.state = {
            type: this.props.type,
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            type: this.props.type
        } );
    }

    render() {
        const type = 2;//this.state.type;

        return (
            <View style={[ this.props.style ]}>
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
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( ShopTypeComponent );
