import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import { NavigationActions } from "react-navigation";
import commonStyles from "../../../../styles/commonStyles";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
const styles = StyleSheet.create(
    {}
);
class BindMobileSuccessPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.verify_success ),
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

    onPressBackToMyInfoPage() {
        this.props.navigation.dispatch( NavigationActions.back( { key: 'bindMobilePage' } ) );
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
                        source={require( '../../../../imgs/done.png' )}/>
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
                    {I18n.t( Keys.verify_success )}
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
                    {I18n.t( Keys.congratulation_verify_mobile_success )}
                </Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginTop: 40,
                            marginLeft: 10,
                            marginRight: 10,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.onPressBackToMyInfoPage()}
                    title={I18n.t( Keys.back_to_personal_info_page )}>
                    {I18n.t( Keys.back_to_personal_info_page )}
                </Button>
            </View>
        )
    }
}

export default BindMobileSuccessPageView;
