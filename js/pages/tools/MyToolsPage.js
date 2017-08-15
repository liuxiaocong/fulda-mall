import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import TouchableItemComponent from "../../components/TouchableItemComponent";


class MyToolsPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.my_tools ),
        };
    };

    constructor( props ) {
        super( props );

        this.state = {};
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop,
                    {
                        paddingTop: 20
                    }
                ]}>

                <TouchableItemComponent
                    style={[ {} ]}
                    title={I18n.t( Keys.mobile_phone_recharge )}
                    onPress={() => {
                        this.props.navigation.navigate( 'mobileNoTopUpPage' );
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    }
                    ]}
                    style={[ {} ]}
                    title={I18n.t( Keys.luck_wheel )}
                    onPress={() => {
                        this.props.navigation.navigate( 'luckyWheelPage' );
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( MyToolsPage );
