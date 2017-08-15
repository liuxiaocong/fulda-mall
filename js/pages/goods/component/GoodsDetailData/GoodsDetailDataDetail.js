import GoodsDetailDataBase from "./base/GoodsDetailDataBase";
import React from "react";

import { Dimensions, Text, View, WebView } from "react-native";
import Grid from "react-native-grid-component";
import commonStyles from "../../../../styles/commonStyles";

const GoodsDetailDataDetail = {
    createNew: function () {
        const self = GoodsDetailDataBase.createNew();

        self.supportLoadMore = false;
        self.isSupportItemLayout = false;
        self.data = [];


        self.replaceData = function ( data ) {
            if ( self.data.length > 0 ) {
                self.data.splice( 0, self.data.length );
            }

            if ( !data ) {
                return;
            }

            self.data.push( data );
        };

        self.renderCategory = function ( item, index ) {
            if ( item.attributes === null || item.attributes === undefined ) {
                return null;
            }

            const keys = Object.keys( item.attributes );

            const data = [];
            const map = {};

            for ( let index = 0; index < item.categoryAttribute.attributes.length; index++ ) {
                map[ Object.keys( item.categoryAttribute.attributes[ index ] )[ 0 ] ] = item.categoryAttribute.attributes[ index ];
            }

            for ( let index = 0; index < keys.length; index++ ) {
                const title = map[ keys[ index ] ][ keys[ index ] ];
                const content = map[ keys[ index ] ].child[ item.attributes[ keys[ index ] ] ];

                data.push( title + ': ' + content );
            }

            return (
                <Grid
                    style={[]}
                    itemHasChanged={( r1, r2 ) => {
                        return r1 !== r2;
                    }}
                    renderItem={( data, i ) => {
                        return (
                            <View
                                style={[
                                    {
                                        width: Dimensions.get( 'window' ).width / 2,
                                        height: 48
                                    },
                                    commonStyles.justAlignCenter
                                ]}
                                key={'grid: ' + i}
                            >
                                <Text
                                    style={[ commonStyles.commonTextColorStyle, {
                                        fontSize: 14,
                                    } ]}>
                                    {data}
                                </Text>
                            </View>
                        );
                    }}
                    data={data}
                    itemsPerRow={2}
                />
            );
        };

        self.renderItem = function ( { item, index } ) {
            return (
                <View>
                    {self.renderCategory( item, index )}

                    {item.detail && item.detail.mainHtml && item.detail.mainHtml.length > 0 ?
                        <WebView
                            style={[ {
                                backgroundColor: 'red',
                                height: 500,
                            } ]}
                            automaticallyAdjustContentInsets={false}
                            source={{ html: item.detail.mainHtml }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            decelerationRate="normal"
                            startInLoadingState={false}
                            scalesPageToFit={true}
                        />
                        :
                        null
                    }

                </View>
            );
        };

        self.getItemLayout = function ( data, index ) {
            return null;
        };

        return self;
    }
};
export default GoodsDetailDataDetail;
