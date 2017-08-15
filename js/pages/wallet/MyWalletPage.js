import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { paymentAccountBalance } from "../../actions/PaymentAction";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import WalletBalanceComponent from "./component/WalletBalanceComponent";
import TouchableItemComponent from "../../components/TouchableItemComponent";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import constStyles from "../../styles/constStyles";


class MyWalletPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.my_wallet ),
        };
    };

    constructor( props ) {
        super( props );


        this.state = {};
    }

    componentWillMount() {
        this.props.dispatch( paymentAccountBalance( ( error, resBody ) => {
            if ( error ) {
                console.log( error.message );
            }
        } ) );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <WalletBalanceComponent navigation={this.props.navigation}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10,
                    } ]}
                    title={I18n.t( Keys.fulda_record )}
                    onPress={() => {
                        this.props.navigation.navigate( 'frcRecordPage' )
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.trade_record )}
                    onPress={() => {
                        this.props.navigation.navigate( 'transactionRecordPage' )
                    }}
                    headerInterval={false}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10,
                    } ]}
                    title={I18n.t( Keys.fulda_pay )}
                    onPress={() => {
                        this.props.navigation.navigate( 'myCreditCardPage' )
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                {
                    this.props.user && this.props.user && this.props.user.shopExists ?
                        <TouchableItemComponent
                            containerStyle={[ {
                                marginTop: 10,
                            } ]}
                            title={I18n.t( Keys.withdraw )}
                            onPress={() => {
                                this.props.navigation.navigate( 'walletWithdrawPage' )
                            }}
                            headerInterval={true}
                            footerInterval={true}/>
                        :
                        null
                }

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10,
                    } ]}
                    title={I18n.t( Keys.transfer )}
                    onPress={() => {
                        this.props.navigation.navigate( 'walletTransferPage' )
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        user: store.userStore.user
    }
}

export default  connect( select )( MyWalletPage );
