import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import Picker from "react-native-picker";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import TouchableItemComponent from "../../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../../../util/Util";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

const styles = StyleSheet.create(
    {}
);
class AddDeliverAddressPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.add_address ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    {I18n.t( Keys.save )}
                </Button>
            )
        };
    };


    constructor( props ) {
        super( props );
        let areaList = {};
        if ( props.areaList ) {
            areaList = props.areaList;
        }

        let ret = Util.buildAreaPickDate( areaList );
        let areaPickerData = ret[ 0 ];
        let areaNameDataMap = ret[ 1 ];
        let areaCodeDataMap = ret[ 2 ];
        this.state = {
            isRequesting: false,
            areaList: areaList,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap,
            pendingAddress: {
                ownerId: this.props.user.id
            },
            showError: false
        }

    }

    onTapArea() {
        let areaObj1 = null;
        let areaObj2 = null;
        let areaObj3 = this.state.areaCodeDataMap[ this.state.pendingAddress.area ];

        if ( areaObj3 ) {
            areaObj2 = this.state.areaCodeDataMap[ areaObj3.parentCode ];
            if ( areaObj2 ) {
                areaObj1 = this.state.areaCodeDataMap[ areaObj2.parentCode ];
            }
        }

        const selectedValue = [];

        if ( areaObj1 ) {
            selectedValue.push( areaObj1.name );
        }

        if ( areaObj2 ) {
            selectedValue.push( areaObj2.name );
        }

        if ( areaObj3 ) {
            selectedValue.push( areaObj3.name );
        }

        //noinspection JSUnusedGlobalSymbols
        Picker.init(
            {
                pickerData: this.state.areaPickerData,
                selectedValue: selectedValue,
                pickerTitleText: I18n.t( Keys.select_area ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                onPickerConfirm: data => {
                    console.log( data );
                    let areaObj = this.state.areaNameDataMap[ data[ 2 ] ];
                    this.setState(
                        {
                            pendingAddress: Object.assign(
                                {}, this.state.pendingAddress, {
                                    areaDisplay: data[ 2 ],
                                    area: areaObj.code
                                }
                            )
                        }
                    )
                },
                onPickerCancel: data => {
                    console.log( data );
                },
                onPickerSelect: data => {
                    console.log( data );
                }
            }
        );
        Picker.show();
    }


    componentWillReceiveProps( nextProps ) {
        let ret = Util.buildAreaPickDate( nextProps.areaList );
        let areaPickerData = ret[ 0 ];
        let areaNameDataMap = ret[ 1 ];
        let areaCodeDataMap = ret[ 2 ];

        this.setState( {
            areaList: nextProps.areaList,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap
        } );

    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        if ( this.state.areaList === null || Object.keys( this.state.areaList ).length === 0 ) {
            this.props.getAreaList();
        }
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    onTapSave() {
        Picker.hide();
        if ( !this.state.pendingAddress || !this.state.pendingAddress.recipient || !this.state.pendingAddress.area || !this.state.pendingAddress.mobile || !this.state.pendingAddress.postalCode || !this.state.pendingAddress.address ) {
            this.setState( { showError: true } );
            return
        }
        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.pendingAddress, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                let error = err;
                if ( resBody.status !== 1 && resBody.error ) {
                    error = Error( resBody.error );
                }
                if ( error ) {
                    Toast.show( I18n.t( Keys.add_fail ) + ': ' + error.mesage )
                } else {
                    Toast.show( I18n.t( Keys.add_success ) );
                    this.props.onSaveSuccess();
                }
            }
        )
    }
    ;

    render() {
        let pendingAddress = this.state.pendingAddress;
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 20
                    } ]}
                    title={I18n.t( Keys.recipient )}
                    content={pendingAddress ? pendingAddress.recipient : ""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapRecipient( I18n.t( Keys.recipient ), pendingAddress ? pendingAddress.recipient : "", I18n.t( Keys.plz_input_recipient ), pendingAddress,
                            ( value ) => {
                                this.setState( {
                                    pendingAddress: Object.assign( {}, pendingAddress, { recipient: value } )
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (this.state.showError && !pendingAddress.recipient) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#ff0000'
                                    }
                                }>
                                    {I18n.t( Keys.plz_input_recipient )}
                                </Text>
                            </View>
                            : null
                    }
                </TouchableItemComponent>
                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.phone )}
                    content={pendingAddress ? pendingAddress.mobile : ""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapMobile( I18n.t( Keys.recipient_phone ), pendingAddress ? pendingAddress.mobile : "", I18n.t( Keys.plz_input_phone ), pendingAddress,
                            ( value ) => {
                                this.setState( {
                                    pendingAddress: Object.assign( {}, pendingAddress, { mobile: value } )
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {(this.state.showError && !pendingAddress.mobile) ?
                        <View>
                            <Text style={
                                {
                                    color: '#ff0000'
                                }
                            }>
                                {I18n.t( Keys.plz_input_mobile )}
                            </Text>
                        </View>
                        :
                        null
                    }
                </TouchableItemComponent>
                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.select_area )}
                    content={pendingAddress ? pendingAddress.areaDisplay : ""}
                    onPress={() => {
                        this.onTapArea();
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {(this.state.showError && !pendingAddress.area) ?
                        <View>
                            <Text style={
                                {
                                    color: '#ff0000'
                                }
                            }>
                                {I18n.t( Keys.plz_input_area )}
                            </Text>
                        </View>
                        : null
                    }
                </TouchableItemComponent>
                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.street_address )}
                    content={pendingAddress ? pendingAddress.address : ""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapAddress( I18n.t( Keys.street_address ), pendingAddress ? pendingAddress.address : "", I18n.t( Keys.plz_input_address ), pendingAddress,
                            ( value ) => {
                                this.setState( {
                                    pendingAddress: Object.assign( {}, pendingAddress, { address: value } )
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (this.state.showError && !pendingAddress.address) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#ff0000'
                                    }
                                }>
                                    {I18n.t( Keys.plz_input_address )}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>
                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.postcode )}
                    content={pendingAddress ? pendingAddress.postalCode : ""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapPostalCode( I18n.t( Keys.postcode ), pendingAddress ? pendingAddress.postalCode : "", I18n.t( Keys.plz_input_postcode ), pendingAddress,
                            ( value ) => {
                                this.setState( {
                                    pendingAddress: Object.assign( {}, pendingAddress, { postalCode: value } )
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (this.state.showError && !pendingAddress.postalCode) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#ff0000'
                                    }
                                }>
                                    {I18n.t( Keys.plz_input_postcode )}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>

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

export default AddDeliverAddressPageView;
