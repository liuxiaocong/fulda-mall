import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import * as MapView from "react-native-maps";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";


class LocationMapPages1 extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.location_select ),
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }


    onRegionChange( region ) {
        this.setState( { region } );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <MapView style={[ { backgroundColor: 'red' }, commonStyles.wrapper ]}
                         region={this.state.region}
                         onRegionChange={this.onRegionChange.bind( this )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( LocationMapPages1 );
