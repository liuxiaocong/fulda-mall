import React from "react";
import {
    Dimensions,
    Image,
    SectionList,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import ImageWithPlaceHolder from "../../../../components/ImageWithPlaceHolder";
import CartGoodsItem from "../../../order/component/CartGoodsItem";
import Util from "../../../../util/Util";
const { width } = Dimensions.get( 'window' );

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
class MainShoppingCartPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {};
    };

    // Mounting
    constructor( props ) {
        super( props );
        let isSelectAll = MainShoppingCartPageView._isSelectAll( props.shoppingCartItems );

        this.state = {
            isRequesting: false,
            shoppingCartItems: Object.assign( [], props.shoppingCartItems ),
            isEditModel: false,
            isSelectAll: isSelectAll,
            confirmPendingDeleteGoods: [],
            pendingDeleteShop: []
        };
        this.pendingShoppingCartItems = Object.assign( [], props.shoppingCartItems );
        this.pendingDeleteGoods = [];
    }

    _renderItem = ( { item } ) => {
        return (
            <CartGoodsItem
                { ...this.props }
                data={item}
                isEditAble={true}
                isEditModel={this.state.isEditModel}
                onQuantityChanged={this.onQuantityChanged.bind( this )}
                onSelectStatusChanged={this.onSelectStatusChanged.bind( this )}
                onSelectPendingDeleteGoods={this.onSelectPendingDeleteGoods.bind( this )}
                pendingDeleteShopIds={this.state.pendingDeleteShop}
            />
        )
    };

    _setToSelectAll() {
        let shoppingCartItems = this.state.shoppingCartItems;
        if ( shoppingCartItems && shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                let shopGoods = shoppingCartItems[ i ];
                if ( shopGoods.goods && shopGoods.goods.length > 0 ) {
                    for ( let j = 0; j < shopGoods.goods.length; j++ ) {
                        let goods = shopGoods.goods[ j ];
                        goods.isSelect = true;
                    }
                }
            }
        }

        this.props.selectAll( shoppingCartItems );
    }

    static _isSelectAll( shoppingCartItems ) {
        let ret = true;
        if ( shoppingCartItems && shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                let shopGoods = shoppingCartItems[ i ];
                if ( shopGoods.goods && shopGoods.goods.length > 0 ) {
                    for ( let j = 0; j < shopGoods.goods.length; j++ ) {
                        let goods = shopGoods.goods[ j ];
                        if ( !goods.isSelect ) {
                            return false;
                        }
                    }
                }
            }
        }
        return ret;
    }

    _calculateTotalPrice() {
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

    _renderSectionHeader = ( { section } ) => {
        let isSelect = false;
        let goods = section.title.goods;
        if ( this.state.isEditModel ) {
            let id = section.title.id;
            for ( let i = 0; i < this.state.pendingDeleteShop.length; i++ ) {
                if ( id === this.state.pendingDeleteShop[ i ] ) {
                    isSelect = true;
                }
            }
        } else {
            if ( goods && goods.length > 0 ) {
                isSelect = true;
                for ( let i = 0; i < goods.length; i++ ) {
                    if ( !goods[ i ].isSelect ) {
                        isSelect = false;
                        break;
                    }
                }
            }
        }
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: 10,
                    height: 40,
                    overflow: 'hidden',
                    backgroundColor: constStyles.COMMON_GREY_BG,
                }}>
                <TouchableHighlight
                    style={{
                        height: 39
                    }}
                    underlayColor='#fff'
                    onPress={() => {
                        this.onSelectShop( section.title.id, true );
                    }}
                >
                    <View style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexGrow: 1,
                            backgroundColor: "#ffffff",
                            paddingRight: 10,
                            paddingLeft: 10
                        }
                    }>{
                        isSelect ?
                            <Image
                                style={{
                                    width: 21,
                                    height: 21,
                                    marginRight: 10
                                }}
                                source={require( '../../../../imgs/defaultSelect.png' )}/>
                            :
                            <Image
                                style={{
                                    width: 21,
                                    height: 21,
                                    marginRight: 10
                                }}
                                source={require( '../../../../imgs/unSelect.png' )}/>
                    }
                        <ImageWithPlaceHolder
                            style={{
                                width: 28,
                                height: 28
                            } }
                            placeholderForIcon={'md-image'}
                            source={section.title.logo ? { uri: section.title.logo } : null}
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
                            {section.title.name}
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        )
    };

    onQuantityChanged( quantity, targetGoods ) {
        Toast.show( "quantity:" + quantity );
        if ( this.pendingShoppingCartItems && this.pendingShoppingCartItems.length > 0 ) {
            for ( let i = 0; i < this.pendingShoppingCartItems.length; i++ ) {
                if ( targetGoods.shopId === this.pendingShoppingCartItems[ i ].id ) {
                    if ( this.pendingShoppingCartItems[ i ].goods ) {
                        for ( let j = 0; j < this.pendingShoppingCartItems[ i ].goods.length; j++ ) {
                            if ( Util.isSameCartGoodsBean( targetGoods, this.pendingShoppingCartItems[ i ].goods[ j ] ) ) {
                                this.pendingShoppingCartItems[ i ].goods[ j ].quantity = quantity;
                            }
                        }
                    }
                }
            }
        }
    }

    onSelectShop( shopId, isSelect ) {
        if ( isSelect ) {
            if ( !this.state.isEditModel ) {
                let shoppingCartItems = this.state.shoppingCartItems;
                if ( shoppingCartItems && shoppingCartItems.length > 0 ) {
                    for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                        if ( shopId === shoppingCartItems[ i ].id ) {
                            if ( shoppingCartItems[ i ].goods ) {
                                for ( let j = 0; j < shoppingCartItems[ i ].goods.length; j++ ) {
                                    shoppingCartItems[ i ].goods[ j ].isSelect = true;
                                }
                            }
                        }
                    }
                }
                this.pendingShoppingCartItems = shoppingCartItems;
                this.props.updateShoppingCartItems( shoppingCartItems );
                this.setState( { shoppingCartItems: shoppingCartItems } );
            } else {
                if ( this.pendingShoppingCartItems && this.pendingShoppingCartItems.length > 0 ) {
                    for ( let i = 0; i < this.pendingShoppingCartItems.length; i++ ) {
                        if ( this.pendingShoppingCartItems[ i ].id === shopId ) {
                            let targetShopGoods = this.pendingShoppingCartItems[ i ];
                            if ( targetShopGoods.goods && targetShopGoods.goods.length > 0 ) {
                                for ( let j = 0; j < targetShopGoods.goods.length; j++ ) {
                                    this.onSelectPendingDeleteGoods( true, targetShopGoods.goods[ j ] );
                                }
                            }
                        }
                    }
                }
                // if (!Util.isContains(this.state.pendingDeleteShop, shopId)) {
                //     this.state.pendingDeleteShop.push(shopId);
                //     this.setState({
                //         pendingDeleteShop: this.state.pendingDeleteShop
                //     })
                // }

            }
        }
    }

    onSelectPendingDeleteGoods( isPendingDelete, targetGoods ) {
        //** check is all goods in this shop pending delete
        let shopGoodsObject = null;
        for ( let i = 0; i < this.state.shoppingCartItems.length; i++ ) {
            if ( this.state.shoppingCartItems[ i ].id === targetGoods.shopId ) {
                shopGoodsObject = this.state.shoppingCartItems[ i ];
                break;
            }
        }
        if ( isPendingDelete ) {
            this.pendingDeleteGoods.push( targetGoods )
        } else {
            if ( this.pendingDeleteGoods ) {
                let target = [];
                for ( let i = 0; i < this.pendingDeleteGoods.length; i++ ) {
                    let goods = this.pendingDeleteGoods[ i ];
                    if ( !Util.isSameCartGoodsBean( goods, targetGoods ) ) {
                        target.push( goods );
                    }
                }
                this.pendingDeleteGoods = target;
            }
        }

        let isAllDelete = true;
        if ( shopGoodsObject && shopGoodsObject.goods ) {
            for ( let j = 0; j < shopGoodsObject.goods.length; j++ ) {
                if ( !MainShoppingCartPageView.isGoodsInArray( shopGoodsObject.goods[ j ], this.pendingDeleteGoods ) ) {
                    isAllDelete = false;
                }
            }
        }
        if ( Util.isContains( this.state.pendingDeleteShop, shopGoodsObject.id ) ) {
            if ( !isAllDelete ) {
                this.state.pendingDeleteShop = this.state.pendingDeleteShop.filter( function ( item ) {
                    return item !== shopGoodsObject.id;
                } );
                this.setState( { pendingDeleteShop: this.state.pendingDeleteShop } );
            }
        } else {
            if ( isAllDelete ) {
                this.state.pendingDeleteShop.push( shopGoodsObject.id );
                this.setState( { pendingDeleteShop: this.state.pendingDeleteShop } )
            }
        }
    }

    onSelectStatusChanged( isSelect, targetGoods ) {
        if ( this.state.isEditModel ) {
            if ( this.pendingShoppingCartItems && this.pendingShoppingCartItems.length > 0 ) {
                for ( let i = 0; i < this.pendingShoppingCartItems.length; i++ ) {
                    if ( targetGoods.shopId === this.pendingShoppingCartItems[ i ].id ) {
                        if ( this.pendingShoppingCartItems[ i ].goods ) {
                            for ( let j = 0; j < this.pendingShoppingCartItems[ i ].goods.length; j++ ) {
                                if ( Util.isSameCartGoodsBean( targetGoods, this.pendingShoppingCartItems[ i ].goods[ j ] ) ) {
                                    this.pendingShoppingCartItems[ i ].goods[ j ].isSelect = isSelect;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            let shoppingCartItems = this.state.shoppingCartItems;
            if ( shoppingCartItems && shoppingCartItems.length > 0 ) {
                for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                    if ( targetGoods.shopId === shoppingCartItems[ i ].id ) {
                        if ( shoppingCartItems[ i ].goods ) {
                            for ( let j = 0; j < shoppingCartItems[ i ].goods.length; j++ ) {
                                if ( Util.isSameCartGoodsBean( targetGoods, shoppingCartItems[ i ].goods[ j ] ) ) {
                                    shoppingCartItems[ i ].goods[ j ].isSelect = isSelect;
                                }
                            }
                        }
                    }
                }
            }
            this.props.updateShoppingCartItems( shoppingCartItems );
            this.setState( { shoppingCartItems: shoppingCartItems } );
        }
    }

    bindSectionListData() {
        let ret = [];
        let data = Object.assign( [], this.state.shoppingCartItems );
        if ( this.state.isEditModel && this.state.confirmPendingDeleteGoods.length > 0 ) {
            data = this.getDataFilterConfirmPendingGoods( data );
        }
        if ( data ) {
            let pendingDeleteShop = this.state.pendingDeleteShop;
            data.forEach( function ( shopGoodsItem ) {
                let obj = {};
                obj.title = shopGoodsItem;
                obj.key = shopGoodsItem.id;
                // if (Util.isContains(pendingDeleteShop, shopGoodsItem.id)) {
                //     if (shopGoodsItem.goods && shopGoodsItem.goods.length > 0) {
                //         for (let i = 0; i < shopGoodsItem.goods.length; i++) {
                //             shopGoodsItem.goods[i].isSelectDelete = true;
                //         }
                //     }
                // }
                obj.data = shopGoodsItem.goods;
                ret.push( obj )
            } )
        }
        return ret;
    }

    getDataFilterConfirmPendingGoods( data ) {
        let ret = [];
        if ( data ) {
            for ( let j = 0; j < data.length; j++ ) {
                let shopGoodsItem = data[ j ];
                let filterGoods = [];
                let goods = shopGoodsItem.goods;
                for ( let i = 0; i < goods.length; i++ ) {
                    let good = goods[ i ];
                    if ( !MainShoppingCartPageView.isGoodsInArray( good, this.state.confirmPendingDeleteGoods ) ) {
                        filterGoods.push( good );
                    }
                }
                if ( filterGoods.length > 0 ) {
                    let add = Object.assign( {}, shopGoodsItem );
                    add.goods = filterGoods;
                    ret.push( add );
                }
            }
        }
        return ret;
    }

    static isGoodsInArray( goods, goodsArray ) {
        if ( goodsArray ) {
            for ( let i = 0; i < goodsArray.length; i++ ) {
                if ( Util.isSameCartGoodsBean( goodsArray[ i ], goods ) ) {
                    return true;
                }
            }
        }
        return false;
    }

    renderOperationBottom() {
        return (
            <View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={
                    {
                        height: 44,
                        backgroundColor: '#ffffff',
                        flexDirection: 'row',
                        width: width,
                        alignItems: 'center'
                    }
                }>
                    <View style={
                        {
                            height: 44,
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingRight: 10,
                            flex: 1,
                            alignItems: 'center'
                        }
                    }>
                        <TouchableOpacity
                            onPress={() => {
                                this.onTapSelectAll( true );
                            }}
                            style={
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }
                            }>
                            {
                                this.state.isSelectAll ?
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../../imgs/defaultSelect.png' )}/>
                                    :
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../../imgs/unSelect.png' )}/>
                            }
                            <Text style={
                                {
                                    fontSize: 15,
                                    color: '#717789'
                                }
                            }>{I18n.t( Keys.select_all )}</Text>
                        </TouchableOpacity>
                        {
                            this.state.isEditModel ?
                                <View style=
                                          {
                                              {
                                                  flexDirection: 'row',
                                                  flexGrow: 1,
                                                  alignItems: 'center',
                                                  justifyContent: 'flex-end',
                                                  paddingLeft: 10,
                                                  paddingRight: 10
                                              }}
                                />
                                :
                                <View style=
                                          {
                                              {
                                                  flexDirection: 'row',
                                                  flexGrow: 1,
                                                  alignItems: 'center',
                                                  justifyContent: 'flex-end',
                                                  paddingLeft: 10,
                                                  paddingRight: 10
                                              }}
                                >
                                    <Text style={
                                        {
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                            color: '#717789',

                                        }
                                    }>
                                        {I18n.t( Keys.total_price ) + " :"}
                                    </Text>
                                    <Text style={
                                        {
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                            color: '#ffc515',
                                            marginLeft: 5,
                                            marginRight: 5
                                        }
                                    }>
                                        {Util.getShowPrice( this.props.user.currency, this._calculateTotalPrice() )}
                                    </Text>
                                    <Text style={
                                        {
                                            fontSize: 10,
                                            color: '#717789',
                                        }
                                    }>
                                        {I18n.t( Keys.without_shipping_cost )}
                                    </Text>
                                </View>
                        }
                    </View>
                    {
                        this.state.isEditModel ?
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
                                    this.onTapDelete();
                                }}
                            >
                                <Text style={
                                    {
                                        fontSize: 16,
                                        color: '#fff',
                                    }
                                }>{I18n.t( Keys.delete )}</Text>
                            </TouchableOpacity>
                            :
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
                                    this.props.onTapSettle();
                                }}
                            >
                                <Text style={
                                    {
                                        fontSize: 16,
                                        color: '#fff',
                                    }
                                }>{I18n.t( Keys.settlement )}</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

    render() {
        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null || user === null ) {
            return (
                <View/>
            );
        }

        let isEmpty = true;
        let data = this.bindSectionListData();
        if ( this.state.shoppingCartItems && this.state.shoppingCartItems.length > 0 ) {
            isEmpty = false;
        }
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                <View
                    style={[
                        {
                            height: 45,
                            marginTop: 18,
                            alignItems: 'center',
                            flexDirection: 'row'
                        },
                        commonStyles.commonBorderBottom
                    ]
                    }>
                    <View
                        style={{
                            width: 100,
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                        {
                            !isEmpty
                            &&
                            (this.state.isEditModel ?
                                    <Button
                                        style={[ commonStyles.top_info_left_btn, {} ]}
                                        title={I18n.t( Keys.cancel )}
                                        onPress={() => {
                                            this.onTapCancel()
                                        }}
                                    >
                                        {I18n.t( Keys.cancel )}
                                    </Button>
                                    :
                                    <View/>
                            )
                        }

                    </View>
                    <Text
                        style={{
                            flexGrow: 1,
                            color: constStyles.ACTION_TITLE_COLOR,
                            textAlign: 'center'
                        }}>
                        {I18n.t( Keys.shopping_cart )}
                    </Text>
                    <View style={
                        {
                            width: 100,
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }
                    }>
                        {
                            !isEmpty
                            &&
                            (this.state.isEditModel ?
                                    <Button
                                        style={[ commonStyles.top_info_right_btn, {} ]}
                                        title={I18n.t( Keys.finish )}
                                        onPress={() => {
                                            this.onTapSave()
                                        }}
                                    >
                                        {I18n.t( Keys.finish )}
                                    </Button>
                                    :
                                    <Button
                                        style={[ commonStyles.top_info_right_btn, {} ]}
                                        title={I18n.t( Keys.edit )}
                                        onPress={() => {
                                            this.onTapEdit()
                                        }}
                                    >
                                        {I18n.t( Keys.edit )}
                                    </Button>

                            )
                        }
                    </View>
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View style={
                    {
                        flex: 1,
                        flexGrow: 1,
                        backgroundColor: constStyles.COMMON_GREY_BG,
                        width: width
                    }}>

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
                            <View style={{}}>
                                <SectionList
                                    style={{
                                        flexGrow: 1,
                                    }}
                                    renderItem={this._renderItem}
                                    renderSectionHeader={this._renderSectionHeader}
                                    sections={data}
                                >

                                </SectionList>
                            </View>

                    }
                </View>
                {
                    !isEmpty ?
                        this.renderOperationBottom()
                        :
                        null
                }

            </View>
        )
    }

    onTapSelectAll( isSelectAll ) {
        if ( isSelectAll ) {
            if ( !this.state.isEditModel ) {
                let shoppingCartItems = this.state.shoppingCartItems;
                if ( shoppingCartItems && shoppingCartItems.length > 0 ) {
                    for ( let i = 0; i < shoppingCartItems.length; i++ ) {
                        if ( shoppingCartItems[ i ].goods ) {
                            for ( let j = 0; j < shoppingCartItems[ i ].goods.length; j++ ) {
                                shoppingCartItems[ i ].goods[ j ].isSelect = true;
                            }
                        }
                    }
                }
                this.pendingShoppingCartItems = shoppingCartItems;
                this.props.updateShoppingCartItems( shoppingCartItems );
                this.setState( { shoppingCartItems: shoppingCartItems } );
            } else {
                if ( this.pendingShoppingCartItems && this.pendingShoppingCartItems.length > 0 ) {
                    for ( let i = 0; i < this.pendingShoppingCartItems.length; i++ ) {
                        let targetShopGoods = this.pendingShoppingCartItems[ i ];
                        if ( targetShopGoods.goods && targetShopGoods.goods.length > 0 ) {
                            for ( let j = 0; j < targetShopGoods.goods.length; j++ ) {
                                this.onSelectPendingDeleteGoods( true, targetShopGoods.goods[ j ] );
                            }
                        }
                    }
                }
            }
        }

    }

    onTapDelete() {
        this.setState( {
            confirmPendingDeleteGoods: this.pendingDeleteGoods.concat()
        } );
        this.pendingDeleteGoods = [];
    }

    settlement() {

    }

    onTapCancel() {
        this.pendingDeleteGoods = [];
        this.pendingShoppingCartItems = this.props.shoppingCartItems;
        this.setState( {
            isEditModel: false,
            shoppingCartItems: this.props.shoppingCartItems,
            confirmPendingDeleteGoods: []
        } );
    }

    onTapSave() {

        if ( this.state.confirmPendingDeleteGoods.length > 0 ) {
            let newRet = [];
            for ( let i = 0; i < this.pendingShoppingCartItems.length; i++ ) {
                let shopGoods = this.pendingShoppingCartItems[ i ];
                if ( shopGoods.goods && shopGoods.goods.length > 0 ) {
                    let newGoods = [];
                    for ( let j = 0; j < shopGoods.goods.length; j++ ) {
                        if ( !MainShoppingCartPageView.isGoodsInArray( shopGoods.goods[ j ], this.state.confirmPendingDeleteGoods ) ) {
                            newGoods.push( shopGoods.goods[ j ] );
                        }
                    }
                    if ( newGoods.length > 0 ) {
                        shopGoods.goods = newGoods;
                        newRet.push( shopGoods )
                    }
                }
            }
            this.pendingShoppingCartItems = newRet;
        }

        this.pendingDeleteGoods = [];
        this.props.onTapSave( this.pendingShoppingCartItems );
        this.setState( {
            isEditModel: false,
            shoppingCartItems: this.pendingShoppingCartItems,
            confirmPendingDeleteGoods: [],
            pendingDeleteShop: []
        } );
    }

    onTapEdit() {
        this.setState( { isEditModel: true } )
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        let goodsIds = [];
        if ( this.props.shoppingCartItems && this.props.shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < this.props.shoppingCartItems.length; i++ ) {
                let goods = this.props.shoppingCartItems[ i ].goods;
                if ( goods && goods.length > 0 ) {
                    for ( let j = 0; j < goods.length; j++ ) {
                        let good = goods[ j ];
                        if ( !Util.isArrayContains( goodsIds, good.id ) ) {
                            goodsIds.push( good.id );
                        }
                    }
                }
            }
        }
        this.props.fetchGoodsInfo( goodsIds, ( err, res ) => {
            if ( !err ) {
                this.updateStockFromNewGoods( res.data );
            }
            console.log( err + "" );
        } );
    }

    updateStockFromNewGoods( newGoods ) {
        if ( this.props.shoppingCartItems && this.props.shoppingCartItems.length > 0 ) {
            for ( let i = 0; i < this.props.shoppingCartItems.length; i++ ) {
                let goods = this.props.shoppingCartItems[ i ].goods;
                if ( goods && goods.length > 0 ) {
                    for ( let j = 0; j < goods.length; j++ ) {
                        let good = goods[ j ];
                        if ( newGoods && newGoods[ good.id + "" ] ) {
                            newGoods[ good.id + "" ].isUpdate = true;
                            good.goodObject = newGoods[ good.id + "" ];
                        } else {
                            good.goodObject.isOffShelve = true;
                        }
                    }
                }
            }
        }
        this.props.updateShoppingCartItems( this.props.shoppingCartItems );
    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {
        //Toast.show("componentWillReceiveProps");
        // let isSelectAll = this._isSelectAll( nextProps.shoppingCartItems );
        // this.setState( { shoppingCartItems: nextProps.shoppingCartItems, isSelectAll: isSelectAll } )
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        //Toast.show("shouldComponentUpdate");
        return true;
        // let isSelectAll = this._isSelectAll( nextProps.shoppingCartItems );
        // nextState.shoppingCartItems = nextProps.shoppingCartItems;
        // nextState.isSelectAll = isSelectAll;
        // return true;
    }

    //noinspection JSMethodCanBeStatic
    componentWillUpdate( nextProps, nextState ) {
        //Toast.show("componentWillUpdate");
        let isSelectAll = MainShoppingCartPageView._isSelectAll( nextProps.shoppingCartItems );
        nextState.shoppingCartItems = nextProps.shoppingCartItems;
        nextState.isSelectAll = isSelectAll;
    }

    componentDidUpdate( prevProps, prevState ) {

    }

    //End Updating

    //Un Mounting
    componentWillUnmount() {

    }

    //End Un Mounting

}
export default MainShoppingCartPageView;
