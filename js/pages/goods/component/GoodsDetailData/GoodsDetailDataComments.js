import GoodsDetailDataBase from "./base/GoodsDetailDataBase";
import React from "react";

import { Dimensions, Image, Text, TouchableHighlight, View } from "react-native";
import { SegmentedControls } from "react-native-radio-buttons";
import constStyles from "../../../../styles/constStyles";
import commonStyles from "../../../../styles/commonStyles";
import Util from "../../../../util/Util";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
const GoodsDetailDataComments = {
    createNew: function () {
        const self = GoodsDetailDataBase.createNew();

        self.supportLoadMore = true;
        self.isSupportItemLayout = true;
        self.data = [];

        self.commentCountData = [
            { label: (I18n.t( Keys.goods_comment )), value: 1 },
            { label: (I18n.t( Keys.average_comment )), value: 0 },
            { label: ((I18n.t( Keys.bad_comment ))), value: -1 },
        ];

        self.selectedCustomSegment = self.commentCountData[ 0 ];

        self.onSegmentChanged = null;

        self.data.push( self.commentCountData );

        self.updateSegmentedData = function ( good, average, bad ) {
            self.commentCountData[ 0 ].label = I18n.t( Keys.goods_comment ) + (good !== null && good !== undefined ? ('(' + good + ')') : '');
            self.commentCountData[ 1 ].label = I18n.t( Keys.average_comment ) + (average !== null && average !== undefined ? ('(' + average + ')') : '');
            self.commentCountData[ 2 ].label = I18n.t( Keys.bad_comment ) + (bad !== null && bad !== undefined ? ('(' + bad + ')') : '');
        };

        self.replaceData = function ( data ) {
            if ( self.data.length > 1 ) {
                self.data.splice( 1, self.data.length - 1 );
            }

            for ( let index = 0; index < data.length; index++ ) {
                self.data.push( data[ index ] );
            }
        };

        self.renderSegmented = function ( { item, index } ) {
            return (
                <View style={{ height: 38, paddingTop: 5, paddingBottom: 5 }}>
                    <SegmentedControls
                        tint='#3e3c43'
                        selectedTint='white'
                        backgroundColor='white'
                        selectedBackgroundColor='#c3c6d0'
                        containerBorderTint='#c3c6d0'
                        separatorTint='#c3c6d0'
                        optionStyle={{
                            fontSize: 13,
                        }}
                        containerStyle={{
                            marginLeft: 16,
                            marginRight: 16,
                            height: 28
                        }}
                        options={ item }
                        onSelection={ ( selectedCustomSegment ) => {
                            self.selectedCustomSegment = selectedCustomSegment;

                            if ( self.onSegmentChanged ) {
                                self.onSegmentChanged( selectedCustomSegment );
                            }
                        }}
                        selectedOption={self.selectedCustomSegment}
                        extractText={ ( option ) => option.label }
                        testOptionEqual={ ( a, b ) => {
                            if ( !a || !b ) {
                                return false;
                            }
                            return a.label === b.label
                        }}
                    />
                </View>
            );
        };

        self.renderCommonItem = function ( { item, index } ) {
            return (
                <View style={[ { height: 100 } ]}>
                    <TouchableHighlight
                        underlayColor='#ddd'
                        onPress={() => {

                        }}
                        style={[ commonStyles.wrapper, commonStyles.justAlignCenter, {
                            paddingLeft: 15,
                            paddingRight: 15,
                        } ]}>
                        <View style={{
                            width: Dimensions.get( 'window' ).width - 30,
                        }}>
                            <View style={[ { flexDirection: 'row' } ]}>

                                <View
                                    style={[
                                        {
                                            width: 34,
                                            height: 34,
                                        }
                                    ]}
                                >
                                    <Image
                                        style={[
                                            {
                                                width: 34,
                                                height: 34,
                                                borderRadius: 17,
                                            }
                                        ]}
                                        source={item.fromMemberLogo ? { uri: item.fromMemberLogo } : null}
                                    />
                                </View>
                                <View style={[ commonStyles.wrapper, { marginLeft: 10 } ]}>
                                    <Text
                                        style={[ commonStyles.wrapper, commonStyles.commonTextColorStyle, { fontSize: 13, }, ]}
                                        numberOfLines={1}>
                                        {item.fromMemberUsername}
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
                                commonStyles.commonTextColorStyle,
                                {
                                    marginTop: 9,
                                    fontSize: 12,
                                }
                            ]} numberOfLines={2}>
                                {item.comment}
                            </Text>

                        </View>
                    </TouchableHighlight>

                    {(index === this.data.length - 1 ) ? null : <View style={[ commonStyles.commonIntervalStyle ]}/>}
                </View>
            );
        };


        self.renderItem = function ( { item, index } ) {
            if ( index === 0 ) {
                return this.renderSegmented( { item, index } );
            }
            else {
                return this.renderCommonItem( { item, index } );
            }
        };

        self.getItemLayout = function ( data, index ) {
            const segmentedHeight = 38;
            const commonItemHeight = 100;

            if ( index === 0 ) {
                return { length: segmentedHeight, offset: segmentedHeight * index, index }
            } else {
                return { length: commonItemHeight, offset: commonItemHeight * (index - 1 ) + segmentedHeight, index }
            }
        };

        return self;
    }
};
export default GoodsDetailDataComments;