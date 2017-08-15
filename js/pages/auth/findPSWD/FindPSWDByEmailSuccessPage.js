import React from "react";
import { BackHandler, Image, Text, View } from "react-native";
import Button from "react-native-button";
import { NavigationActions } from "react-navigation";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { connect } from "react-redux";


class FindPSWDByEmailSuccessPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.send_success ),
            headerLeft: null
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentWillMount() {
        BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    _onBack() {
        if ( this.props.isLoggedIn ) {
            this.props.navigation.dispatch( NavigationActions.back( { key: 'backToSettingAction' } ) );
        } else {
            this.props.navigation.dispatch( NavigationActions.back( { key: 'findPSWDByPhonePage' } ) );
        }

        return true;
    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.justAlignCenter ]}>
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        source={require( '../../../imgs/ic_done.png' )}/>
                </View>

                <Text
                    style={[
                        commonStyles.commonTextColorStyle, {
                            marginTop: 40,
                            fontSize: 16,
                            textAlign: 'center'
                        }
                    ]}>
                    {I18n.t( Keys.reset_email_sent )}
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#717789',
                        fontSize: 14,
                        marginTop: 20
                    }}>
                    {I18n.t( Keys.plz_login_email_in_24_hour )}
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#717789',
                        fontSize: 14
                    }}>
                    {I18n.t( Keys.find_email_link_and_reset )}
                </Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 40
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        this._onBack();
                    }} title="">
                    {this.props.isLoggedIn ? I18n.t( Keys.back_to_setting_page ) : I18n.t( Keys.back_to_login_page )}
                </Button>

            </View>
        );
    }
}

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}
export default connect( select )( FindPSWDByEmailSuccessPage );
