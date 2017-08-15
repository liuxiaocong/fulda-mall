import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import Picker from "react-native-picker";
import { netMetaGetCategoryDetail } from "../../../net/MetaNet";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Ionicons";
import format from "string-format";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../../util/Util";
import UrlActionHandlerUtil from "../../../util/UrlActionHandlerUtil";
import Hyperlink from "react-native-hyperlink";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";
const styles = StyleSheet.create( {} );
class ShopOpenPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.become_seller ),
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
        let categoryNameDataMap = ret[ 1 ];
        let categoryIDDataMap = ret[ 2 ];

        let areaList = {};
        if ( props.areaList ) {
            areaList = props.areaList;
        }
        let areaRet = Util.buildAreaPickDate( areaList );
        let areaPickerData = areaRet[ 0 ];
        let areaNameDataMap = areaRet[ 1 ];
        let areaCodeDataMap = areaRet[ 2 ];

        this.state = {
            showUnFinishTips: false,
            pendingShopInfo: props.pendingShopInfo,
            categoryList: categoryList,
            currentCategory: {},
            isRequesting: false,
            pickerData: pickerData,
            categoryNameDataMap: categoryNameDataMap,
            categoryIDDataMap: categoryIDDataMap,
            areaPickerData: areaPickerData,
            areaNameDataMap: areaNameDataMap,
            areaCodeDataMap: areaCodeDataMap,
            shopLogo: "",
            shopIdPhoto: "",
            shopLicensePhoto: "",
            shopBanner: "",
        }
    }

    componentWillReceiveProps( nextProps ) {
        let ret = Util.buildCategoryPickDate( nextProps.categoryList );
        let pickerData = ret[ 0 ];
        let categoryNameDataMap = ret[ 1 ];
        let categoryIDDataMap = ret[ 2 ];

        let areaRet = Util.buildAreaPickDate( nextProps.areaList );
        let areaPickerData = areaRet[ 0 ];
        let areaNameDataMap = areaRet[ 1 ];
        let areaCodeDataMap = areaRet[ 2 ];

        this.setState(
            {
                pendingShopInfo: nextProps.pendingShopInfo,
                categoryList: nextProps.categoryList,
                pickerData: pickerData,
                categoryNameDataMap: categoryNameDataMap,
                categoryIDDataMap: categoryIDDataMap,
                areaList: nextProps.areaList,
                areaPickerData: areaPickerData,
                areaNameDataMap: areaNameDataMap,
                areaCodeDataMap: areaCodeDataMap
            }
        );
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        if ( this.state.categoryList === null || this.state.categoryList.length === 0 ) {
            this.props.getCategoryList(
                ( err, resBody ) => {
                    //Alert.alert( JSON.stringify( resBody ) );
                }
            );
        }
        if ( this.props.areaList === null || Object.keys( this.props.areaList ).length === 0 ) {
            this.props.getAreaList(
                ( err, resBody ) => {
                    //Alert.alert( JSON.stringify( resBody ) );
                }
            );
        }
        if ( this.state.pendingShopInfo !== null && this.state.pendingShopInfo.category > 0 ) {
            this.getCategoryDetailById( this.state.pendingShopInfo.category )
        }
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    onTapSave() {
        this.props.onTapSave();
    };

    onTapShopIdPhoto() {
        ImagePicker.openPicker(
            {
                width: 300,
                height: 300,
                cropping: true
            }
        ).then(
            image => {
                if ( image ) {
                    this.setState(
                        {
                            shopIdPhoto: image.path,
                        }
                    )
                }
            }
        ).catch( error => {
            console.log( error.message );
        } );
    }

    onTapShopLicensePhoto() {
        ImagePicker.openPicker(
            {
                width: 300,
                height: 300,
                cropping: true
            }
        ).then(
            image => {
                if ( image ) {
                    this.setState(
                        {
                            shopLicensePhoto: image.path,
                        }
                    )
                }
            }
        ).catch( error => {
            console.log( error.message );
        } );
    }

    onTapArea() {
        let areaObj1 = null;
        let areaObj2 = null;
        let areaObj3 = this.state.areaCodeDataMap[ this.state.pendingShopInfo.area ];

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
                        this.props.setArea( this.state.pendingShopInfo, areaObj.code );
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

    onTapSubmit() {
        let allDone = false;
        if ( this.state.pendingShopInfo
            && this.state.pendingShopInfo.ownerName
            && this.state.pendingShopInfo.name
            && this.state.pendingShopInfo.intro
            && this.state.pendingShopInfo.business
            && this.state.pendingShopInfo.category
            && this.state.pendingShopInfo.type
            && this.state.pendingShopInfo.area
            && this.state.pendingShopInfo.address
            && this.state.pendingShopInfo.postalCode
            && this.state.pendingShopInfo.lat
            && this.state.pendingShopInfo.lng
            && this.state.pendingShopInfo.telephone
            && this.state.pendingShopInfo.mobile
            && this.state.pendingShopInfo.email
            && this.state.pendingShopInfo.idNo
            && this.state.pendingShopInfo.registerNo
            && this.state.pendingShopInfo.accountNoConfirm
            && this.state.pendingShopInfo.accountNo
            && this.state.pendingShopInfo.bankName
            && this.state.pendingShopInfo.holderName
            && this.state.pendingShopInfo.discount
        ) {
            allDone = true;
        }
        if ( this.state.pendingShopInfo.accountNo !== this.state.pendingShopInfo.accountNoConfirm ) {
            Toast.show( I18n.t( Keys.be_sure_bank_account_the_same ) );
            allDone = false;
        }

        if ( allDone ) {
            this.setState( { isRequesting: true } );
            this.props.onTapSubmit(
                this.state.pendingShopInfo, ( err, resBody ) => {
                    this.setState( { isRequesting: false } );
                    if ( err || resBody.status !== 1 ) {
                        Toast.show( I18n.t( Keys.create_fail ) + ': ' + err.message );
                        //this.setState({error:err + ""})
                    } else {
                        let id = resBody.data.id;
                        if ( this.state.shopLogo ) {
                            this.props.updateShopLogo( id, this.state.shopLogo, null )
                        }
                        if ( this.state.shopIdPhoto ) {
                            this.props.updateShopIdPhoto( id, this.state.shopIdPhoto, null )
                        }
                        if ( this.state.shopLicensePhoto ) {
                            this.props.updateShopLicensePhoto( id, this.state.shopLicensePhoto, null )
                        }
                        if ( this.state.shopBanner ) {
                            this.props.updateShopBanner( id, this.state.shopBanner, null )
                        }
                        this.props.addWithdrawAccount(
                            this.state.pendingShopInfo.accountNo,
                            this.state.pendingShopInfo.bankName,
                            this.state.pendingShopInfo.holderName,
                            ( err, resBody ) => {
                                this.onSuccess();
                            }
                        )
                    }
                }
            )
        } else {
            this.setState( { showUnFinishTips: true } );
        }
    };

    onSuccess() {
        Toast.show( I18n.t( Keys.create_success ) );
        this.props.onSaveSuccess();
    }

    onTapCategory() {
        let categoryObj1 = null;
        let categoryObj2 = null;
        let categoryObj3 = this.state.categoryIDDataMap[ this.state.pendingShopInfo.category ];

        if ( categoryObj3 ) {
            categoryObj2 = this.state.categoryIDDataMap[ categoryObj3.parentId ];
            if ( categoryObj2 ) {
                categoryObj1 = this.state.categoryIDDataMap[ categoryObj2.parentId ];
            }
        }

        const selectedValue = [];

        if ( categoryObj1 ) {
            selectedValue.push( categoryObj1.name );
        }

        if ( categoryObj2 ) {
            selectedValue.push( categoryObj2.name );
        }

        if ( categoryObj3 ) {
            selectedValue.push( categoryObj3.name );
        }

        Picker.init(
            {
                pickerData: this.state.pickerData,
                selectedValue: selectedValue,
                pickerTitleText: I18n.t( Keys.category ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                onPickerConfirm: data => {
                    console.log( data );
                    let category = this.state.categoryNameDataMap[ data[ 2 ] ];
                    this.props.setCategory( this.state.pendingShopInfo, category.id );
                    this.setState(
                        {
                            categoryDisplay: data[ 2 ],
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

    getCategoryDetailById( id ) {
        netMetaGetCategoryDetail(
            id, ( error, res ) => {
                this.setState(
                    {
                        categoryDisplay: res.data.name,
                    }
                )
            }
        )
    }


    render() {
        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null || user === null ) {
            return (
                <View/>
            );
        }
        //let shopInfo = this.props.shopInfo;
        let pendingShopInfo = this.state.pendingShopInfo;
        if ( pendingShopInfo === {} ) {
            pendingShopInfo = null;
        }

        let typeStr = "";
        if ( pendingShopInfo.type ) {
            if ( pendingShopInfo.type === 1 ) {
                typeStr = I18n.t( Keys.online )
            } else if ( pendingShopInfo.type === 2 ) {
                typeStr = I18n.t( Keys.entity )
            }
        }

        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <ScrollView>
                    {this.state.showUnFinishTips ?
                        <View
                            style={[ commonStyles.commonTips, commonStyles.commonBorderTop, commonStyles.commonBorderBottom, {
                                marginTop: 10,
                            } ]}>
                            <Text style={[ commonStyles.commonTipsText ]}>
                                {I18n.t( Keys.plz_finish_info_below )}
                            </Text>
                        </View>
                        :
                        <View style={[ { height: 10 } ]}/>
                    }
                    {
                        this.state.error ?
                            <Text
                                style={[
                                    commonStyles.errorTipStyle
                                ]}>
                                {this.state.error}
                            </Text>
                            :
                            null
                    }
                    <TouchableItemComponent
                        containerStyle={[ { marginTop: 10, } ]}
                        title={I18n.t( Keys.shop_owner_name )}
                        content={pendingShopInfo ? pendingShopInfo.ownerName : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapName( I18n.t( Keys.shop_owner_name ), pendingShopInfo ? pendingShopInfo.ownerName : "", I18n.t( Keys.plz_input_shop_owner_name ), pendingShopInfo );
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.ownerName) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.name )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.shop_name )}
                        content={pendingShopInfo ? pendingShopInfo.name : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapShopName( pendingShopInfo ? pendingShopInfo.name : "", pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.name) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.shop_name )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.fulda_discount_setting )}
                        content={pendingShopInfo && pendingShopInfo.discount ? pendingShopInfo.discount + '%' : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapMerchantFees( pendingShopInfo ? pendingShopInfo.discount : "", pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>

                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.discount) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.fulda_discount_setting )}
                                    </Text>
                                </View>
                                :
                                null
                        }

                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.description )}
                        content={pendingShopInfo ? pendingShopInfo.intro : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapIntro( I18n.t( Keys.description ), pendingShopInfo ? pendingShopInfo.intro : "", I18n.t( Keys.plz_input_shop_description ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.intro) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.description )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.category )}
                        content={this.state.categoryDisplay ? this.state.categoryDisplay : ""}
                        onPress={() => {
                            this.onTapCategory()
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !this.state.categoryDisplay) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.category )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.shop_type )}
                        content={typeStr}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapSelectShopType( pendingShopInfo.type, pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !typeStr) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.shop_type )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.main_business )}
                        content={pendingShopInfo ? pendingShopInfo.business : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapBusiness( I18n.t( Keys.main_business ), pendingShopInfo ? pendingShopInfo.business : "", I18n.t( Keys.plz_input_shop_main_business ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.business) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.main_business )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {
                            marginTop: 10
                        } ]}
                        title={I18n.t( Keys.select_area )}
                        content={this.state.pendingShopInfo.area && this.state.areaCodeDataMap[ this.state.pendingShopInfo.area ] ? this.state.areaCodeDataMap[ this.state.pendingShopInfo.area ].name : ""}
                        onPress={() => {
                            this.onTapArea()
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !this.state.pendingShopInfo.area) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.select_area )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.address )}
                        content={pendingShopInfo ? pendingShopInfo.address : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapAddress( I18n.t( Keys.address ), pendingShopInfo ? pendingShopInfo.address : "", I18n.t( Keys.plz_input_shop_address ), pendingShopInfo );
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.address) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.address )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.postcode )}
                        content={pendingShopInfo ? pendingShopInfo.postalCode : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapPostalCode( I18n.t( Keys.postcode ), pendingShopInfo ? pendingShopInfo.postalCode : "", I18n.t( Keys.plz_input_shop_postal_code ), pendingShopInfo );
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.postalCode) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.postcode )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.lat_and_lon )}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapLocation( pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}>
                        {
                            (this.state.showUnFinishTips && (!pendingShopInfo.lat || !pendingShopInfo.lng)) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.lat_and_lon )}
                                    </Text>
                                </View>
                                :
                                (
                                    pendingShopInfo.lat && pendingShopInfo.lng ?
                                        <Icon
                                            name={'md-locate'}
                                            size={18}
                                            color={'#717789'}>
                                        </Icon>
                                        :
                                        null
                                )
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {
                            marginTop: 10
                        } ]}
                        title={I18n.t( Keys.phone )}
                        content={pendingShopInfo ? pendingShopInfo.telephone : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapTelephone( I18n.t( Keys.phone ), pendingShopInfo ? pendingShopInfo.telephone : "", I18n.t( Keys.plz_input_shop_telephone ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.telephone) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.phone )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.mobile )}
                        content={pendingShopInfo ? pendingShopInfo.mobile : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapMobile( I18n.t( Keys.mobile_number ), pendingShopInfo ? pendingShopInfo.mobile : "", I18n.t( Keys.plz_input_shop_mobile ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.mobile) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.mobile_number )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.email )}
                        content={pendingShopInfo ? pendingShopInfo.email : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapEmail( I18n.t( Keys.email ), pendingShopInfo ? pendingShopInfo.email : "", I18n.t( Keys.plz_input_shop_email ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.email) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.email )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.id_number )}
                        content={pendingShopInfo ? pendingShopInfo.idNo : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapIdNO( I18n.t( Keys.id_number ), pendingShopInfo ? pendingShopInfo.idNo : "", I18n.t( Keys.plz_input_shop_id_no ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.idNo) ?
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
                        containerStyle={[ { marginTop: 10, } ]}
                        style={{
                            height: 85
                        }}
                        title={I18n.t( Keys.upload_credentials )}
                        onPress={() => {
                            Picker.hide();
                            this.onTapShopIdPhoto()
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        <ImageWithPlaceHolder
                            style={ {
                                width: 60,
                                height: 60,
                                borderRadius: 5,
                            } }
                            placeholderForIcon={this.state.shopIdPhoto ? 'md-image' : null}
                            source={this.state.shopIdPhoto ? { uri: this.state.shopIdPhoto } : null}
                            emptyTip={I18n.t( Keys.upload_credentials )}
                        />
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        style={{
                            height: 85
                        }}
                        title={I18n.t( Keys.upload_license )}
                        onPress={() => {
                            this.onTapShopLicensePhoto()
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        <ImageWithPlaceHolder
                            style={ {
                                width: 60,
                                height: 60,
                                borderRadius: 5,
                            } }
                            placeholderForIcon={this.state.shopLicensePhoto ? 'md-image' : null}
                            source={this.state.shopLicensePhoto ? { uri: this.state.shopLicensePhoto } : null}
                            emptyTip={I18n.t( Keys.upload_license )}
                        />
                    </TouchableItemComponent>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.company_register_number )}
                        content={pendingShopInfo ? pendingShopInfo.registerNo : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapRegisterNo( I18n.t( Keys.company_register_number ), pendingShopInfo ? pendingShopInfo.registerNo : "", I18n.t( Keys.plz_input_shop_company_register_number ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.registerNo) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.company_register_number )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <TouchableItemComponent
                        containerStyle={[ { marginTop: 10 } ]}
                        title={I18n.t( Keys.remark )}
                        content={pendingShopInfo ? pendingShopInfo.remark : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapRemark( I18n.t( Keys.remark ), pendingShopInfo ? pendingShopInfo.remark : "", I18n.t( Keys.plz_input_shop_remark ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}/>

                    <View
                        style={{
                            marginTop: 10
                        }}>
                        <Text style={{
                            marginLeft: 15,
                            color: '#b4b8c0',
                            fontSize: 12,
                            marginTop: 3,
                            marginBottom: 3
                        }}>
                            {I18n.t( Keys.withdraw_account_setting )}
                        </Text>
                    </View>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.bank_name )}
                        content={pendingShopInfo ? pendingShopInfo.bankName : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapWithdrawBankName( I18n.t( Keys.bank_name ), pendingShopInfo ? pendingShopInfo.bankName : "", I18n.t( Keys.plz_input_bank_name ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.bankName) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.bank_name )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.bank_account_name )}
                        content={pendingShopInfo ? pendingShopInfo.holderName : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapWithdrawHolderName( I18n.t( Keys.bank_account_name ), pendingShopInfo ? pendingShopInfo.holderName : "", I18n.t( Keys.plz_input_bank_account_name ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.holderName) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.bank_account_name )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.bank_account )}
                        content={pendingShopInfo ? pendingShopInfo.accountNo : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapWithdrawAccountNo( I18n.t( Keys.bank_account ), pendingShopInfo ? pendingShopInfo.accountNo : "", I18n.t( Keys.plz_input_account_no ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={false}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.accountNo) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.bank_account )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>
                    <TouchableItemComponent
                        containerStyle={[ {} ]}
                        title={I18n.t( Keys.input_bank_account_again )}
                        content={pendingShopInfo ? pendingShopInfo.accountNoConfirm : ""}
                        onPress={() => {
                            Picker.hide();
                            this.props.onTapWithdrawConfirmAccountNo( I18n.t( Keys.input_bank_account_again ), pendingShopInfo ? pendingShopInfo.accountNoConfirm : "", I18n.t( Keys.plz_input_account_no ), pendingShopInfo )
                        }}
                        headerInterval={true}
                        footerInterval={true}>
                        {
                            (this.state.showUnFinishTips && !pendingShopInfo.accountNoConfirm) ?
                                <View>
                                    <Text style={
                                        {
                                            color: '#ff0000'
                                        }
                                    }>
                                        {I18n.t( Keys.be_sure_bank_account_the_same )}
                                    </Text>
                                </View>
                                :
                                null
                        }
                    </TouchableItemComponent>

                    <Button
                        containerStyle={[
                            commonStyles.buttonContainerStyle, {
                                marginTop: 40,
                                marginRight: 38,
                                marginLeft: 38,
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={() => this.onTapSubmit()} title={I18n.t( Keys.submit )}>
                        {I18n.t( Keys.create_shop )}
                    </Button>

                    <Hyperlink
                        style={[ {
                            marginTop: 20,
                            marginRight: 48,
                            marginLeft: 48,
                            marginBottom: 20
                        }
                        ]}
                        linkStyle={{
                            color: constStyles.THEME_COLOR,
                            fontSize: 12
                        }}
                        linkText={url => url === UrlActionHandlerUtil.genOpenShopPrivacy()
                            ? I18n.t( Keys.business_agreement_title )
                            : url}
                        onPress={( url ) => {
                            this.props.onTapOpenShopPrivacy( url );
                        }}>
                        <Text
                            style={[ {
                                textAlign: 'center',
                                fontSize: 12
                            }
                            ]}>
                            {
                                format( I18n.t( Keys.submit_open_shop_tips ), " " + UrlActionHandlerUtil.genOpenShopPrivacy() + " " )
                            }
                        </Text>
                    </Hyperlink>

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

export default ShopOpenPageView;
