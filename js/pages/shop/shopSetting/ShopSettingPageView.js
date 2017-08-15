import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import constStyles from "../../../styles/constStyles";

const styles = StyleSheet.create( {} );
class ShopSettingPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_info ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this.props.onTapSave();
    };

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 20
                    } ]}
                    title={I18n.t( Keys.core_setting )}
                    onPress={() => {
                        this.props.onTapCoreSetting();
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    } ]}
                    title={I18n.t( Keys.shop_orders )}
                    onPress={() => {
                        this.props.onTapOrders();
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    } ]}
                    title={I18n.t( Keys.withdraw_account_setting )}
                    onPress={() => {
                        this.props.onTapWithdrawAccount();
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    } ]}
                    title={I18n.t( Keys.base_setting )}
                    onPress={() => {
                        this.props.onTapBaseSetting();
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
            </View>
        )
    }
}

export default ShopSettingPageView;
