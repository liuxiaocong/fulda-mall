import React from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { luckyWheelDraw, luckyWheelListRewards } from "../../../actions/LuckWheelAction";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import LuckyWheelComponent from "./LuckyWheelComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import format from "string-format";


class LuckyWheelPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.luck_wheel ),
        };
    };

    constructor( props ) {
        super( props );

        const colorsData = [
            '#ec7a82',
            '#5dc1b3',
            '#7ccbcc',
            '#7dcabd',
            '#93cb9c',
            '#dad08b',
            '#dab673',
            '#eabb97',
            '#e99089',
            '#ec7082',
        ];

        const selectDataIndex = -1;

        this.state = {
            data: [],
            selectDataIndex: selectDataIndex,
            colorsData: colorsData,
        };
    }

    componentWillMount() {
        this.setState(
            {
                isRequesting: true
            }
        );
        this.props.dispatch( luckyWheelListRewards( ( err, resBody ) => {
            this.setState(
                {
                    isRequesting: false,
                    data: !err ? resBody.data : []
                }
            );


            if ( err ) {
                Toast.show( err.message );
            }
        } ) );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.paddingCommon, commonStyles.commonBorderTop
                ]}>

                <LuckyWheelComponent
                    ref={( luckyWheelComponent ) => {
                        this._luckyWheelComponent = luckyWheelComponent;
                    }}
                    squareSize={Dimensions.get( 'window' ).width - 28 * 2}
                    data={this.state.data}
                    // selectDataIndex={this.state.selectDataIndex}
                    colorsData={this.state.colorsData}
                    onPointToIndex={( error, selectDataIndex ) => {
                        if ( error ) {
                            Toast.show( error.message );
                        } else if ( selectDataIndex > 0 ) {
                            //noinspection JSCheckFunctionSignatures
                            Alert.alert(
                                format(
                                    I18n.t( Keys.lucky_wheel_result_tip ),
                                    this.state.data[ selectDataIndex ].name
                                ) );
                        }
                    }}
                    onLoadResult={( callback ) => {
                        this.props.dispatch( luckyWheelDraw( ( err, resBody ) => {
                            let selectDataIndex = -1;
                            if ( !err ) {
                                for ( let index = 0; index < this.state.data.length; index++ ) {
                                    if ( this.state.data[ index ].id === resBody.data.id ) {
                                        selectDataIndex = index;
                                        break;
                                    }
                                }
                            }

                            callback( err, selectDataIndex );
                        } ) )
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

export default connect( select )( LuckyWheelPage );
