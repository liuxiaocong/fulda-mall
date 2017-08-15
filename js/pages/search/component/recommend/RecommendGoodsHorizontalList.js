import React from "react";

import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import I18n from "../../../../I18n";
import commonStyles from "../../../../styles/commonStyles";
import GoodsShowItem from "../GoodsShowItem";
import Keys from "../../../../configs/Keys";


class RecommendGoodsHorizontalList extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
        location: React.PropTypes.object,
    };

    constructor( props ) {
        super( props );

        this.state = {
            data: this.props.data,
            location: this.props.location
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            data: nextProps.data,
            location: nextProps.nextProps
        } );
    }

    render() {
        const viewWidth = (Dimensions.get( 'window' ).width - 30) / 2.5;
        const imageHeight = (Dimensions.get( 'window' ).width - 30) / 2.5;
        const separatorWidth = 10;
        return (
            <View style={[ commonStyles.wrapper, styles.recommendService ]}>
                <View style={[ { marginTop: 22, flexDirection: 'row', alignItems: 'center', marginLeft: 10 } ]}>
                    <View style={[ { height: 15, width: 2, backgroundColor: '#717789' } ]}/>
                    <Text style={[ {
                        color: '#717789',
                        fontSize: 13,
                        marginLeft: 9,
                        fontWeight: 'bold'
                    } ]}>{I18n.t( Keys.recommend_frc_service )}</Text>
                </View>

                <FlatList
                    style={[ { marginTop: 14 } ]}
                    horizontal={true}
                    data={this.state.data}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => {
                        return (
                            <GoodsShowItem {...this.props} goods={item}
                                           containerStyle={[
                                               {
                                                   width: viewWidth,
                                               }
                                           ]}
                                           imageHeight={imageHeight}
                            />
                        );
                    }}
                    ListHeaderComponent={() => {
                        return (<View style={[ { width: separatorWidth, height: 2 } ]}/>)
                    }}
                    ListFooterComponent={() => {
                        return (<View style={[ { width: separatorWidth, height: 2 } ]}/>)
                    } }
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
    container: {
        flex: 1
    },
    recommendService: {
        flex: 1,
    }
} );

export default RecommendGoodsHorizontalList;
