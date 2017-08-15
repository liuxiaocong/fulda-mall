import React from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { paymentOrderPayment } from "../../../../actions/PaymentAction";
import Util from "../../../../util/Util";
import InputPayPasswordComponent from "../../../wallet/payPSWD/inputPSWD/InputPayPasswordComponent";
import OrderShopItem from "../../component/OrderShopItem";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#f1f3f5',
        paddingLeft: 0,
        paddingRight: 0,
    },
    actionButton: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
    },
    actionText: {
        color: constStyles.THEME_COLOR,
        fontSize: 15
    }
} );
class WaitPaidPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

    };

    constructor( props ) {
        super( props );
        this.state = {
            getData: false,
            data: [],
            isRequesting: false,
            isPayPSWDInputOpen: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        this.refreshData();
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this.props.onTapSave();
    };

    _renderItem = ( { item } ) => {
        return (
            <View>
                <OrderShopItem
                    { ...this.props }
                    data={item}
                    isShopOrder={false}/>
                <View style={
                    {
                        height: 48,
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }
                }>
                    <TouchableOpacity
                        style={[ styles.actionButton ]}
                        onPress={() => {
                            this.cancelOrder( item.shop.name, item.id )
                        }}>
                        <Text style={[ styles.actionText ]}>
                            {I18n.t( Keys.cancel_order )}
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        height: 17,
                        backgroundColor: "#c3c6d0",
                        width: Util.getDpFromPx( 1 )
                    }}/>
                    <TouchableOpacity
                        style={[ styles.actionButton ]}
                        onPress={() => {
                            this.paidOrder( item.id, item.totalPrice )
                        }}>
                        <Text style={[ styles.actionText ]}>
                            {I18n.t( Keys.pay )}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        )
    };

    cancelOrder = ( orderName, orderId ) => {
        //noinspection JSCheckFunctionSignatures
        Alert.alert(
            I18n.t( Keys.delete ),
            I18n.t( Keys.confirm_to_delete_order ),
            [
                { text: I18n.t( Keys.cancel ), onPress: () => console.log( 'cancel' ), style: 'cancel' },
                {
                    text: I18n.t( Keys.confirm ), onPress: () => {
                    this.setState( { isRequesting: true } );
                    this.props.cancelOrder( orderId, ( err, resBody ) => {
                        this.setState( { isRequesting: false } );
                        if ( err ) {
                            Toast.show( err + "" )
                        } else {
                            Toast.show( I18n.t( Keys.cancel_success ) );
                            this.refreshData();
                        }
                    } );

                }
                },
            ],
            { cancelable: true }
        )

    };

    refreshData() {
        this.setState( {
            isRequesting: true
        } );
        this.props.loadData( ( err, response ) => {
            if ( err ) {
                Toast.show( err + "" );
                this.setState( {
                    isRequesting: false
                } );
            } else {
                this.setState( {
                    data: response.data,
                    getData: true,
                    isRequesting: false
                } )
            }
        } );

        // netOrderGet( UtilConfig.ORDER_TYPE.NEW, false, ( err, response ) => {
        // 	if ( err ) {
        // 		Toast.show( err + "" );
        // 	} else {
        // 		this.setState( {
        // 			data: response.data,
        // 			getData: true,
        // 			isRequesting: false
        // 		} )
        // 	}
        // } )
    }

    paidOrder = ( orderId, price ) => {
        this.pendingOrderId = orderId;
        this.pendingPrice = price;
        this.setState( {
            isPayPSWDInputOpen: true,
        } );
    };

    doTransfer = ( password ) => {
        Toast.show( password + "" );
        this.setState( {
            isRequesting: true
        } );
        this.props.navigation.dispatch( paymentOrderPayment(
            this.pendingOrderId, this.pendingPrice, password, ( err, res ) => {
                this.setState(
                    {
                        isRequesting: false,
                    }
                );
                if ( err ) {
                    Toast.show( err + "" )
                } else {
                    Toast.show( I18n.t( Keys.paid_success ) )
                }
            }
        ) );
    };

    componentWillUpdate( nextProps, nextState ) {

    }

    render() {
        let isEmpty = true;
        if ( this.state.data && this.state.data.length > 0 ) {
            isEmpty = false;
        }
        let customButtons = [];
        let obj = {};
        obj.title = I18n.t( Keys.paid_later );
        obj.action = this.doDelay;
        customButtons.push( obj );
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                {
                    this.state.getData ?
                        isEmpty ?
                            <View
                                style={
                                    {
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                }>
                                <Text style={commonStyles.emptyTipStyle}>
                                    {I18n.t( Keys.empty_wait_paid_order )}
                                </Text>
                            </View>
                            :
                            <FlatList
                                style={{
                                    flexGrow: 1,
                                }}
                                renderItem={this._renderItem}
                                data={this.state.data}
                            >
                            </FlatList>
                        :
                        <View/>
                }

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc"
                             color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
                <InputPayPasswordComponent
                    navigation={this.props.navigation}
                    isOpen={this.state.isPayPSWDInputOpen}
                    onClose={() => {
                        this.setState( {
                            isPayPSWDInputOpen: false
                        } );
                    }}
                    onPay={( password ) => {
                        this.doTransfer( password );
                    }}
                    customButtons={customButtons}
                />
            </View>
        )
    }
}

export default WaitPaidPageView;
