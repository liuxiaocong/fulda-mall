import React from "react";
import { Component, Dimensions, StyleSheet, View } from "react-native";
import { Pie } from "react-native-pathjs-charts";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class WalletBalancePieChartPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        let title = '';

        switch ( params.type ) {
            case 0:
                title = I18n.t( Keys.account_balance );
                break;
            case 1:
                title = I18n.t( Keys.available_balance );
                break;
            case 2:
                title = I18n.t( Keys.fulda_balance );
                break;
        }

        return {
            title: title,
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
            // "color": { 'r': 223, 'g': 154, 'b': 20 }
        }, {
            "name": "Alaska",
            "population": 7284698
        } ];

        this.state = {
            data: data
        };
    }

    render() {
        const squareSize = Dimensions.get( 'window' ).width - 28 * 2;

        let options = {
            margin: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            width: squareSize,
            height: squareSize,
            color: '#2980B9',
            r: 50,
            R: squareSize / 2,
            legendPosition: 'topLeft',
            animate: {
                type: 'oneByOne',
                duration: 200,
                fillTransition: 3
            },
            label: {
                fontFamily: 'Arial',
                fontSize: 14,
                fontWeight: true,
                color: '#ECF0F1'
            }
        };

        return (
            <View style={[
                commonStyles.wrapper, commonStyles.commonBG, commonStyles.paddingCommon, commonStyles.commonBorderTop ]}>
                <Pie data={this.state.data}
                     options={options}
                     accessorKey="population"
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
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( WalletBalancePieChartPage );
