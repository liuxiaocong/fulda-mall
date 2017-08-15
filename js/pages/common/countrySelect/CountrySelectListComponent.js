import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import { connect } from "react-redux";
import constStyles from "../../../styles/constStyles";
import YIndexComponent from "./YIndexComponent";


const styles = StyleSheet.create( {} );
class CountrySelectListComponent extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
        isShowYIndex: React.PropTypes.bool.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onScroll: React.PropTypes.func,
    };

    constructor( props ) {
        super( props );

        const sectionMap = {};
        const dataArray = [];
        for ( let index = 0; index < this.props.data.length; index++ ) {
            const item = this.props.data[ index ];
            const key = '' + item.sort[ 0 ];
            let section = sectionMap[ key ];
            if ( !section ) {
                section = { isSectionHeader: true, content: key, child: [] };
                sectionMap[ key ] = section;

                dataArray.push( section );
            }

            section.child.push( item );
            dataArray.push( { isSectionHeader: false, content: item } )
        }

        this.state = {
            sectionMap: sectionMap,
            dataArray: dataArray,
            isShowYIndex: this.props.isShowYIndex,
        };
    }

    componentWillReceiveProps( nextProps ) {
        if ( this.state.isShowYIndex !== nextProps.isShowYIndex ) {
            this.setState( {
                isShowYIndex: nextProps.isShowYIndex
            } );
        }
    }

    renderItem( { item, index } ) {
        if ( item.isSectionHeader ) {
            return CountrySelectListComponent.renderSectionHeader( { item, index } );
        } else {
            return this.renderCommonItem( { item, index } );
        }
    }

    static renderSectionHeader( { item } ) {
        return (
            <View style={[ commonStyles.commonBG, { height: 30, justifyContent: 'center' } ]}>
                <Text style={[ {
                    marginLeft: 15,
                    color: constStyles.THEME_COLOR,
                    fontSize: 14,
                } ]}>{item.content}</Text>
            </View>
        );
    }

    renderCommonItem( { item } ) {
        return (
            <TouchableItemComponent
                containerStyle={[ { height: 46 } ] }
                style={[ { height: 46, paddingRight: 41 } ]}
                title={item.content.name}
                content={'+' + item.content.MobileCode}
                onPress={() => {
                    if ( this.props.onSelect ) {
                        this.props.onSelect( item.content );
                    }
                }}
                headerInterval={false}
                footerInterval={false}/>
        );
    }

    onChangeKey( key ) {
        let currentIndex = 0;
        for ( let index = 0; index < this.state.dataArray.length; index++ ) {
            if ( this.state.dataArray[ index ].isSectionHeader ) {
                currentIndex = index;
            }

            if ( this.state.dataArray[ index ].isSectionHeader && this.state.dataArray[ index ].content >= key ) {
                currentIndex = index;
                break;
            }
        }

        this._flatList.scrollToIndex( { animated: false, index: currentIndex, viewPosition: 0 } );
    }


    render() {
        const sectionHeight = 30;
        const viewHeight = 46;
        const separatorHeight = 1;

        return (
            <View style={[ commonStyles.wrapper ]}>
                <FlatList
                    ref={( flatList ) => {
                        this._flatList = flatList;
                    }}
                    data={this.state.dataArray}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={this.renderItem.bind( this )}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>
                    }}
                    getItemLayout={( data, index ) => {
                        let length = 0;
                        let offset = 0;

                        if ( data.isSectionHeader ) {
                            length = sectionHeight;
                        } else {
                            length = viewHeight;
                        }

                        for ( let temp = 0; temp < index; temp++ ) {
                            if ( this.state.dataArray[ temp ].isSectionHeader ) {
                                offset += sectionHeight + separatorHeight;
                            } else {
                                offset += viewHeight + separatorHeight;
                            }
                        }

                        return { length: length, offset: offset, index }
                    }}
                    onScroll={() => {
                        if ( this.props.onScroll ) {
                            this.props.onScroll();
                        }
                    }}
                />

                <YIndexComponent
                    style={[ { position: 'absolute', right: 0, top: 0, bottom: 0 } ]}
                    isOpen={this.state.isShowYIndex}
                    onSelect={( key ) => {
                        this.onChangeKey( key );
                    }}
                />
            </View>
        )
    }
}


function select( store ) {
    return {}
}

export default connect( select )( CountrySelectListComponent );
