import React from "react";

import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";


class LoginTipBanner extends React.Component {
    constructor( props ) {
        super( props );
    }

    render() {
        return (
            <View style={[ styles.container, this.props.style, {
                alignItems: 'center', paddingLeft: 20, paddingRight: 20,
            } ]}>
                <Text
                    style={[ commonStyles.commonTextColorDarkStyle, { fontSize: 15 } ]}>{I18n.t( Keys.login_tip )}</Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            width: 65,
                            height: 28,
                            marginLeft: 10
                        }
                    ]}
                    style={[
                        commonStyles.buttonContentStyle, {
                            fontSize: 14
                        }
                    ]}
                    onPress={() => {
                        this.props.navigation.navigate( 'loginPage' );
                    }} title={null}>
                    {I18n.t( Keys.login )}
                </Button>

            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0000007f'
    }
} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default connect( select )( LoginTipBanner );
