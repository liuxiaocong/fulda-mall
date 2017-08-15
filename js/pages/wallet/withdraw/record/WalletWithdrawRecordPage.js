import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import WalletWithdrawRecordListComponent from "./WalletWithdrawRecordListComponent";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

class WalletWithdrawRecordPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.withdraw_record ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <WalletWithdrawRecordListComponent/>


            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( WalletWithdrawRecordPage );
