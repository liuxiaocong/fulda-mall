import GoodsDetailDataBase from "./base/GoodsDetailDataBase";
import React from "react";

import { Dimensions, Image, Text, TouchableHighlight, View } from "react-native";
import constStyles from "../../../../styles/constStyles";
import commonStyles from "../../../../styles/commonStyles";
import Util from "../../../../util/Util";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


const GoodsDetailDataRecords = {
    createNew: function () {
        const self = GoodsDetailDataBase.createNew();

        self.supportLoadMore = true;
        self.isSupportItemLayout = true;
        self.data = [];

        self.renderItem = function ( { item, index } ) {
            return (
                <View style={[ { height: 85 } ]}>
                    <TouchableHighlight
                        underlayColor='#ddd'
                        onPress={() => {

                        }}
                        style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                            paddingLeft: 15,
                            paddingRight: 15,
                        } ]}>
                        <View style={[
                            commonStyles.justAlignCenter,
                            {
                                width: Dimensions.get( 'window' ).width - 30,
                                flexDirection: 'row'
                            }
                        ]}>
                            <View style={[ commonStyles.wrapper ]}>
                                <View style={[ { flexDirection: 'row' } ]}>
                                    <Image
                                        style={[
                                            {
                                                width: 34,
                                                height: 34,
                                                borderRadius: 17,
                                            }
                                        ]}
                                        source={item.buyer.logo ? { uri: item.buyer.logo } : null}
                                    />
                                    <View style={[ commonStyles.wrapper, { marginLeft: 10 } ]}>
                                        <Text
                                            style={[ commonStyles.wrapper, commonStyles.commonTextColorStyle, { fontSize: 13, }, ]}
                                            numberOfLines={1}>
                                            {item.buyer.username}
                                        </Text>
                                        <Text style={[
                                            commonStyles.wrapper,
                                            {
                                                fontSize: 12,
                                                color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR,
                                                marginTop: 6
                                            }
                                        ]} numberOfLines={1}>
                                            {Util.getDateDescription( item.registerDate )}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={[
                                    {
                                        marginTop: 10,
                                        fontSize: 12,
                                        color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR,
                                    }
                                ]} numberOfLines={1}>
                                    {I18n.t( Keys.packet_type ) + ": "}
                                    <Text>
                                        {item.attributes}
                                    </Text>
                                </Text>
                            </View>

                            <Text style={[
                                {
                                    fontSize: 13,
                                    color: constStyles.THEME_COLOR,
                                    fontWeight: 'bold',
                                    marginLeft: 10
                                }
                            ]} numberOfLines={1}>
                                {Util.getShowPrice( item.goods.displayCurrency, parseFloat( item.goods.displayPrice ) )}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    {(index === this.data.length - 1 ) ? null : <View style={[ commonStyles.commonIntervalStyle ]}/>}
                </View>
            );
        };

        self.getItemLayout = function ( data, index ) {
            const viewHeight = 85;
            const separatorHeight = 0;

            return { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
        };

        return self;
    }
};
export default GoodsDetailDataRecords;