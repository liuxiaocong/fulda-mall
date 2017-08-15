/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, View } from "react-native";
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

const styles = StyleSheet.create( {} );
class EditDeliverAddressPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.edit_address ),
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
        let pickerData = ret[ 0 ];
        let areaNameDataMap = ret[ 1 ];
        let areaCodeDataMap = ret[ 2 ];

        let pendingAddress = {};
        if ( props.navigation.state.params.pendingAddress ) {
            pendingAddress = props.navigation.state.params.pendingAddress;
        }
        if ( pendingAddress.area3Name ) {
            pendingAddress.areaDisplay = pendingAddress.area3Name;
        }
        if ( pendingAddress.area3 ) {
            pendingAddress.area = pendingAddress.area3;
        }
        this.state = {
            isRequesting: false,
            areaList: areaList,
            pickerData: pickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap,
            pendingAddress: pendingAddress
        };
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        nextState.areaList = nextProps.areaList;
        let ret = Util.buildAreaPickDate( nextProps.areaList );
        let pickerData = ret[ 0 ];
        let areaNameDataMap = ret[ 1 ];
        let areaCodeDataMap = ret[ 2 ];
        nextState.pickerData = pickerData;
        nextState.areaNameDataMap = areaNameDataMap;
        nextState.areaCodeDataMap = areaCodeDataMap;
        return true;
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
        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.pendingAddress, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    Toast.show( err.message )
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        );
    };

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

        Picker.init(
            {
                pickerData: this.state.pickerData,
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
                    footerInterval={false}/>
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
                    footerInterval={false}/>
                <TouchableItemComponent
                    containerStyle={[ {} ]}
                    title={I18n.t( Keys.select_area )}
                    content={pendingAddress ? pendingAddress.areaDisplay : ""}
                    onPress={() => {
                        this.onTapArea();
                    }}
                    headerInterval={true}
                    footerInterval={false}/>
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
                    footerInterval={false}/>
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
                    footerInterval={false}/>

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

export default EditDeliverAddressPageView;
