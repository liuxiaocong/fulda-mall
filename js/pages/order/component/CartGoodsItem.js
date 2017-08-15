import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import Util from "../../../util/Util";
import Keys from "../../../configs/Keys";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";

class CartGoodsItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        onSelectStatusChanged: React.PropTypes.func,
        onSelectPendingDeleteGoods: React.PropTypes.func,
        onQuantityChanged: React.PropTypes.func,
        isEditModel: React.PropTypes.bool.isRequired,
        isEditAble: React.PropTypes.bool.isRequired,
        pendingDeleteShopIds: React.PropTypes.array.isRequired,
    };

    constructor( props ) {
        super( props );
        let maxCount;
        this.state = {
            isSelect: props.data.isSelect,
            quantity: props.data.quantity,
            maxCount: Util.getStockCountFromGoods( props.data.goodObject, props.data.selectTypesMap ),
            isEditModel: props.isEditModel,
            isSelectDelete: false,
            pendingDeleteShopIds: props.pendingDeleteShopIds
        }
    }


    render() {
        let goods = this.props.data;
        let isDelete = this.state.isSelectDelete;
        if ( this.state.pendingDeleteShopIds && Util.isContains( this.state.pendingDeleteShopIds, goods.shopId ) ) {
            isDelete = true;
        }
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight
                underlayColor='#fff'
                onPress={() => {
                    if ( !this.props.isEditAble ) {
                        return
                    }
                    if ( this.state.isEditModel ) {
                        if ( this.props.onSelectPendingDeleteGoods ) {
                            this.props.onSelectPendingDeleteGoods( !isDelete, goods );
                        }
                        this.setState( {
                            isSelectDelete: !isDelete
                        } );
                    } else {
                        if ( this.props.onSelectStatusChanged ) {
                            this.props.onSelectStatusChanged( !this.state.isSelect, goods );
                        }
                        this.setState( {
                            isSelect: !this.state.isSelect

                        } )
                    }
                }           }
                style={[ {
                    height: 120,
                    backgroundColor: "#ffffff"
                }, commonStyles.commonBorderBottom ]}>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                            flex: 1
                        },
                        commonStyles.wrapper,
                    ]}>
                    {
                        this.props.isEditAble
                        &&
                        (this.state.isEditModel ?
                                isDelete ?
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../imgs/defaultSelect.png' )}/>
                                    :
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../imgs/unSelect.png' )}/>
                                :
                                this.state.isSelect ?
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../imgs/defaultSelect.png' )}/>
                                    :
                                    <Image
                                        style={{
                                            width: 21,
                                            height: 21,
                                            marginRight: 10
                                        }}
                                        source={require( '../../../imgs/unSelect.png' )}/>
                        )
                    }

                    <ImageWithPlaceHolder
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 4
                        } }
                        placeholderForIcon={'md-image'}
                        source={goods.cover ? { uri: goods.cover } : null}
                    />

                    <View style={
                        {
                            height: 100,
                            margin: 10,
                            flexGrow: 1,
                            flex: 1
                        }
                    }>
                        <Text
                            style={
                                {
                                    color: '#717789',
                                    fontSize: 13
                                }
                            }
                            numberOfLines={2}>
                            {goods.name}
                        </Text>
                        <View style={{ flexGrow: 1 }}>
                            {goods.selectTypesMap && Util.getOrderAttribute( goods.selectTypesMap ) !== null && Util.getOrderAttribute( goods.selectTypesMap ) !== "" &&
                            <Text style={
                                {
                                    marginTop: 10
                                }
                            } numberOfLines={1}>
                                <Text style={
                                    {
                                        fontWeight: 'bold',
                                        color: '#3e3c43'
                                    }
                                }>
                                    {I18n.t( Keys.attributes ) + ": "}
                                </Text>
                                <Text style={
                                    {
                                        color: '#717789',
                                        fontSize: 13
                                    }
                                }>
                                    {Util.getOrderAttribute( goods.selectTypesMap ) + ""}
                                </Text>
                            </Text>
                            }
                        </View>
                        {
                            this.state.isEditModel ?
                                <View style={[ {
                                    flexDirection: 'row',
                                    marginTop: 14
                                } ]}>
                                    <TouchableHighlight
                                        style={
                                            {
                                                height: 28,
                                                width: 40,
                                                backgroundColor: '#f1f3f5',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }
                                        }
                                        underlayColor='#ddd'
                                        onPress={() => {
                                            let count = this.state.quantity + 1;
                                            if ( count > this.state.maxCount ) {
                                                count = this.state.maxCount
                                            }
                                            if ( this.props.onQuantityChanged ) {
                                                this.props.onQuantityChanged( count, this.props.data );
                                            }
                                            this.setState( {
                                                quantity: count
                                            } );
                                        }}
                                    >
                                        <Icon
                                            name={'md-add'}
                                            size={22}
                                            color={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                        />
                                    </TouchableHighlight>

                                    <View style={[ commonStyles.justAlignCenter, {
                                        height: 28,
                                        width: 40,
                                        borderWidth: 1,
                                        borderColor: '#717789',
                                        marginLeft: 5,
                                        marginRight: 5,
                                    } ]}>
                                        <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                                            {this.state.quantity}
                                        </Text>
                                    </View>

                                    <TouchableHighlight
                                        style={[
                                            commonStyles.justAlignCenter,
                                            commonStyles.commonBG,
                                            {
                                                height: 28,
                                                width: 40,
                                            }
                                        ]}
                                        underlayColor='#ddd'
                                        onPress={() => {
                                            let count = this.state.quantity - 1;
                                            if ( count < 0 ) {
                                                count = 0
                                            }
                                            if ( this.props.onQuantityChanged ) {
                                                this.props.onQuantityChanged( count, this.props.data );
                                            }
                                            this.setState( {
                                                quantity: count
                                            } );
                                        }}
                                    >
                                        <Icon
                                            name={'md-remove'}
                                            size={22}
                                            color={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                        />
                                    </TouchableHighlight>
                                </View>
                                :
                                <View style={
                                    {
                                        marginBottom: 10,
                                        flexDirection: 'row',

                                    }
                                }>
                                    <Text style={{
                                        flexGrow: 1,
                                        fontSize: 13,
                                        color: constStyles.THEME_COLOR,
                                        fontWeight: 'bold'
                                    }}>
                                        {Util.getShowPrice( goods.displayCurrency, (goods.singlePrice * this.state.quantity) )}
                                    </Text>
                                    <Text style={
                                        {
                                            fontSize: 13,
                                            color: '#2d2d2d',
                                            fontWeight: 'bold'
                                        }
                                    }>
                                        {"x " + this.state.quantity}
                                    </Text>
                                </View>

                        }
                        {
                            this.props.maxCount !== null ?
                                (
                                    <Text
                                        style={[ { fontSize: 14, color: '#717789', marginLeft: 10, marginTop: 10 } ]}>
                                        <Text>
                                            {I18n.t( Keys.current_storage_count ) + ":" + this.props.maxCount}
                                        </Text>
                                    </Text>
                                )
                                :
                                null
                        }
                    </View>

                </View>
            </TouchableHighlight>
        );
    }

    componentDidMount() {

    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ( this.state.isEditModel !== nextProps.isEditModel ) {
            nextState.isSelectDelete = false;
        } else {
            if ( nextProps.pendingDeleteShopIds && Util.isContains( nextProps.pendingDeleteShopIds, nextProps.data.shopId ) ) {
                nextState.isSelectDelete = true;
            }
        }
        nextState.isSelect = nextProps.data.isSelect;
        nextState.isEditModel = nextProps.isEditModel;
        nextState.quantity = nextProps.data.quantity;
        nextState.maxCount = Util.getStockCountFromGoods( nextProps.data.goodObject, nextProps.data.selectTypesMap );
        nextState.pendingDeleteShopIds = nextProps.pendingDeleteShopIds;
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

export default CartGoodsItem;