import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "react-native-button";
import WalletWithdrawAccountSelectListComponent from "./WalletWithdrawAccountSelectListComponent";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

class WalletWithdrawAccountSelectPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.select_withdraw_account ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapManage()
                    }}
                >
                    {I18n.t( Keys.manage )}
                </Button>
            )
        };
    };

    componentDidMount() {
        this.props.navigation.setParams( { onTapManage: this.onTapManage.bind( this ) } );
    }

    onTapManage() {
        this.props.navigation.navigate( "withdrawAccountSettingPage" );
    }

    constructor( props ) {
        super( props );

        let navState = this.props.navigation.state;

        this.state = {
            callback: navState.params.callback,
        };
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <WalletWithdrawAccountSelectListComponent onSelect={( item ) => {
                    if ( this.state.callback instanceof Function ) {
                        this.state.callback( item );
                        this.props.navigation.goBack();
                    }
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( WalletWithdrawAccountSelectPage );
