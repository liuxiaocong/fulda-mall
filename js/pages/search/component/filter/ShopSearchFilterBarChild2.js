import React from "react";

import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../../../../styles/commonStyles";

class ShopSearchFilterBarChild2 extends React.Component {
    static propTypes = {
        onSearchFilterChanged: React.PropTypes.func.isRequired,

        typeData: React.PropTypes.array.isRequired,
        currentType: React.PropTypes.object.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            typeData: this.props.typeData,
            currentType: this.props.currentType,
        };
    }

    renderItem( { item, index } ) {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight style={[ { height: 44 } ]} underlayColor='#ddd' onPress={() => {
                if ( this.state.currentType.code !== item.code ) {
                    let currentType = item;

                    this.setState( {
                        currentType: currentType,
                    } );

                    this.props.onSearchFilterChanged( currentType );
                }
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
                    {this.state.currentType.code === item.code ?
                        <Image
                            style={{
                                width: 15,
                                height: 10,
                                right: 0
                            }}
                            source={require( '../../../../imgs/ic_confirm.png' )}
                        />
                        :
                        null
                    }
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const viewHeight = 44;
        const separatorHeight = 1;

        return (
            <View style={[ {
                backgroundColor: 'white',
            } ]}>

                <FlatList
                    style={[ {
                        height: (this.state.typeData.length * viewHeight + (this.state.typeData.length - 1) * separatorHeight)
                    } ]}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.typeData}
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

export default ShopSearchFilterBarChild2;
