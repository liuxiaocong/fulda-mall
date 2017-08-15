import React from "react";

import { FlatList, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../../../../styles/commonStyles";

class ShopSearchCategoryFilterBarChild extends React.Component {
    static propTypes = {
        onSearchFilterChanged: React.PropTypes.func.isRequired,
        data: React.PropTypes.array.isRequired
    };

    constructor( props ) {
        super( props );

        this.state = {
            currentState: this.props.currentState,
            data: this.props.data
        };
    }


    renderItem( { item, index } ) {
        return (
            <View>
                <TouchableHighlight style={[ { flex: 1, height: 44 }, commonStyles.justAlignCenter ]}
                                    underlayColor='#ddd' onPress={() => {
                    if ( this.props.onSearchFilterChanged ) {
                        this.props.onSearchFilterChanged( item );
                    }
                }}>
                    <Text style={[ { fontSize: 13, color: '#616775' } ]}>{item.name}</Text>
                </TouchableHighlight>
            </View>
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
                    data={this.state.data}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => {
                        return this.renderItem( { item, index } );
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>;
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

export default  ShopSearchCategoryFilterBarChild;
