/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { Alert, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import format from "string-format";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
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
class SetDeliverAddressPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.deliver_address ),
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
        this.state = {
            isRequesting: false,
            deliverAddressList: props.deliverAddressList
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            deliverAddressList: nextProps.deliverAddressList
        } );
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapAddDeliverAddress: this.onTapAddDeliverAddress.bind( this ) } );
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

    onTapEditDeliverAddress( addressObj ) {
        this.props.onTapEditDeliverAddress( addressObj );
    };

    static getAddress( addressObj ) {
        return addressObj.address + " / " + addressObj.area3Name;
    };

    setDefaultAddress( addressObj ) {
        this.props.setDefault(
            addressObj.id, ( err, resBody ) => {
                if ( err ) {
                    Toast.show( I18n.t( Keys.set_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.set_success ) )
                }
            }
        )
    };

    onTapEdit( addressObj ) {

    };

    onTapDelete( addressObj ) {
        //noinspection JSCheckFunctionSignatures
        Alert.alert(
            I18n.t( Keys.delete ),
            format( I18n.t( Keys.confirm_to_delete_address ), addressObj.address ),
            [
                { text: I18n.t( Keys.cancel ), onPress: () => console.log( 'cancel' ), style: 'cancel' },
                {
                    text: I18n.t( Keys.confirm ), onPress: () => {
                    this.setState( { isRequesting: true } );
                    this.props.onTapDelete(
                        addressObj, ( err, resBody ) => {
                            this.setState( { isRequesting: false } );
                            if ( err ) {
                                Toast.show( I18n.t( Keys.delete_fail ) + ': ' + err.message )
                            } else {
                                Toast.show( I18n.t( Keys.delete_success ) );
                                this.props.onDeleteSuccess();
                            }
                        }
                    )
                }
                },
            ],
            { cancelable: true }
        )
    };

    _renderItem( item ) {
        let i = item.item;
        //noinspection JSCheckFunctionSignatures
        return (
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
                        marginTop: 5,
                        marginLeft: 15,
                        marginRight: 15
                    }}>
                    <Text
                        style={styles.label_style}
                    >{I18n.t( Keys.address )}:</Text>
                    <Text
                        style={styles.value_style}
                    >{ SetDeliverAddressPageView.getAddress( i )}</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 5,
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
                    marginTop: 5
                } ]}/>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 48,
                        paddingLeft: 15,
                        paddingRight: 15
                    }}>

                    {i.default &&
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        source={require( '../../../imgs/defaultSelect.png' )}/>
                    }
                    {!i.default &&
                    <TouchableOpacity
                        onPress={() => {
                            this.setDefaultAddress( i )
                        }}>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            source={require( '../../../imgs/unSelect.png' )}/>
                    </TouchableOpacity>
                    }
                    {i.default &&
                    <Text style={{
                        fontSize: 14,
                        color: '#e72545',
                        flexGrow: 1,
                        marginLeft: 10
                    }}>
                        {I18n.t( Keys.default_address )}
                    </Text>
                    }
                    {!i.default &&
                    <Text
                        onPress={() => {
                            this.setDefaultAddress( i )
                        }}
                        style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flexGrow: 1,
                            marginLeft: 10
                        }}>
                        {I18n.t( Keys.set_default )}
                    </Text>
                    }
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onTapEdit( i )
                        }}>
                        <Text style={{
                            color: '#717789',
                            fontSize: 14
                        }}>
                            {I18n.t( Keys.edit )}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.onTapDelete( i )
                        }}>
                        <Text style={{
                            color: '#717789',
                            fontSize: 14,
                            marginLeft: 30
                        }}>
                            {I18n.t( Keys.delete )}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

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
                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        )
    }
}

export default SetDeliverAddressPageView;
