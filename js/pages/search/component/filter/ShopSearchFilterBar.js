import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import I18n from "../../../../I18n";
import commonStyles from "../../../../styles/commonStyles";
import Keys from "../../../../configs/Keys";
import ShopSearchFilterBarChild1 from "./ShopSearchFilterBarChild1";
import ShopSearchFilterBarChild2 from "./ShopSearchFilterBarChild2";

class ShopSearchFilterBar extends React.Component {
    static propTypes = {
        onSearchFilterChanged: React.PropTypes.func.isRequired,

        onShowModalBox: React.PropTypes.func.isRequired,
        onRequestClose: React.PropTypes.func.isRequired,

        sortingFieldData: React.PropTypes.array.isRequired,
        currentSortingField: React.PropTypes.object.isRequired,
        sortingOrderData: React.PropTypes.array.isRequired,
        currentSortingOrder: React.PropTypes.string.isRequired,

        typeData: React.PropTypes.array.isRequired,
        currentType: React.PropTypes.object.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            sortingFieldData: this.props.sortingFieldData,
            currentSortingField: this.props.currentSortingField,
            sortingOrderData: this.props.sortingOrderData,
            currentSortingOrder: this.props.currentSortingOrder,
            typeData: this.props.typeData,
            currentType: this.props.currentType,

            currentOpenType: 'none',
            openTypes: [
                'none',
                'filter',
                'shopType',
            ],
        };
    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ {
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 44
            } ]}>
                <TouchableHighlight style={[ { flex: 1 } ]} underlayColor='#ddd' onPress={() => {
                    this.onChooseFilter();
                }}
                                    ref={( filterView ) => {
                                        this._filterView = filterView;
                                    }}
                >
                    <View style={[ commonStyles.wrapper, { flexDirection: 'row' }, commonStyles.justAlignCenter ]}>
                        <Text style={[ {
                            fontSize: 13,
                            color: '#616775'
                        } ]}>{I18n.t( Keys.sorting_field_data_title )}</Text>
                        <Image
                            style={{
                                width: 8,
                                height: 4,
                                marginLeft: 5
                            }}
                            source={this.state.currentOpenType === 'filter' ? require( '../../../../imgs/ic_arrow_up.png' ) : require( '../../../../imgs/ic_arrow_down.png' )}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={[ { flex: 1 } ]} underlayColor='#ddd' onPress={() => {
                    this.onChooseShopType();
                }}
                                    ref={( shopTypeView ) => {
                                        this._shopTypeView = shopTypeView;
                                    }}
                >
                    <View style={[ commonStyles.wrapper, { flexDirection: 'row' }, commonStyles.justAlignCenter ]}>
                        <Text style={[ {
                            fontSize: 13,
                            color: '#616775'
                        } ]}>{I18n.t( Keys.shop_type_data_title )}</Text>
                        <Image
                            style={{
                                width: 8,
                                height: 4,
                                marginLeft: 5
                            }}
                            source={this.state.currentOpenType === 'shopType' ? require( '../../../../imgs/ic_arrow_up.png' ) : require( '../../../../imgs/ic_arrow_down.png' )}/>
                    </View>
                </TouchableHighlight>


            </View>
        );
    }

    close() {
        this.setState( {
            currentOpenType: 'none'
        } );
    }

    onChooseFilter() {
        if ( this.state.currentOpenType === 'filter' ) {
            this.setState( {
                currentOpenType: 'none'
            } );

            if ( this.props.onRequestClose ) {
                this.props.onRequestClose()
            }
        } else {
            this.setState( {
                currentOpenType: 'filter'
            } );

            if ( this.props.onShowModalBox ) {
                this.props.onShowModalBox( this._filterView, this.getChooseFilterView() )
            }
        }
    }

    getChooseFilterView() {
        return (
            <ShopSearchFilterBarChild1
                onSearchFilterChanged={( currentSortingField, currentSortingOrder ) => {
                    this.setState( {
                        currentSortingField: currentSortingField,
                        currentSortingOrder: currentSortingOrder,
                        currentOpenType: 'none'
                    } );

                    if ( this.props.onRequestClose ) {
                        this.props.onRequestClose()
                    }

                    if ( this.props.onSearchFilterChanged ) {
                        this.props.onSearchFilterChanged(
                            currentSortingField,
                            currentSortingOrder,
                            this.state.currentType
                        );
                    }
                }}
                sortingFieldData={this.state.sortingFieldData}
                currentSortingField={this.state.currentSortingField}
                sortingOrderData={this.state.sortingOrderData}
                currentSortingOrder={this.state.currentSortingOrder}
            />
        );
    }

    onChooseShopType() {
        if ( this.state.currentOpenType === 'shopType' ) {
            this.setState( {
                currentOpenType: 'none'
            } );

            if ( this.props.onRequestClose ) {
                this.props.onRequestClose()
            }
        } else {
            this.setState( {
                currentOpenType: 'shopType'
            } );

            if ( this.props.onShowModalBox ) {
                this.props.onShowModalBox( this._filterView, this.getChooseShopTypeView() )
            }
        }
    }

    getChooseShopTypeView() {
        return (
            <ShopSearchFilterBarChild2
                onSearchFilterChanged={( currentType ) => {
                    this.setState( {
                        currentType: currentType,
                        currentOpenType: 'none'
                    } );

                    if ( this.props.onRequestClose ) {
                        this.props.onRequestClose()
                    }

                    if ( this.props.onSearchFilterChanged ) {
                        this.props.onSearchFilterChanged(
                            this.state.currentSortingField,
                            this.state.currentSortingOrder,
                            currentType
                        );
                    }
                }}

                typeData={this.state.typeData}
                currentType={this.state.currentType}
            />
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1
    },

} );

export default ShopSearchFilterBar;
