import React from "react";

import { StyleSheet, Text, View } from "react-native";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import Util from "../../../util/Util";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";
import CartGoodsItem from "./CartGoodsItem";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
class OrderShopItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        isShopOrder: React.PropTypes.bool.isRequired,
    };

    constructor( props ) {
        super( props );
        let maxCount;
        this.state = {
            isShopOrder: props.isShopOrder,
            data: props.data,
        }
    }

    render() {
        let item = this.state.data;
        return (
            <View>
                <View
                    style={{
                        flex: 1,
                        marginTop: 10,
                        height: 40,
                        overflow: 'hidden',
                        backgroundColor: constStyles.COMMON_GREY_BG,
                    }}>
                    {
                        this.state.isShopOrder ?
                            <View style={
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                    backgroundColor: "#ffffff",
                                    height: 39,
                                    paddingRight: 15,
                                    paddingLeft: 15
                                }
                            }>
                                <Text
                                    numberOfLines={1}
                                    style={
                                        {
                                            color: '#3e3c43',
                                            fontSize: 17
                                        }
                                    }>
                                    {item.buyer.name}
                                </Text>
                            </View>
                            :
                            <View style={
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                    backgroundColor: "#ffffff",
                                    height: 39,
                                    paddingRight: 15,
                                    paddingLeft: 15
                                }
                            }>
                                <ImageWithPlaceHolder
                                    style={{
                                        width: 28,
                                        height: 28
                                    } }
                                    placeholderForIcon={'md-image'}
                                    source={item.shop.logo ? { uri: item.shop.logo } : null}
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
                                    {item.shop.name}
                                </Text>
                            </View>

                    }
                    <View style={[ commonStyles.commonIntervalStyle ]}/>
                </View>
                {item.orderGoods.map( ( good ) => {
                    let cartGoodsItem = Util.getCartGoodsItemFromServerGoodsObject( good );
                    return (
                        <CartGoodsItem
                            { ...this.props }
                            key={'CartGoodsItem key = ' + good.id}
                            data={cartGoodsItem}
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
                    hideRightNav={true}
                    onPress={() => {

                    }}
                    headerInterval={true}
                    footerInterval={false}>
                    {
                        (item.buyerRemarks) ?
                            <View>
                                <Text style={
                                    {
                                        color: '#717789'
                                    }
                                }>
                                    {item.buyerRemarks + ""}
                                </Text>
                            </View>
                            :
                            null
                    }
                </TouchableItemComponent>

                <TouchableItemComponent
                    containerStyle={{}}
                    title={I18n.t( Keys.shop_discount )}
                    hideRightNav={true}
                    content={""}
                    onPress={() => {

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
                    hideRightNav={true}
                    onPress={() => {

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
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: '#fff'
                    }
                }>
                    <Text style={{
                        color: '#3e3c43',
                        fontSize: 14
                    }}>{I18n.t( Keys.shop_amount_include_shipping ) + Util.getShowPrice( this.props.user.currency, item.totalPrice )}</Text>
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }

    componentDidMount() {

    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {

    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        nextState.data = nextProps.data;
        nextState.isShopOrder = nextProps.isShopOrder;
        return true;
    }

    componentWillUpdate( nextProps, nextState ) {

    }

    componentDidUpdate( prevProps, prevState ) {

    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0000007f'
    }
} );

export default OrderShopItem;