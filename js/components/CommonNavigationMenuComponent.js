import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import commonStyles from "../styles/commonStyles";
import constStyles from "../styles/constStyles";


class CommonNavigationMenuComponent extends React.Component {
    static propTypes = {
        menuData: React.PropTypes.array,
        onSelectMenu: React.PropTypes.func.isRequired
    };

    // Mounting
    constructor( props ) {
        super( props );

        this.state = {
            categoryType: this.props.categoryType,
            refreshing: false,
            waiting: false,
            data: this.props.menuData,
        };
    }

    renderItem( { item, index } ) {
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( this.props.onSelect !== null ) {
                        this.props.onSelectMenu( item );
                    }
                }}
                style={[ { height: 44 } ]}>
                <View style={[
                    commonStyles.wrapper,
                    commonStyles.justAlignCenter,
                    {
                        alignItems: 'center',
                    }
                ]}>
                    <Text style={[ { fontSize: 13, color: '#616775' } ]}>{item.title}</Text>
                </View>
            </TouchableHighlight>
        )
            ;
    }


    render() {
        const viewHeight = 44;
        const separatorHeight = 1;

        return (
            <View style={[ {
                width: 170,
                marginRight: 10,
                marginLeft: Dimensions.get( 'window' ).width - 170 - 10,
                marginTop: 44 + constStyles.STATE_BAR_HEIGHT
            } ]}>

                <Svg
                    height="10"
                    width="20"
                    style={[ { marginLeft: 150 - 6 } ]}
                >
                    <Polygon
                        points="0,10 10,0 20,10"
                        fill="white"
                    />
                </Svg>

                <View
                    style={[ {
                        backgroundColor: 'white',
                        borderRadius: 5,
                        borderColor: 'white',
                        borderWidth: 1
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
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create( {
    operation: {
        width: 28,
        height: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 14,
    },
    arrow: {
        marginLeft: 5,
        marginTop: 1,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 6,
        borderTopColor: '#fff',//下箭头颜色
        borderLeftColor: '#f76260',//右箭头颜色
        borderBottomColor: '#fff',//上箭头颜色
        borderRightColor: '#fff'//左箭头颜色
    }
} );


export default CommonNavigationMenuComponent;


