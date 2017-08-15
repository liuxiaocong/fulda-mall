import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StarRating from "react-native-star-rating";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import * as UtilConfig from "../../../../configs/UtilConfig";
import CommentOrderGoodsItem from "./component/CommentOrderGoodsItem";
import OrderShopInfoComponent from "./component/OrderShopInfoComponent";
const styles = StyleSheet.create( {} );
class CommentOrderPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.comment ),
        };
    };

    constructor( props ) {
        super( props );

        let navState = this.props.navigation.state;

        this.state = {
            order: navState.params.order,
            callback: navState.params.callback,
            goodsMatchStart: 5,
            customerServiceStart: 5,
            deliverySpeedStart: 5
        };
        this.pendingSubmitData = {};
        this.pendingSubmitData.orderId = this.state.order.id;
        this.pendingSubmitData.goodsComments = [];
        this.state.order.orderGoods.map( ( good ) => {
            let goodCommentObj = {};
            goodCommentObj.goodsId = good.goods.id;
            goodCommentObj.goodsType = 0;
            goodCommentObj.type = UtilConfig.DEFAULT_GOODS_COMMENT_TYPE;
            goodCommentObj.comment = "";
            this.pendingSubmitData.goodsComments.push( goodCommentObj );
        } );
        this.pendingSubmitData.goodsMatchRate = 5;
        this.pendingSubmitData.deliverySpeedRate = 5;
        this.pendingSubmitData.customerServiceRate = 5;
    }

    onGoodsMatchStartPress = ( count ) => {
        this.setState( {
            goodsMatchStart: count
        } );
        this.pendingSubmitData.goodsMatchStart = count;
    };

    onCustomerServiceStartPress = ( count ) => {
        this.setState( {
            customerServiceStart: count
        } );
        this.pendingSubmitData.customerServiceStart = count;
    };

    onDeliverySpeedStartPress = ( count ) => {
        this.setState( {
            deliverySpeedStart: count
        } );
        this.pendingSubmitData.deliverySpeedRate = count;
    };

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    onTapSubmit = () => {
        // Toast.show(JSON.stringify(this.pendingSubmitData));
        if ( !this.pendingSubmitData ) {
            return;
        }
        this.props.submitComment(
            this.pendingSubmitData.orderId,
            this.pendingSubmitData.goodsComments,
            this.pendingSubmitData.goodsMatchRate,
            this.pendingSubmitData.deliverySpeedRate,
            this.pendingSubmitData.customerServiceRate,
            ( err, response ) => {
                if ( err ) {
                    Toast.show( err + "" );
                } else {
                    Toast.show( I18n.t( Keys.submit_success ) );
                    if ( this.state.callback instanceof Function ) {
                        this.state.callback();
                        this.props.navigation.goBack();
                    }
                }
            }
        )
    };

    onCommentUpdate = ( id, attribute, commentText ) => {
        //Toast.show( id + "|" + attribute + "|" + commentText + "" );
        if ( !this.pendingSubmitData.goodsComments ) {
            this.pendingSubmitData.goodsComments = [];
        }
        let objectExist = false;
        for ( let i = 0; i < this.pendingSubmitData.goodsComments.length; i++ ) {
            if ( this.pendingSubmitData.goodsComments[ i ].goodsId === id ) {
                objectExist = true;
                this.pendingSubmitData.goodsComments[ i ].comment = commentText;
            }
        }
        //won't happen
        if ( !objectExist ) {
            let goodCommentObject = {};
            goodCommentObject.goodsId = id;
            goodCommentObject.comment = commentText;
            goodCommentObject.goodsType = 0;
            this.pendingSubmitData.goodsComments.push( goodCommentObject );
        }
    };
    onCommentTypeUpdate = ( id, attribute, commentType ) => {
        if ( !this.pendingSubmitData.goodsComments ) {
            this.pendingSubmitData.goodsComments = [];
        }
        let objectExist = false;
        for ( let i = 0; i < this.pendingSubmitData.goodsComments.length; i++ ) {
            if ( this.pendingSubmitData.goodsComments[ i ].goodsId === id ) {
                objectExist = true;
                this.pendingSubmitData.goodsComments[ i ].type = commentType;
            }
        }
        //won't happen
        if ( !objectExist ) {
            let goodCommentObject = {};
            goodCommentObject.goodsId = id;
            goodCommentObject.type = commentType;
            goodCommentObject.goodsType = 0;
            this.pendingSubmitData.goodsComments.push( goodCommentObject );
        }
    };

    render() {
        let order = this.state.order;
        return (
            <ScrollView>
                <View
                    style={[ commonStyles.wrapper, commonStyles.commonBorderTop, {
                        paddingTop: 10,
                        paddingBottom: 20
                    } ]}>
                    {order.orderGoods.map( ( good ) => {
                        return (
                            <CommentOrderGoodsItem
                                key={'CommentOrderGoodsItem=' + good.goods.id}
                                { ...this.props }
                                data={good}
                                onCommentUpdate={this.onCommentUpdate}
                                onCommentTypeUpdate={this.onCommentTypeUpdate}
                            />
                        )
                    } )}
                    <OrderShopInfoComponent
                        style={
                            {
                                marginTop: 10
                            }
                        }
                        business={order.shop}/>
                    <View style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 48,
                            backgroundColor: "#fff",
                            paddingLeft: 10,
                            paddingRight: 10
                        }, commonStyles.commonBorderBottom, commonStyles.commonBorderTop
                    ]}>
                        <Text style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flexGrow: 1
                        }}
                              numberOfLines={1}>
                            {I18n.t( Keys.goods_match_with_description )}
                        </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            emptyStar={'md-star-outline'}
                            fullStar={'md-star'}
                            halfStar={'md-star-half'}
                            iconSet={'Ionicons'}
                            starColor={constStyles.THEME_COLOR}
                            starStyle={{ marginLeft: 5 }}
                            starSize={20}
                            rating={this.state.goodsMatchStart}
                            selectedStar={( rating ) => this.onGoodsMatchStartPress( rating )}
                        /></View>

                    <View style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 48,
                            backgroundColor: "#fff",
                            paddingLeft: 10,
                            paddingRight: 10
                        }, commonStyles.commonBorderBottom, commonStyles.commonBorderTop
                    ]}>
                        <Text style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flexGrow: 1
                        }}
                              numberOfLines={1}>
                            {I18n.t( Keys.attitude_of_shop_owner )}
                        </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            emptyStar={'md-star-outline'}
                            fullStar={'md-star'}
                            halfStar={'md-star-half'}
                            iconSet={'Ionicons'}
                            starColor={constStyles.THEME_COLOR}
                            starStyle={{ marginLeft: 5 }}
                            starSize={20}
                            rating={this.state.customerServiceStart}
                            selectedStar={( rating ) => this.onCustomerServiceStartPress( rating )}
                        />
                    </View>

                    <View style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 48,
                            backgroundColor: "#fff",
                            paddingLeft: 10,
                            paddingRight: 10
                        }, commonStyles.commonBorderBottom, commonStyles.commonBorderTop
                    ]}>
                        <Text style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flexGrow: 1
                        }}
                              numberOfLines={1}>
                            {I18n.t( Keys.ship_speed_of_shop_owner )}
                        </Text>
                        <StarRating
                            disabled={false}
                            maxStars={5}
                            emptyStar={'md-star-outline'}
                            fullStar={'md-star'}
                            halfStar={'md-star-half'}
                            iconSet={'Ionicons'}
                            starColor={constStyles.THEME_COLOR}
                            starStyle={{ marginLeft: 5 }}
                            starSize={20}
                            rating={this.state.deliverySpeedStart}
                            selectedStar={( rating ) => this.onDeliverySpeedStartPress( rating )}
                        />
                    </View>

                    <Button
                        containerStyle={[
                            commonStyles.buttonContainerStyle, {
                                marginRight: 10,
                                marginLeft: 10,
                                marginTop: 20,
                                width: 280,
                                alignSelf: 'center'
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this.onTapSubmit} title={null}>
                        {I18n.t( Keys.submit )}
                    </Button>

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
            </ScrollView>
        )

    }
}

export default CommentOrderPageView;
