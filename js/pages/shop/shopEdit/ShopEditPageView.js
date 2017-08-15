import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-root-toast";
import ImagePicker from "react-native-image-crop-picker";
import Picker from "react-native-picker";
import RNGooglePlaces from "react-native-google-places";
import Icon from "react-native-vector-icons/Ionicons";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../../util/Util";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";

const styles = StyleSheet.create( {} );
class ShopEditPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.core_setting ),
        };
    };

    constructor( props ) {
        super( props );
        let categoryList = [];
        if ( props.categoryList ) {
            categoryList = props.categoryList;
        }
        let ret = Util.buildCategoryPickDate( categoryList );
        let pickerData = ret[ 0 ];
        let dataMap = ret[ 1 ];

        let areaList = {};
        if ( props.areaList ) {
            areaList = props.areaList;
        }
        let areaRet = Util.buildAreaPickDate( areaList );
        let areaPickerData = areaRet[ 0 ];
        let areaNameDataMap = areaRet[ 1 ];
        let areaCodeDataMap = areaRet[ 2 ];
        this.state = {
            shopInfo: props.shopInfo,
            categoryList: categoryList,
            isRequesting: false,
            pickerData: pickerData,
            dataMap: dataMap,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap,
            areaDisplay: ""
        };
        this.props.getShopInfo(
            this.props.user.id, ( err, resBody ) => {

            }
        );
    }

    componentWillReceiveProps( nextProps ) {

        let ret = Util.buildCategoryPickDate( nextProps.categoryList );
        let pickerData = ret[ 0 ];
        let dataMap = ret[ 1 ];


        let areaRet = Util.buildAreaPickDate( nextProps.areaList );
        let areaPickerData = areaRet[ 0 ];
        let areaNameDataMap = areaRet[ 1 ];


        this.setState( {
            shopInfo: nextProps.shopInfo,
            categoryList: nextProps.categoryList,
            pickerData: pickerData,
            dataMap: dataMap,
            areaList: nextProps.areaList,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap
        } );
    }

    componentDidMount() {

    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    onTapShopLogo() {
        ImagePicker.openPicker(
            {
                width: 300,
                height: 300,
                cropping: true
            }
        ).then(
            image => {
                if ( image ) {
                    this.setState( { isRequesting: true } );
                    this.props.updateShopLogo(
                        this.state.shopInfo.id, image.path, ( err, res ) => {
                            this.setState( { isRequesting: false } );
                            if ( !err ) {
                                Toast.show( I18n.t( Keys.set_success ) )
                            } else {
                            }
                            Toast.show( I18n.t( Keys.set_fail ) + ': ' + err.message )
                        }
                    )

                }
            }
        ).catch( error => {
            console.log( error.message );
        } );
    };


    onTapArea() {
        let areaObj1 = this.state.areaCodeDataMap[ this.state.shopInfo.area1 ];
        let areaObj2 = this.state.areaCodeDataMap[ this.state.shopInfo.area2 ];
        let areaObj3 = this.state.areaCodeDataMap[ this.state.shopInfo.area3 ];

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
                pickerTitleText: I18n.t( Keys.select_area ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                onPickerConfirm: data => {
                    let areaObj = this.state.areaNameDataMap[ data[ 2 ] ];
                    if ( areaObj ) {
                        this.setState( {
                            isRequesting: true
                        } );

                        this.props.updateShopArea( this.state.shopInfo.id, areaObj.code, ( err, resBody ) => {
                            this.setState( {
                                isRequesting: false
                            } );

                            if ( !err ) {
                                Toast.show( I18n.t( Keys.set_success ) )
                            } else {
                                Toast.show( I18n.t( Keys.set_fail ) + ': ' + err.messaage )
                            }
                        } );
                    }
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
    };

    onTapShopBanner() {
        const imageWidth = Dimensions.get( 'window' ).width;
        const imageHeight = imageWidth * 130 / 375;

        ImagePicker.openPicker(
            {
                width: imageWidth,
                height: imageHeight,
                cropping: true
            }
        ).then(
            image => {
                if ( image ) {
                    this.setState( { isRequesting: true } );
                    this.props.updateShopBanner(
                        this.state.shopInfo.id, image.path, ( err, res ) => {
                            this.setState( { isRequesting: false } );
                            if ( !err ) {
                                Toast.show( I18n.t( Keys.set_success ) )
                            } else {
                                Toast.show( I18n.t( Keys.set_fail ) + ': ' + err.messaage )
                            }
                        }
                    )

                }
            }
        ).catch( error => {
            console.log( error.message );
        } );
    };

    onTapLocation() {
        const query = {};

        if ( this.state.shopInfo.lat && this.state.shopInfo.lng ) {
            query[ 'latitude' ] = this.state.shopInfo.lat;
            query[ 'longitude' ] = this.state.shopInfo.lng;
        }


        RNGooglePlaces.openPlacePickerModal( query )
            .then( ( placeDetail ) => {
                this.setState( {
                    isRequesting: true,
                } );
                this.props.shopUpdateLocation( placeDetail.latitude, placeDetail.longitude, ( error, resBody ) => {
                    this.setState( {
                        isRequesting: false,
                    } );

                    if ( error ) {
                        Toast.show( error.message );
                    }
                } );
            } )
            .catch( error => {
                Toast.show( error.message );
            } );
    }


    render() {
        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null || user === null ) {
            return (
                <View/>
            );
        }
        let shopInfo = this.state.shopInfo;
        if ( shopInfo === null || shopInfo === {} ) {
            return (
                <View/>
            );
        }
        let areaDisplay = this.state.shopInfo.area3Name;
        if ( this.state.areaCodeDataMap[ this.state.shopInfo.area3 ] ) {
            areaDisplay = this.state.areaCodeDataMap[ this.state.shopInfo.area3 ].name;
        }
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <ScrollView
                    style={{}}>
                    <View style={[ { paddingTop: 20, paddingBottom: 20 } ]}>
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.shop_name )}
                            content={shopInfo ? shopInfo.name : ""}
                            onPress={() => {
                                this.props.onTapShopName()
                            }}
                            headerInterval={true}
                            footerInterval={false}>
                        </TouchableItemComponent>
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.fulda_use_able_cash )}
                            content={shopInfo.discount + "%"}
                            onPress={() => {
                                this.props.onTapMerchantFees( shopInfo.discountExpiry )
                            }}
                            headerInterval={true}
                            footerInterval={false}/>
                        {/*<TouchableItemComponent*/}
                        {/*containerStyle={[{}]}*/}
                        {/*title={I18n.t(Keys.current_template)}*/}
                        {/*content={I18n.t(Keys.default_template)}*/}
                        {/*onPress={() => {*/}

                        {/*}}*/}
                        {/*headerInterval={true}*/}
                        {/*footerInterval={false}>*/}
                        {/*</TouchableItemComponent>*/}
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.main_business )}
                            content={shopInfo.business}
                            onPress={() => {
                                this.props.onTapBusiness()
                            }}
                            headerInterval={true}
                            footerInterval={false}>
                        </TouchableItemComponent>


                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.description )}
                            content={shopInfo.intro}
                            onPress={() => {
                                this.props.onTapIntro()
                            }}
                            headerInterval={true}
                            footerInterval={false}>
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.phone )}
                            content={shopInfo ? shopInfo.telephone : ""}
                            onPress={() => {
                                this.props.onTapTelephone()
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.mobile_number )}
                            content={shopInfo ? shopInfo.mobile : ""}
                            onPress={() => {
                                this.props.onTapMobile()
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.belong_area )}
                            content={areaDisplay}
                            onPress={() => {
                                this.onTapArea()
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.address )}
                            content={shopInfo ? shopInfo.address : ""}
                            onPress={() => {
                                this.props.onTapAddress()
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.lat_and_lon )}
                            onPress={() => {
                                this.onTapLocation()
                            }}
                            headerInterval={true}
                            footerInterval={true}>
                            <Icon
                                name={'md-locate'}
                                size={18}
                                color={'#717789'}>
                            </Icon>
                        </TouchableItemComponent>


                        <TouchableItemComponent
                            containerStyle={[ { marginTop: 10, } ]}
                            style={{
                                height: 85
                            }}
                            title={I18n.t( Keys.shop_logo )}
                            onPress={() => {
                                this.onTapShopLogo()
                            }}
                            headerInterval={true}
                            footerInterval={false}>
                            <ImageWithPlaceHolder
                                style={ {
                                    width: 60,
                                    height: 60,
                                    borderRadius: 5,
                                } }
                                placeholderForIcon={shopInfo && shopInfo.logo ? 'md-image' : null}
                                source={shopInfo && shopInfo.logo ? { uri: shopInfo.logo } : null}
                                emptyTip={I18n.t( Keys.shop_logo )}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            style={{
                                height: 85
                            }}
                            title={I18n.t( Keys.shop_banner )}
                            onPress={() => {
                                this.onTapShopBanner()
                            }}
                            headerInterval={true}
                            footerInterval={true}>
                            <ImageWithPlaceHolder
                                style={ {
                                    width: 90,
                                    height: 60,
                                    borderRadius: 5,
                                } }
                                placeholderForIcon={shopInfo && shopInfo.banner ? 'md-image' : null}
                                source={shopInfo && shopInfo.banner ? { uri: shopInfo.banner } : null}
                                emptyTip={I18n.t( Keys.upload_banner )}
                            />
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={[ { marginTop: 10 } ]}
                            title={I18n.t( Keys.remark )}
                            content={shopInfo ? shopInfo.remark : ""}
                            onPress={() => {
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        {/*<TouchableItemComponent*/}
                        {/*containerStyle={[ {} ]}*/}
                        {/*title="微信二维码"*/}
                        {/*onPress={() => {*/}
                        {/*this.props.onTapWechatBind()*/}
                        {/*}}*/}
                        {/*headerInterval={true}*/}
                        {/*footerInterval={true}/>*/}
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

export default ShopEditPageView;
