import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";

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
class DeliverAddressSelectPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.select_deliver_address ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapAddDeliverAddress()
                    }}
                >
                    {I18n.t( Keys.add_address )}
                </Button>
            )
        };
    };

    constructor( props ) {
        super( props );
        let navState = this.props.navigation.state;
        this.state = {
            callback: navState.params.callback,
            deliverAddressList: props.deliverAddressList
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            deliverAddressList: nextProps.deliverAddressList
        } );
    }

    componentDidMount() {
        this.props.navigation.setParams( {
            onTapSave: this.onTapSave.bind( this ),
            onTapAddDeliverAddress: this.onTapAddDeliverAddress.bind( this )
        } );
        if ( this.state.deliverAddressList === null || this.state.deliverAddressList.length === 0 ) {
            this.props.getDeliverAddressList(
                ( err, resBody ) => {

                }
            );
        }
    }

    componentWillUnmount() {
    }

    onTapAddDeliverAddress() {
        this.props.onTapAddDeliverAddress();
    };

    onTapSave( addressId ) {
        if ( this.state.callback instanceof Function ) {
            this.state.callback( addressId );
            this.props.navigation.goBack();
        }
    };


    _renderItem( item ) {
        let i = item.item;
        return (
            <TouchableOpacity
                onPress={
                    () => {
                        this.onTapSave( i.id )
                    }
                }>
                <View
                    style={{
                        paddingTop: 15,
                        marginTop: 10,
                        backgroundColor: 'white'
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            marginLeft: 15,
                            marginRight: 15
                        }}>
                        {i.default &&
                        <Text
                            style={[ styles.label_style, {
                                color: '#e72545',
                                fontSize: 14,
                                fontWeight: 'bold',
                                marginRight: 5
                            } ]}
                        >{"[" + I18n.t( Keys.default_address ) + "]"}</Text>
                        }
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
                            style={[ styles.label_style, {} ]}
                        >{I18n.t( Keys.address )}:</Text>
                        <Text
                            style={[ styles.label_style, {
                                color: "#717789"
                            } ]}
                        >{ DeliverAddressSelectPageView.getAddress( i )}</Text>
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
                        >{I18n.t( Keys.postcode )}:</Text>
                        <Text
                            style={styles.value_style}
                        >{ i.postalCode}</Text>
                    </View>

                    <View style={[ commonStyles.commonBorderBottom, {
                        marginTop: 15
                    } ]}/>
                </View>
            </TouchableOpacity>
        )
    }

    static getAddress( addressObj ) {
        return addressObj.address + " / " + addressObj.area3Name;
    };

    render() {
        let empty = true;
        if ( this.state.deliverAddressList && this.state.deliverAddressList.length > 0 ) {
            empty = false;
        }
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                {empty ?
                    <View
                        style={
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                        <Text style={commonStyles.emptyTipStyle}>
                            {I18n.t( Keys.empty_address_data )}
                        </Text>
                    </View>
                    :
                    <FlatList
                        renderItem={this._renderItem.bind( this )}
                        data={this.state.deliverAddressList}
                        style={
                            {
                                marginTop: 5
                            }
                        }>
                    </FlatList>
                }
            </View>
        )
    }
}

export default DeliverAddressSelectPageView;
