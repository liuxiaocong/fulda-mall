import React from "react";

import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import Util from "../../../util/Util";

class CategorySelectHorizontalList extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            data: this.props.data
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            data: nextProps.data
        } );
    }

    renderItem( { item, index } ) {
        return (
            <TouchableHighlight
                style={[
                    commonStyles.justAlignCenter,
                    {
                        width: 70,
                        justifyContent: 'flex-start',
                        marginBottom: 3
                    }
                ]}
                underlayColor='#ddd'
                onPress={() => {
                    this.props.navigation.navigate( 'searchByCategoryPage', {
                        category: item,
                        currentOpenType: false
                    } );
                }}
            >
                <View
                    style={[
                        {
                            marginTop: 5,
                            alignItems: 'center',
                            marginBottom: 5
                        }
                    ]}
                >
                    <Image
                        style={{
                            width: 50,
                            height: 50
                        }}
                        source={Util.getCategoryImageUrl( item )}
                    />

                    <Text style={[ {
                        marginTop: 10,
                        fontSize: 11,
                        color: '#616775',
                        textAlign: 'center'
                    } ]}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const viewWidth = 70;
        const separatorWidth = 10;
        return (
            <View style={[ styles.categoryType ]}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.data}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => this.renderItem( { item, index } )}
                    ItemSeparatorComponent={() => {
                        return <View style={[ { width: separatorWidth } ]}/>
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewWidth, offset: (viewWidth + separatorWidth) * index, index }
                    )}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create( {
    categoryType: {}
} );

export default CategorySelectHorizontalList;
