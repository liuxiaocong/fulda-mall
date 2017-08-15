import React from "react";
import { Dimensions, FlatList, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../styles/commonStyles";


class TabBarStyleComponent1 extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
        tab: React.PropTypes.object,
        onTabSelect: React.PropTypes.func.isRequired
    };

    constructor( props ) {
        super( props );

        let tab = TabBarStyleComponent1.calcCurrentSelect( this.props.data, this.props.tab );
        this.state = {
            tab: tab,
            data: this.props.data,
            viewWidth: Dimensions.get( 'window' ).width,
        };
    }

    componentWillMount() {
        if ( this.state.tab && this.state.tab !== this.props.tab ) {
            if ( this.props.onTabSelect ) {
                this.props.onTabSelect( this.state.tab );
            }
        }
    }

    static calcCurrentSelect( data, tab ) {
        if ( data && data.length > 0 ) {
            if ( data.indexOf( tab ) < 0 ) {
                return data[ 0 ];
            } else {
                return tab;
            }
        }
        else {
            return null;
        }
    }

    componentWillReceiveProps( nextProps ) {
        let tab = TabBarStyleComponent1.calcCurrentSelect( nextProps.data, nextProps.tab );

        if ( tab && this.state.tab !== this.props.tab ) {
            if ( this.props.onTabSelect ) {
                this.props.onTabSelect( tab );
            }
        }

        this.setState( {
            data: nextProps.data,
            tab: tab
        } );
    }

    calcItemWidth() {
        let itemWidth = 0;

        if ( this.state.data ) {
            if ( this.state.data.length > 4 ) {
                return this.state.viewWidth / 4.5;
            } else {
                return this.state.viewWidth / this.state.data.length;
            }
        }

        return itemWidth;
    }

    renderItem( { item, index }, itemWidth ) {

        let _childView;
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                ref={( childView ) => {
                    _childView = childView;
                }}
                onPress={() => {
                    const newArray = this.state.data.slice();

                    this.setState( {
                        data: newArray,
                        tab: item
                    } );

                    if ( this.props.onTabSelect ) {
                        this.props.onTabSelect( item );
                    }

                    _childView.measure(
                        ( x,
                          y,
                          width,
                          height,
                          pageX,
                          pageY ) => {
                            if ( pageX + width >= this.state.viewWidth ) {
                                if ( index < this.state.data.length - 1 ) {
                                    this._listView.scrollToIndex( {
                                        viewPosition: 0.8,
                                        index: index + 1
                                    } );
                                } else if ( index < this.state.data.length ) {
                                    this._listView.scrollToIndex( {
                                        viewPosition: 0.5,
                                        index: index
                                    } );
                                }
                            } else if ( pageX <= 0 ) {
                                this._listView.scrollToIndex( {
                                    viewPosition: 0.2,
                                    index: index
                                } );
                            }
                        },
                        () => {
                        }
                    );
                }}
                style={[ commonStyles.wrapper, commonStyles.justAlignCenter, { width: itemWidth } ]}>
                <View style={[
                    commonStyles.wrapper,
                    commonStyles.justAlignCenter
                ]}>
                    <Text style={[ {
                        marginLeft: 5,
                        marginRight: 5,
                        fontSize: 13,
                        color: item === this.state.tab ? '#3e3c43' : '#c3c6d0'
                    } ]}
                          numberOfLines={1}>{item.title}</Text>

                    {   item === this.state.tab ?
                        (
                            <View style={[
                                {
                                    backgroundColor: '#3e3c43',
                                    height: 2,
                                    width: 25,
                                    position: 'absolute',
                                    bottom: 6
                                } ]}/>
                        )
                        :
                        null
                    }
                </View>


            </TouchableHighlight>

        );
    }

    render() {
        const itemWidth = this.calcItemWidth();

        return (
            <FlatList
                ref={( listView ) => {
                    this._listView = listView;
                }}
                style={[ {}, this.props.style ]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.data}
                keyExtractor={( item, index ) => {
                    return index;
                }}
                renderItem={( { item, index } ) => {
                    return this.renderItem( { item, index }, itemWidth );
                }}
                getItemLayout={( data, index ) => (
                    { length: itemWidth, offset: itemWidth * index, index }
                )}
            />
        )
    }
}
export default TabBarStyleComponent1;