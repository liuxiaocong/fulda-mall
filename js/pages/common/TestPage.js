import React from "react";
import { Component, StyleSheet, View } from "react-native";
import { Pie } from "react-native-pathjs-charts";
import { connect } from "react-redux";


class TestPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: 'Test Page',
        };
    };

    constructor( props ) {
        super( props );

        const data = [ {
            "name": "Washington",
            "population": 7694980
        }, {
            "name": "Oregon",
            "population": 2584160
        }, {
            "name": "Minnesota",
            "population": 6590667,
            "color": { 'r': 223, 'g': 154, 'b': 20 }
        }, {
            "name": "Alaska",
            "population": 7284698
        } ];

        this.state = {
            data: data
        };
    }

    render() {
        let options = {
            margin: {
                top: 20,
                left: 20,
                right: 20,
                bottom: 20
            },
            width: 350,
            height: 350,
            color: '#2980B9',
            r: 50,
            R: 150,
            legendPosition: 'topLeft',
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            label: {
                fontFamily: 'Arial',
                fontSize: 8,
                fontWeight: true,
                color: '#ECF0F1'
            }
        };

        return (
            <View style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f7f7f7',
                } ]}>
                <Pie data={this.state.data}
                     options={options}
                     accessorKey="population"
                     margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
                     color="#2980B9"
                     pallete={
                         [
                             { 'r': 25, 'g': 99, 'b': 201 },
                             { 'r': 24, 'g': 175, 'b': 35 },
                             { 'r': 190, 'g': 31, 'b': 69 },
                             { 'r': 100, 'g': 36, 'b': 199 },
                             { 'r': 214, 'g': 207, 'b': 32 },
                             { 'r': 198, 'g': 84, 'b': 45 }
                         ]
                     }
                     r={50}
                     R={150}
                     legendPosition="topLeft"
                     label={{
                         fontFamily: 'Arial',
                         fontSize: 8,
                         fontWeight: true,
                         color: '#ECF0F1'
                     }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( TestPage );
