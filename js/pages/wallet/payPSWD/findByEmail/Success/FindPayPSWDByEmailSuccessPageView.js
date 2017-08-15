/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import { NavigationActions } from "react-navigation";
import commonStyles from "../../../../../styles/commonStyles";
import Keys from "../../../../../configs/Keys";
import I18n from "../../../../../I18n";
const styles = StyleSheet.create(
    {}
);
class FindPayPSWDByEmailSuccessPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.send_success ),
            headerBackTitle: () => null,
            headerLeft: (
                <View/>
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    onPressBackToSettingPage() {
        this.props.navigation.dispatch( NavigationActions.back( { key: 'backToSettingAction' } ) );
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
                        source={require( '../../../../../imgs/done.png' )}/>
                </View>
                <Text
                    style={
                        {
                            marginTop: 40,
                            fontSize: 16,
                            color: '#000',
                            textAlign: 'center'
                        }
                    }>
                    {I18n.t( Keys.reset_email_sent )}
                </Text>
                <Text
                    style={
                        {
                            marginTop: 20,
                            fontSize: 14,
                            color: '#000',
                            textAlign: 'center'
                        }
                    }>
                    {I18n.t( Keys.plz_login_email_in_24_hour )}
                </Text>
                <Text
                    style={
                        {
                            fontSize: 14,
                            color: '#000',
                            textAlign: 'center'
                        }
                    }>
                    {I18n.t( Keys.find_email_link_and_reset )}
                </Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginTop: 40,
                            marginLeft: 10,
                            marginRight: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.onPressBackToSettingPage()}
                    title={I18n.t( Keys.back_to_setting_page )}>
                    {I18n.t( Keys.back_to_setting_page )}
                </Button>
            </View>
        )
    }
}

export default FindPayPSWDByEmailSuccessPageView;
