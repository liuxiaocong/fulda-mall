import React from "react";

import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../../../../styles/commonStyles";

class ShopSearchFilterBarChild1 extends React.Component {
    static propTypes = {
        onSearchFilterChanged: React.PropTypes.func.isRequired,

        sortingFieldData: React.PropTypes.array.isRequired,
        currentSortingField: React.PropTypes.object.isRequired,
        sortingOrderData: React.PropTypes.array.isRequired,
        currentSortingOrder: React.PropTypes.string.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            sortingFieldData: this.props.sortingFieldData,
            currentSortingField: this.props.currentSortingField,
            sortingOrderData: this.props.sortingOrderData,
            currentSortingOrder: this.props.currentSortingOrder,
        };
    }

    renderItem( { item, index } ) {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight style={[ { height: 44 } ]} underlayColor='#ddd' onPress={() => {
                let currentSortingField;
                let currentSortingOrder;

                if ( this.state.currentSortingField.code === item.code ) {
                    currentSortingField = this.state.currentSortingField;
                    currentSortingOrder = this.state.sortingOrderData[ this.state.currentSortingOrder === this.state.sortingOrderData[ 0 ] ? 1 : 0 ];

                } else {
                    currentSortingField = item;
                    currentSortingOrder = this.state.sortingOrderData[ 0 ];
                }

                const sortingFieldData = this.state.sortingFieldData.slice();

                this.state.currentSortingField = currentSortingField;
                this.state.currentSortingOrder = currentSortingOrder;

                this.setState( {
                    sortingFieldData: sortingFieldData
                } );

                this.props.onSearchFilterChanged( currentSortingField, currentSortingOrder );
            }}
            >
                <View
                    style={[ commonStyles.wrapper, {
                        flexDirection: 'row',
                        paddingLeft: 15,
                        paddingRight: 15,
                        alignItems: 'center',
                    }, ]}>
                    <Text style={[ commonStyles.wrapper, { fontSize: 13, color: '#616775' } ]}>{item.name}</Text>
                    <View>
                        <Image
                            style={{
                                width: 10,
                                height: 5
                            }}
                            source={(this.state.currentSortingField.code === item.code && this.state.currentSortingOrder === this.state.sortingOrderData[ 0 ]) ? require( '../../../../imgs/ic_arrow_filter_up_activation.png' ) : require( '../../../../imgs/ic_arrow_filter_up.png' )
                            }/>
                        <Image
                            style={{
                                width: 10,
                                height: 5,
                                marginTop: 5
                            }}
                            source={(this.state.currentSortingField.code === item.code && this.state.currentSortingOrder === this.state.sortingOrderData[ 1 ]) ? require( '../../../../imgs/ic_arrow_filter_down_activation.png' ) : require( '../../../../imgs/ic_arrow_filter_down.png' )
                            }/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const viewHeight = 44;
        const separatorHeight = 1;

        return (
            <View style={[ {
                backgroundColor: '#ffffff',
            } ]}>

                <FlatList
                    style={[ {
                        height: (this.state.sortingFieldData.length * viewHeight + (this.state.sortingFieldData.length - 1) * separatorHeight)
                    } ]}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.sortingFieldData}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={this.renderItem.bind( this )}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                />
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1
    },

} );

export default ShopSearchFilterBarChild1;
