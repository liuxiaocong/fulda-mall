import React from "react";

const GoodsDetailDataBase = {
    supportLoadMore: false,

    createNew: function () {
        const self = {};

        self.supportLoadMore = false;
        self.data = [];

        self.hasMoreData = false;
        self.currentPageNum = 0;

        self.replaceData = function ( data ) {
            if ( self.data.length > 0 ) {
                self.data.splice( 0, self.data.length );
            }

            for ( let index = 0; index < data.length; index++ ) {
                self.data.push( data[ index ] );
            }
        };

        self.appendData = function ( data ) {
            for ( let index = 0; index < data.length; index++ ) {
                self.data.push( data[ index ] );
            }
        };

        self.renderItem = function ( { item, index } ) {

        };

        self.getItemLayout = function ( data, index ) {

        };

        return self;
    }
};
export default  GoodsDetailDataBase;