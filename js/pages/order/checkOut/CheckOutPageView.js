import React from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import Picker from "react-native-picker";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";
import CartGoodsItem from "../component/CartGoodsItem";
import Util from "../../../util/Util";
import shippingType from "../../../../data/shippingType";
import format from "string-format";
import { netOrderCreate } from "../../../net/OrderNet";
import InputPayPasswordComponent from "../../wallet/payPSWD/inputPSWD/InputPayPasswordComponent";
import { paymentOrderPayment } from "../../../actions/PaymentAction";


const { height, width } = Dimensions.get( 'window' );
const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: 'center'
        },
    }
);
class CheckOutPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.settlement ),
        };
    };

    getDefaultAddressId() {
        if ( this.props.deliverAddressList ) {
            for ( let i = 0; i < this.props.deliverAddressList.length; i++ ) {
                if ( this.props.deliverAddressList[ i ].default ) {
                    return this.props.deliverAddressList[ i ].id;
                }
            }
        }
        return 0;
    }

    getAddressFromId( id ) {
        let currentAddress = null;
        if ( id && id > 0 ) {
            if ( this.props.deliverAddressList ) {
                for ( let i = 0; i < this.props.deliverAddressList.length; i++ ) {
                    if ( this.props.deliverAddressList[ i ].id === id ) {
                        currentAddress = Object.assign( {}, this.props.deliverAddressList[ i ] );
                    }
                }
            }
        } else {
            //use default
            if ( this.props.deliverAddressList ) {
                for ( let i = 0; i < this.props.deliverAddressList.length; i++ ) {
                    if ( this.props.deliverAddressList[ i ].default ) {
                        currentAddress = Object.assign( {}, this.props.deliverAddressList[ i ] );
                    }
                }
            }
        }
        return currentAddress;
    }

    // Mounting
    constructor( props ) {
        super( props );
        let currentAddress = {};
        let pendingDeliverAddressId = props.pendingDeliverAddressId;
        if ( !pendingDeliverAddressId || pendingDeliverAddressId < 0 ) {
            pendingDeliverAddressId = this.getDefaultAddressId();
        }
        this.state = {
            isRequesting: false,
            user_name: props.user_name,
            pendingDeliverAddressId: pendingDeliverAddressId,
            isPayPSWDInputOpen: false,
        };
    }

    _renderItem = ( { item } ) => {
        let amount = 0;
        if ( item && item.goods && item.goods.length > 0 ) {
            for ( let i = 0; i < item.goods.length; i++ ) {
                amount = amount + (item.goods[ i ].singlePrice * item.goods[ i ].quantity);
            }
        }
        let remark = "";
        if ( item.remark ) {
            remark = item.remark + "";
        }
        return (
            <View>
                <View
                    style={{ flex: 1, height: 40, overflow: 'hidden', backgroundColor: constStyles.COMMON_GREY_BG, }}>
                    <View style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexGrow: 1,
                            backgroundColor: "#ffffff",
                            height: 39,
                            paddingRight: 10,
                            paddingLeft: 10
                        }
                    }>
                        <ImageWithPlaceHolder
                            style={{
                                width: 28,
                                height: 28
                            } }
                            placeholderForIcon={'md-image'}
                            source={item.logo ? { uri: item.logo } : null}
                        />
                        <Text
                            numberOfLines={1}
                            style={
                                {
                                    color: '#3e3c43',
                                    fontSize: 17,
                                    marginLeft: 10
                                }
                            }>
                            {item.name}
                        </Text>
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                </View>
                {item.goods.map( ( good ) => {
                    return (
                        <CartGoodsItem
                            { ...this.props }
                            key={'good id = ' + good.id}
                            data={good}
                            isEditModel={false}
                            isEditAble={false}
                            onQuantityChanged={null}
                            onSelectStatusChanged={null}
                            onSelectPendingDeleteGoods={null}
                            pendingDeleteShopIds={[]}
                        />
                    )
                } )}
                <TouchableItemComponent
                    containerStyle={{}}
                    title={I18n.t( Keys.client_comments )}
                    content={""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapClientComment( item.id, I18n.t( Keys.client_comments ), remark, "" );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (item.remark) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#717789'
                                    }
                                }>
                                    {item.remark + ""}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>

                <TouchableItemComponent
                    containerStyle={{}}
                    title={I18n.t( Keys.shop_discount )}
                    content={""}
                    onPress={() => {
                        Picker.hide();
                        this.props.onTapShopDiscount( item.id );
                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (item.shopDiscount) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#717789'
                                    }
                                }>
                                    {item.shopDiscount + ""}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>

                <TouchableItemComponent
                    containerStyle={{}}
                    title={I18n.t( Keys.shipping )}
                    content={""}
                    onPress={() => {
                        Picker.hide();
                        this.onTapShipping( item.id );
                    }}
                    headerInterval={true}
                    footerInterval={true}>
                    {
                        (item.shipping) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#717789'
                                    }
                                }>
                                    {item.shipping + ""}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>
                <View style={
                    {
                        height: 40,
                        paddingLeft: 15,
                        paddingRight: 15,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }
                }>
                    <Text style={{
                        color: '#3e3c43',
                        fontSize: 14
                    }}>{I18n.t( Keys.shop_amount_include_shipping ) + Util.getShowPrice( this.props.user.currency, amount )}</Text>
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>


        )
    };

    onTapShipping( shopId ) {
        let data = [];
        let valueData = [];
        if ( shippingType && shippingType.length > 0 ) {
            for ( let i = 0; i < shippingType.length; i++ ) {
                let obj = shippingType[ i ];
                if ( obj.key && obj.value ) {
                    data.push( I18n.t( obj.key ) );
                    valueData.push( I18n.t( obj.value ) );
                }
            }
        }
        let that = this;
        //noinspection JSUnusedGlobalSymbols
        Picker.init(
            {
                pickerData: data,
                selectedValue: valueData,
                pickerTitleText: I18n.t( Keys.shipping ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                onPickerConfirm: data => {
                    Toast.show( data[ 0 ] );
                    that.props.onSaveShipping( shopId, data[ 0 ] );
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

    _renderHeader = () => {
        let hasAddress = false;
        let address = this.getAddressFromId( this.state.pendingDeliverAddressId );
        if ( address && address.id > 0 ) {
            hasAddress = true;
        }
        return (
            <View>
                {
                    hasAddress ?
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
                                            this.props.onTapSelectDeliverAddress();
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
                                address &&
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
                                        >{ address.recipient}</Text>
                                        <View style={{
                                            flexGrow: 1,
                                            alignItems: 'flex-end'
                                        }}>
                                            <Text
                                                style={styles.value_style}
                                            >{ address.mobile}</Text>
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
                                        >{ CheckOutPageView.getAddress( address )}</Text>
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
                                        >{ address.postalCode}</Text>
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
                        :
                        <View
                            style={
                                {
                                    height: 100,
                                    flex: 1,
                                    width: width,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: constStyles.COMMON_GREY_BG
                                }
                            }>
                            <Text style={[ commonStyles.emptyTipStyle, {
                                fontSize: 12
                            } ]}>
                                {I18n.t( Keys.empty_address_data )}
                            </Text>
                            <TouchableOpacity
                                style={
                                    {
                                        backgroundColor: '#ffc515',
                                        height: 30,
                                        width: 80,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        marginTop: 15
                                    }
                                }
                                onPress={() => {
                                    this.props.onTapAddress();
                                }}
                            >
                                <Text style={
                                    {
                                        fontSize: 12,
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }
                                }>{I18n.t( Keys.add_now )}</Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        )
    };

    static getAddress( addressObj ) {
        return addressObj.address + " / " + addressObj.area3Name;
    };

    _renderFooter = () => {
        return (
            <View style={
                {
                    height: 54,
                    backgroundColor: constStyles.COMMON_GREY_BG
                }
            }>
                <View
                    style={
                        {
                            height: 44,
                            marginTop: 10,
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            paddingLeft: 15,
                        }
                    }
                >
                    <Text
                        numberOfLines={2}
                        style={
                            {
                                color: '#717789',
                                fontSize: 14,
                                flexGrow: 1
                            }
                        }>{format( I18n.t( Keys.total_s_goods_should_paid_s ), this.getTotalItem(), Util.getShowPrice( this.props.user.currency, this.getTotalPrice() ) )}</Text>

                    <TouchableOpacity
                        style={
                            {
                                backgroundColor: '#ffc515',
                                height: 44,
                                width: 100,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        }
                        onPress={() => {
                            this.onTapSubmit();
                        }}
                    >
                        <Text style={
                            {
                                fontSize: 16,
                                color: '#fff',
                            }
                        }>{I18n.t( Keys.submit_order )}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    onTapSubmit() {
        let shoppingCardItems = this.props.shoppingCartItems;
        let addDataArray = [];
        let newShoppingCardItemsAfterSuccess = [];
        if ( shoppingCardItems && shoppingCardItems.length > 0 ) {
            for ( let i = 0; i < shoppingCardItems.length; i++ ) {
                let shoppingCardItemObj = shoppingCardItems[ i ];
                let pendingGoods = [];
                let selectIndex = 0;
                let addObject = {};
                for ( let j = 0; j < shoppingCardItemObj.goods.length; j++ ) {
                    if ( shoppingCardItemObj.goods[ j ].isSelect ) {
                        addObject.shopId = shoppingCardItemObj.id;
                        addObject.addressId = this.state.pendingDeliverAddressId;
                        let idKey = "goods[" + selectIndex + "].id";
                        let quantityKey = "goods[" + selectIndex + "].quantity";
                        let attributesKey = "goods[" + selectIndex + "].attributes";
                        addObject[ idKey ] = shoppingCardItemObj.goods[ j ].id;
                        addObject[ quantityKey ] = shoppingCardItemObj.goods[ j ].quantity;
                        addObject[ attributesKey ] = Util.getOrderAttribute( shoppingCardItemObj.goods[ j ].selectTypesMap );
                        addObject.remark = shoppingCardItemObj.remark;
                        selectIndex++;
                    } else {
                        pendingGoods.push( shoppingCardItemObj.goods[ j ] );
                    }
                }
                if ( addObject.shopId && addObject.shopId > 0 ) {
                    addDataArray.push( addObject );
                }
                if ( pendingGoods.length > 0 ) {
                    let newShoppingCardItemObj = Object.assign( {}, shoppingCardItemObj );
                    newShoppingCardItemObj.goods = pendingGoods;
                    newShoppingCardItemsAfterSuccess.push( newShoppingCardItemObj )
                }
            }
        }
        if ( addDataArray.length > 0 ) {
            if ( addDataArray.length > 1 ) {
                Toast.show( I18n.t( Keys.choose_only_one_shop_to_pay ) );
                return;
            }
            let successRetCount = 0;
            let targetRet = addDataArray.length;
            for ( let k = 0; k < addDataArray.length; k++ ) {
                let data = addDataArray[ k ];
                netOrderCreate( data, ( err, res ) => {
                    console.log( err );
                    if ( !err ) {
                        successRetCount++;
                        this.orderId = res.data.id;
                    }
                    targetRet--;
                    if ( targetRet === 0 ) {
                        if ( successRetCount === addDataArray.length ) {
                            this.onSubmitSuccess( newShoppingCardItemsAfterSuccess );
                        } else {
                            CheckOutPageView.onSubmitFail();
                        }
                    }
                } )
            }
        }
    }

    onSubmitSuccess( newShoppingCardItemsAfterSuccess ) {
        this.props.updateShoppingCartItems( newShoppingCardItemsAfterSuccess );
        this.setState( {
            isPayPSWDInputOpen: true,
        } );
        // Alert.alert(
        // 	I18n.t( Keys.paid_password ),
        // 	this.getTotalPrice()+"",
        // 	[
        // 		{
        // 			text: I18n.t( Keys.use_third_party_paid ), onPress: () => {
        //
        // 		}, style: 'cancel'
        // 		},
        // 		{
        // 			text: I18n.t( Keys.paid_later ), onPress: () => {
        //
        // 		}
        // 		},
        // 	],
        // 	{ cancelable: true }
        // )

    }

    static onSubmitFail() {
        Toast.show( I18n.t( Keys.submit_fail ) )
    }

    buildSectionListData() {
        let ret = [];
        let data = Object.assign( [], this.props.shoppingCartItems );
        let filterDataWithoutUnSelect = [];
        if ( data ) {
            for ( let j = 0; j < data.length; j++ ) {
                let shopGoodsItem = data[ j ];
                let filterGoods = [];
                let goods = shopGoodsItem.goods;
                for ( let i = 0; i < goods.length; i++ ) {
                    let good = goods[ i ];
                    if ( good.isSelect ) {
                        filterGoods.push( good );
                    }
                }
                if ( filterGoods.length > 0 ) {
                    let add = Object.assign( {}, shopGoodsItem );
                    add.goods = filterGoods;
                    filterDataWithoutUnSelect.push( add );
                }
            }
        }

        return filterDataWithoutUnSelect;
    }

    doTransfer = ( password ) => {
        if ( !this.orderId ) {
            return;
        }
        this.setState( {
            isRequesting: true
        } );
        this.props.navigation.dispatch( paymentOrderPayment(
            this.orderId, this.getTotalPrice(), password, ( err, res ) => {
                this.setState(
                    {
                        isRequesting: false,
                    }
                );
                if ( err ) {
                    Toast.show( err + "" )
                } else {
                    //noinspection JSCheckFunctionSignatures
                    Alert.alert(
                        I18n.t( Keys.paid_success ),
                        "",
                        [
                            {
                                text: I18n.t( Keys.cancel ), onPress: () => {
                                this.props.navigation.goBack();
                            }, style: 'cancel'
                            },
                            {
                                text: I18n.t( Keys.view_order ), onPress: () => {
                                this.props.navigation.navigate( "userOrderPage" )
                            }
                            },
                        ],
                        { cancelable: true }
                    )

                }
            }
        ) );
    };

    doDelay = () => {
        Toast.show( I18n.t( Keys.create_order_success ) );
        this.props.navigation.goBack();
    };

    doCancel = () => {

    };

    render() {
        let data;
        let isEmpty = true;
        let customButtons = [];
        let obj = {};
        obj.title = I18n.t( Keys.paid_later );
        obj.action = this.doDelay;
        customButtons.push( obj );
        // let obj2 = {};
        // obj2.title = I18n.t( Keys.cancel );
        // obj2.action = this.doCancel;
        // customButtons.push( obj2 );
        data = this.buildSectionListData();
        if ( data && data.length > 0 ) {
            isEmpty = false;
        }
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                {
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
                                {I18n.t( Keys.empty_shopping_cart )}
                            </Text>
                        </View>

                        :
                        <FlatList
                            style={{
                                flexGrow: 1,
                            }}
                            renderItem={this._renderItem}
                            data={data}
                            ListHeaderComponent={this._renderHeader}
                            ListFooterComponent={this._renderFooter}
                        >

                        </FlatList>
                }
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

    getTotalItem() {
        let ret = 0;
        if ( this.state.shoppingCartItems && this.state.shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < this.state.shoppingCartItems.length; i++ ) {
                let shopGoods = this.state.shoppingCartItems[ i ];
                if ( shopGoods.goods && shopGoods.goods.length > 0 ) {
                    for ( let j = 0; j < shopGoods.goods.length; j++ ) {
                        let goods = shopGoods.goods[ j ];
                        if ( goods.isSelect ) {
                            ret = ret + 1;
                        }
                    }
                }
            }
        }
        return ret;
    }

    getTotalPrice() {
        let price = 0;
        if ( this.state.shoppingCartItems && this.state.shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < this.state.shoppingCartItems.length; i++ ) {
                let shopGoods = this.state.shoppingCartItems[ i ];
                if ( shopGoods.goods && shopGoods.goods.length > 0 ) {
                    for ( let j = 0; j < shopGoods.goods.length; j++ ) {
                        let goods = shopGoods.goods[ j ];
                        if ( goods.isSelect ) {
                            price = price + (goods.singlePrice * goods.quantity);
                        }
                    }
                }
            }
        }
        return price;
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        this.props.getDeliverAddressList(
            ( err, resBody ) => {

            }
        );
    }

    //End Mounting

    //Updating
    //noinspection JSMethodCanBeStatic
    componentWillReceiveProps( nextProps ) {
        console.log( "componentWillReceiveProps" );
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        return true;
    }

    componentWillUpdate( nextProps, nextState ) {
        nextState.shoppingCartItems = nextProps.shoppingCartItems;
        nextState.deliverAddressList = nextProps.deliverAddressList;
        let pendingDeliverAddressId = nextProps.pendingDeliverAddressId;
        if ( !pendingDeliverAddressId || pendingDeliverAddressId < 0 ) {
            pendingDeliverAddressId = this.getDefaultAddressId();
        }
        nextState.pendingDeliverAddressId = pendingDeliverAddressId
    }

    //noinspection JSMethodCanBeStatic
    componentDidUpdate( prevProps, prevState ) {
        console.log( "componentWillReceiveProps" );
    }

    //End Updating

    //Un Mounting
    componentWillUnmount() {

    }

    //End Un Mounting

    onTapSave() {

    };
}
export default CheckOutPageView;
