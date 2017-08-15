import React from "react";

import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import Keys from "../../../configs/Keys";

const { height, width } = Dimensions.get( 'window' );
const styles = StyleSheet.create(
    {
        label_style: {
            color: '#3e3c43',
            fontSize: 14
        },
        value_style: {
            color: '#717789',
            fontSize: 14,
            marginLeft: 10
        }
    }
);
class DeliverAddressSelectCompoment extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        currentDeliverAddress: React.PropTypes.object.isRequired
    };

    constructor( props ) {
        super( props );

        this.state = {
            currentDeliverAddress: props.currentDeliverAddress
        }
    }


    render() {
        let i = this.state.currentDeliverAddress;
        return (
            <View style={
                {
                    flex: 1,
                    width: width,
                }
            }>
                <View style={
                    {
                        height: 42,
                        width: width,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        backgroundColor: constStyles.COMMON_GREY_BG,
                    }
                }>
                    <View style={
                        {
                            height: 31,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }
                    }>
                        <Text style={
                            {
                                color: '#b4b8c0',
                                fontSize: 12,
                                flexGrow: 1
                            }
                        }>
                            {I18n.t( Keys.deliver_address )}
                        </Text>
                        <TouchableOpacity onPress={
                            () => {
                                this.props.navigation.navigate(
                                    'commonInfoSettingPage',
                                    {
                                        title: "!23",
                                        defaultVal: "1",
                                        placeholderVal: "1",
                                        callback: () => {

                                        }
                                    }
                                );
                            }
                        }>
                            <Text style={
                                {
                                    color: constStyles.THEME_COLOR,
                                    fontSize: 12
                                }
                            }>
                                {I18n.t( Keys.other_deliver_address )}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                </View>
                {
                    this.state.currentDeliverAddress &&
                    <View
                        style={{
                            paddingTop: 15,
                            backgroundColor: 'white'
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                marginLeft: 15,
                                marginRight: 15
                            }}>
                            <Text
                                style={styles.label_style}
                            >{I18n.t( Keys.recipient )}:</Text>
                            <Text
                                style={styles.value_style}
                            >{ i.recipient}</Text>
                            <View style={{
                                flexGrow: 1,
                                alignItems: 'flex-end'
                            }}>
                                <Text
                                    style={styles.value_style}
                                >{ i.mobile}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 15,
                                marginLeft: 15,
                                marginRight: 15
                            }}>
                            <Text
                                style={styles.label_style}
                            >{I18n.t( Keys.address )}:</Text>
                            <Text
                                numberOfLines={3}
                                style={styles.value_style}
                            >{ DeliverAddressSelectCompoment.getAddress( i )}</Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 15
                            }}>
                            <Text
                                style={styles.label_style}
                            >{I18n.t( Keys.postcode )}:</Text>
                            <Text
                                style={styles.value_style}
                            >{ i.postalCode}</Text>
                        </View>
                        <View style={[ commonStyles.commonIntervalStyle ]}/>
                    </View>
                }

                <View style={
                    {
                        height: 42,
                        width: width,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        backgroundColor: constStyles.COMMON_GREY_BG,
                    }
                }>
                    <View style={
                        {
                            height: 31,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }
                    }>
                        <Text style={
                            {
                                color: '#b4b8c0',
                                fontSize: 12,
                                flexGrow: 1
                            }
                        }>
                            {I18n.t( Keys.order_list )}
                        </Text>
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                </View>

            </View>


        );
    }

    static getAddress( addressObj ) {

        return addressObj.address + " / " + addressObj.area3Name;
    };

    componentDidMount() {

    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {

    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {

        return true;
    }

    componentWillUpdate( nextProps, nextState ) {

    }

    componentDidUpdate( prevProps, prevState ) {

    }
}

function select( store ) {
    return {
        deliverAddressList: store.orderStore.deliverAddressList
    }
}

export default connect( select )( DeliverAddressSelectCompoment );