import React from "react";
import { StyleSheet, View } from "react-native";
import RNGooglePlaces from "react-native-google-places";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";


class LocationPickerPage1 extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.location ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};

    }


    openAutocompleteModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then( ( place ) => {
                console.log( place );
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            } )
            .catch( error => console.log( error.message ) );  // error is a Javascript Error object
    }

    openPlacePickerModal() {
        RNGooglePlaces.openPlacePickerModal()
            .then( ( place ) => {
                console.log( place );
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            } )
            .catch( error => console.log( error.message ) );  // error is a Javascript Error object
    }

    getAutocompletePredictions() {
        RNGooglePlaces.getAutocompletePredictions( 'facebook' )
            .then( ( results ) => {
                this.setState( { predictions: results } );
            } )
            .catch( ( error ) => {
                console.log( error.message );
            } );
    }

    lookUpPlaceByID() {
        RNGooglePlaces.lookUpPlaceByID( 'ChIJZa6ezJa8j4AR1p1nTSaRtuQ' )
            .then( ( results ) => {
                console.log( results )
            } )
            .catch( ( error ) => {
                console.log( error.message )
            } );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG, commonStyles.paddingCommon ]}>
                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.openAutocompleteModal()}
                    title="">
                    open auto complete model
                </Button>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.openPlacePickerModal()}
                    title="">
                    open place picker model
                </Button>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.getAutocompletePredictions()}
                    title="">
                    get Auto complete Predictions
                </Button>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.lookUpPlaceByID()}
                    title="">
                    get Auto complete Predictions
                </Button>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        this.props.navigation.navigate(
                            'locationMapPages1'
                        );
                    }}
                    title="">
                    地图
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( LocationPickerPage1 );
