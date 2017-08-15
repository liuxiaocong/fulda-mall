import React from "react";
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";
import { Dimensions, StatusBar, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import AlreadyShipPage from "./component/AlreadyShipPage";
import WaitPaidOrdersPage from "./component/WaitPaidOrdersPage";
import WaitShipPage from "./component/WaitShipPage";
import Keys from "../../../configs/Keys";
import I18n from "../../../I18n";


class ShopOrderPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_orders ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    render() {
        const tabBarMargin = ((Dimensions.get( 'window' ).width) / 3 - 30) / 2;

        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <ScrollableTabView
                    initialPage={0}
                    locked={false}
                    tabBarPosition="top"
                    renderTabBar={() => <DefaultTabBar
                        style={[ {
                            height: 44,
                        }, commonStyles.commonBorderBottom ]}
                        backgroundColor='white'
                        activeTextColor='#3e3c43'
                        inactiveTextColor='#b4b8c0'
                        textStyle={[ {
                            fontSize: 13,
                            paddingTop: 10,
                            textAlignVertical: 'center',
                            includeFontPadding: false
                        } ]}
                        tabStyle={[ { height: 44, justifyContent: 'center' } ]}
                        underlineStyle={[ {
                            height: 2,
                            backgroundColor: '#3e3c43',
                            borderRightWidth: tabBarMargin,
                            borderLeftWidth: tabBarMargin,
                            borderRightColor: 'white',
                            borderLeftColor: 'white',
                            bottom: 5
                        } ]}
                    />}
                >
                    <WaitPaidOrdersPage tabLabel={I18n.t( Keys.wait_paid )} navigation={this.props.navigation}/>
                    <WaitShipPage tabLabel={I18n.t( Keys.wait_deliver )} navigation={this.props.navigation}/>
                    <AlreadyShipPage tabLabel={I18n.t( Keys.already_deliver )} navigation={this.props.navigation}/>
                </ScrollableTabView>
            </View>
        );
    }
}

function

select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default connect( select )( ShopOrderPage );
