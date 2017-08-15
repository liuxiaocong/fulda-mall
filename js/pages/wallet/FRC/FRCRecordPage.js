import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import WalletBalanceComponent from "../component/WalletBalanceComponent";
import FRCRecordListComponent from "./FRCRecordListComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class FRCRecordPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.fulda_record ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>


                <FRCRecordListComponent getHeader={() => {
                    return (
                        <View style={[ { marginBottom: 10 } ]}>

                            <WalletBalanceComponent availableMoneyShow={false} totalMoneyShow={false}
                                                    navigation={this.props.navigation}/>

                        </View>
                    );
                }}/>


            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( FRCRecordPage );
