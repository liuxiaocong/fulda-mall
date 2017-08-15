import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-datepicker";
import Toast from "react-native-root-toast";
import ImagePicker from "react-native-image-crop-picker";
import Picker from "react-native-picker";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import TouchableItemComponent from "../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../util/Util";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import ImageWithPlaceHolder from "../../components/ImageWithPlaceHolder";
import { memberGetFavoritesIds } from "../../actions/MemberAction";

const styles = StyleSheet.create( {} );
class MyInfoPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.personal_info ),
        };
    };

    constructor( props ) {
        super( props );

        let areaList = props.areaList ? props.areaList : {};
        let ret = Util.buildAreaPickDate( areaList );
        let areaPickerData = ret[ 0 ];
        let areaNameDataMap = ret[ 1 ];
        let areaCodeDataMap = ret[ 2 ];
        this.state = {
            avatar: props.user.logo,
            idPhoto: props.user.idPhoto,
            areaList: areaList,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap,
            isRequesting: false
        };
    }


    componentWillReceiveProps( nextProps ) {
        const nextState = {};

        nextState[ 'avatar' ] = nextProps.user.logo;
        nextState[ 'idPhoto' ] = nextProps.user.idPhoto;
        nextState[ 'areaList' ] = nextProps.user.areaList;

        if ( nextProps.areaList ) {
            let ret = Util.buildAreaPickDate( nextProps.areaList );
            let areaPickerData = ret[ 0 ];
            let areaNameDataMap = ret[ 1 ];
            let areaCodeDataMap = ret[ 2 ];

            nextState[ 'areaPickerData' ] = areaPickerData;
            nextState[ 'areaNameDataMap' ] = areaNameDataMap;
            nextState[ 'areaCodeDataMap' ] = areaCodeDataMap;
        }

        this.setState( nextState );
    }

    componentWillMount() {
        this.props.navigation.dispatch( memberGetFavoritesIds( null ) );
    }

    componentDidMount() {
        if ( this.state.areaList === null || Object.keys( this.state.areaList ).length === 0 ) {
            this.props.getAreaList();
        }
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    onTapAvatar() {
        ImagePicker.openPicker(
            {
                width: 300,
                height: 300,
                cropping: true
            }
        ).then(
            ( image ) => {
                if ( !image ) {
                    return;
                }

                this.setState(
                    {
                        isRequesting: true,
                        avatar: image.path
                    }
                );

                this.props.updateMemberLogo(
                    this.props.user.id, image.path, ( err, res ) => {
                        this.setState(
                            {
                                isRequesting: false,
                                avatar: !err ? image.path : this.props.user.logo
                            }
                        );

                        if ( !err ) {
                            Toast.show( I18n.t( Keys.update_success ) );
                        } else {
                            Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message );
                        }
                    }
                );
            }
        ).catch( error => {
            console.log( error.message );
        } );
    }

    onTapIdPhoto() {
        ImagePicker.openPicker(
            {
                width: 500,
                height: 500,
                cropping: true
            }
        ).then(
            ( image ) => {
                if ( !image ) {
                    return;
                }

                this.setState(
                    {
                        isRequesting: true,
                        idPhoto: image.path
                    }
                );

                this.props.updateMemberIdPhoto(
                    this.props.user.id, image.path, ( err, res ) => {
                        this.setState(
                            {
                                isRequesting: false,
                                idPhoto: !err ? image.path : this.props.user.idPhoto
                            }
                        );

                        if ( !err ) {
                            Toast.show( I18n.t( Keys.update_success ) );
                        } else {
                            Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message );
                        }
                    }
                );
            }
        ).catch( error => {
            console.log( error.message );
        } );
    }

    onTapArea() {
        let areaObj1 = this.state.areaCodeDataMap[ this.props.user.area1 ];
        let areaObj2 = this.state.areaCodeDataMap[ this.props.user.area2 ];
        let areaObj3 = this.state.areaCodeDataMap[ this.props.user.area3 ];

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
                pickerData: this.state.areaPickerData,
                selectedValue: selectedValue,
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                pickerTitleText: I18n.t( Keys.select_area ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                onPickerConfirm: data => {
                    console.log( data );
                    let areaObj = this.state.areaNameDataMap[ data[ 2 ] ];
                    this.setArea( areaObj.code );
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

    setArea( areaCode ) {
        this.setState(
            {
                isRequesting: true
            }
        );

        this.props.setArea(
            areaCode, ( err, res ) => {
                this.setState(
                    {
                        isRequesting: false
                    }
                );

                if ( !err ) {
                    Toast.show( I18n.t( Keys.update_success ) );
                } else {
                    Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message );
                }
            }
        )
    }

    setDateOfBirthday( date ) {
        if ( !date ) {
            return;
        }

        this.setState(
            {
                isRequesting: true
            }
        );

        this.props.setBirthday(
            date, ( err, res ) => {
                this.setState(
                    {
                        isRequesting: false
                    }
                );

                if ( !err ) {
                    Toast.show( I18n.t( Keys.update_success ) );
                } else {
                    Toast.show( err.message );
                }
            }
        )
    }

    render() {
        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null ) {
            return (
                <View/>
            );
        }

        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <ScrollView >
                    <View
                        style={[ { paddingTop: 10, paddingBottom: 20 } ]}
                    >
                        {
                            !this.props.finishInfo ?
                                <View
                                    style={[ commonStyles.commonTips, commonStyles.commonBorderTop, commonStyles.commonBorderBottom, {
                                        marginTop: 10,
                                    } ]}>
                                    <Text style={[ commonStyles.commonTipsText ]}>
                                        {I18n.t( Keys.modify_info_tip )}
                                    </Text>
                                </View>
                                :
                                <View style={[ { height: 10 } ]}/>
                        }

                        {!user.payPassSet ?
                            <TouchableItemComponent
                                containerStyle={[ {
                                    marginTop: 10,
                                } ]}
                                title={I18n.t( Keys.paid_password )}
                                onPress={() => {
                                    this.props.onTapPaidPwd()
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
                            style={[ {
                                height: 86,
                            } ]}
                            title={I18n.t( Keys.my_avatar )}
                            onPress={() => {
                                Picker.hide();
                                this.onTapAvatar()
                            }}
                            headerInterval={true}
                            footerInterval={true}>
                            <ImageWithPlaceHolder
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                } }
                                placeholderForSource={require( '../../imgs/bg_avatar.png' )}
                                source={this.state.avatar ? { uri: this.state.avatar } : null}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {
                                marginTop: 10,
                            } ]}
                            title={I18n.t( Keys.name )}
                            content={user.name ? user.name + "" : ""}
                            onPress={() => {
                                Picker.hide();
                                this.props.onTapName()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>


                        <TouchableItemComponent
                            containerStyle={[ {
                                marginTop: 10,
                            } ]}
                            title={I18n.t( Keys.my_name_card )}
                            onPress={() => {
                                Picker.hide();
                                this.props.onTapMyNameCard()
                            }}
                            headerInterval={true}
                            footerInterval={true}>
                            <Image
                                style={{
                                    width: 18,
                                    height: 18
                                }}
                                source={require( '../../imgs/ic_qrc.png' )}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {
                                marginTop: 10,
                            } ]}
                            style={[ {
                                height: 85,
                            } ]}
                            title={I18n.t( Keys.my_id_photo )}
                            onPress={() => {
                                if ( user.idPhoto === null || user.idPhoto === "" ) {
                                    Picker.hide();
                                    this.onTapIdPhoto();
                                }
                            }}
                            headerInterval={true}
                            footerInterval={true}>
                            <ImageWithPlaceHolder
                                style={ {
                                    width: 60,
                                    height: 60,
                                    borderRadius: 5,
                                } }
                                placeholderForIcon={this.state.idPhoto ? 'md-image' : null}
                                source={this.state.idPhoto ? { uri: this.state.idPhoto } : null}
                                emptyTip={I18n.t( Keys.upload_credentials )}
                                emptyTipColor={(!this.props.finishInfo && (user.idPhoto === null || user.idPhoto === "")) ? '#ff0000' : 'white'}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.id_number )}
                            content={user.idNo ? user.idNo + "" : ""}
                            onPress={() => {
                                if ( user.idNo === null || user.idNo === "" ) {
                                    Picker.hide();
                                    this.props.onTapIdCard()
                                }
                            }}
                            headerInterval={false}
                            footerInterval={true}>
                            {
                                (!this.props.finishInfo && (user.idNo === null || user.idNo === "")) ?
                                    <View>
                                        <Text style={
                                            {
                                                color: '#ff0000'
                                            }
                                        }>
                                            {I18n.t( Keys.id_number )}
                                        </Text>
                                    </View>
                                    :
                                    null
                            }
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.sex )}
                            content={user.gender === 1 ? I18n.t( Keys.male ) : I18n.t( Keys.female )}
                            onPress={() => {
                                Picker.hide();
                                this.props.onTapGender()
                            }}
                            headerInterval={false}
                            footerInterval={true}/>
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.birthday )}
                            onPress={() => {
                                if ( this.datePicker ) {
                                    Picker.hide();
                                    this.datePicker.onPressDate();
                                }
                            }}
                            headerInterval={false}
                            footerInterval={true}>
                            <DatePicker
                                date={Util.getDateOfBirthdayDescription( user.dob )}
                                mode="date"
                                placeholder={''}
                                format="YYYY-MM-DD"
                                minDate="1916-05-01"
                                maxDate="2016-5-20"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                ref={( datePicker ) => {
                                    this.datePicker = datePicker;
                                }}
                                style={[ {} ]}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        alignItems: 'flex-end',
                                        borderWidth: 0,
                                    },
                                    dateTouchBody: {
                                        height: 18
                                    },
                                    dateText: {
                                        fontSize: 14,
                                        color: '#717789',
                                    },
                                    btnTextCancel: {
                                        color: constStyles.PICKER_CANCEL_COLOR_CODE
                                    },
                                    btnTextConfirm: {
                                        color: constStyles.PICKER_CONFIRM_COLOR_CODE
                                    }

                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={( date ) => {
                                    this.setDateOfBirthday( date )
                                }}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {
                                marginTop: 10,
                            } ]}
                            title={I18n.t( Keys.email )}
                            content={user.email ? user.email + "" : ""}
                            hideRightNav={user.email !== null && user.email !== ""}
                            onPress={() => {
                                Picker.hide();
                                if ( !user.emailVerified ) {
                                    this.props.onTapEmail()
                                }
                            }}
                            headerInterval={true}
                            footerInterval={true}
                            leftElement={
                                !user.emailVerified ?
                                    <View style={[ { marginLeft: 10 } ]}>
                                        <Text style={[
                                            {
                                                color: '#ff0000'
                                            } ]}>
                                            {I18n.t( Keys.un_pass_verify )}
                                        </Text>
                                    </View>
                                    :
                                    null
                            }
                        />
                        <TouchableItemComponent
                            containerStyle={[ {
                                marginBottom: 10,
                            } ]}
                            title={I18n.t( Keys.mobile_number )}
                            content={user.mobile ? user.mobile + "" : ""}
                            onPress={() => {
                                Picker.hide();
                                if ( !user.mobileVerified ) {
                                    this.props.onTapMobile();
                                }
                            }}
                            hideRightNav={user.mobile !== null && user.mobile !== ""}
                            headerInterval={false}
                            footerInterval={true}
                            leftElement={
                                !user.mobileVerified ?
                                    <View style={[ { marginLeft: 10 } ]}>
                                        <Text style={[
                                            {
                                                color: '#ff0000'
                                            } ]}>
                                            {I18n.t( Keys.un_pass_verify )}
                                        </Text>
                                    </View>
                                    :
                                    null
                            }
                        />

                        <TouchableItemComponent
                            containerStyle={[ {
                                marginBottom: 10,
                            } ]}
                            title={I18n.t( Keys.belong_area )}
                            content={user.area3 && this.state.areaCodeDataMap[ user.area3 ] ? this.state.areaCodeDataMap[ user.area3 ].name + "" : user.area3Name}
                            onPress={() => {
                                this.onTapArea()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            containerStyle={[ {
                                marginBottom: 10,
                            } ]}
                            title={I18n.t( Keys.street_address )}
                            content={user.address ? user.address + "" : ""}
                            onPress={() => {
                                Picker.hide();
                                this.props.onTapAddress()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.postcode )}
                            content={user.postalCode ? user.postalCode : ""}
                            onPress={() => {
                                Picker.hide();
                                this.props.onTapPostcode()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>
                    </View>
                </ScrollView>
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

export default MyInfoPageView;
