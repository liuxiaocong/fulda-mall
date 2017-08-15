import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import WalletBalanceComponent from "../component/WalletBalanceComponent";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import constStyles from "../../../styles/constStyles";


class TopUpPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.top_up ),
        };
    };

    constructor( props ) {
        super( props );

        this.state = {};
    }

    componentWillMount() {
        this.props.navigation.state.key = "topUpPage";
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <WalletBalanceComponent
                    totalMoneyShow={false}
                    FRCShow={false}
                    navigation={this.props.navigation}
                />

                <Text style={[ { fontSize: 12, marginTop: 20, marginBottom: 10, marginLeft: 15 } ]}>
                    {I18n.t( Keys.top_up_method )}
                </Text>

                <TouchableItemComponent
                    containerStyle={{} }
                    title="PayPal"
                    onPress={() => {
                        this.props.navigation.navigate( 'topUpAmountInputPage', {
                            paymentMethod: 'paypal',
                            title: 'PayPal'
                        } );
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={{} }
                    title={I18n.t( Keys.union_pay )}
                    onPress={() => {
                        this.props.navigation.navigate( 'topUpAmountInputPage', {
                            paymentMethod: 'sinopay',
                            title: I18n.t( Keys.union_pay )
                        } );
                    }}
                    headerInterval={false}
                    footerInterval={true}/>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status }
}

export default  connect( select )( TopUpPage );
