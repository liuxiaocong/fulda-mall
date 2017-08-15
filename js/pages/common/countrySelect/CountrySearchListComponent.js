/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { BackHandler, FlatList, StyleSheet, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import { connect } from "react-redux";


const styles = StyleSheet.create( {} );
class CountrySearchListComponent extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
        keyword: React.PropTypes.string.isRequired,
        style: View.propTypes.style,
        isOpen: React.PropTypes.bool,
        onSelect: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        onScroll: React.PropTypes.func,
    };

    constructor( props ) {
        super( props );

        this.state = {
            dataArray: this.props.data,
            showData: this.calcShowData( this.props.data, this.props.keyword ),
            keyword: this.props.keyword,
            isOpen: this.props.isOpen,
        };
    }

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.keyword !== this.state.keyword ) {
            this.state.keyword = nextProps.keyword;

            this.setState( {
                showData: this.calcShowData( this.state.dataArray, this.state.keyword )
            } );
        }

        if ( nextProps.isOpen !== this.state.isOpen ) {
            this.setState( {
                isOpen: nextProps.isOpen
            } );
        }
    }

    componentWillMount() {
        BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    _onBack() {
        if ( this.state.isOpen ) {

            this.setState( {
                isOpen: false
            } );

            if ( this.props.onClose ) {
                this.props.onClose();
            }

            return true;
        }
        return false;
    }

    calcShowData( dataArray, keyword ) {
        let showData = [];

        if ( !keyword || keyword.length <= 0 ) {

            return showData;
        }

        {
            let result = [];
            for ( let index = 0; index < dataArray.length; index++ ) {
                const item = dataArray[ index ];
                if ( item.name.indexOf( keyword ) >= 0 ) {
                    result.push( item );
                }
            }

            result = result.sort( function ( a, b ) {
                const aIndex = a.name.indexOf( keyword );
                const bIndex = b.name.indexOf( keyword );
                if ( aIndex === bIndex ) {
                    return 0;
                } else if ( aIndex > bIndex ) {
                    return 1;
                } else {
                    return -1;
                }
            } );

            showData = showData.concat( result );
        }

        {
            let result = [];
            for ( let index = 0; index < dataArray.length; index++ ) {
                const item = dataArray[ index ];
                if ( item.name.toUpperCase().indexOf( keyword.toUpperCase() ) >= 0 && showData.indexOf( item ) < 0 ) {
                    result.push( item );
                }
            }

            result = result.sort( function ( a, b ) {
                const aIndex = a.name.toUpperCase().indexOf( keyword.toUpperCase() );
                const bIndex = b.name.toUpperCase().indexOf( keyword.toUpperCase() );
                if ( aIndex === bIndex ) {
                    return 0;
                } else if ( aIndex > bIndex ) {
                    return 1;
                } else {
                    return -1;
                }
            } );

            showData = showData.concat( result );
        }

        {
            let result = [];
            for ( let index = 0; index < dataArray.length; index++ ) {
                const item = dataArray[ index ];
                if ( ('+' + item.MobileCode).indexOf( keyword ) >= 0 && showData.indexOf( item ) < 0 ) {
                    result.push( item );
                }
            }

            result = result.sort( function ( a, b ) {
                const aIndex = ('+' + a.MobileCode).indexOf( keyword );
                const bIndex = ('+' + b.MobileCode).indexOf( keyword );
                if ( aIndex === bIndex ) {
                    return 0;
                } else if ( aIndex > bIndex ) {
                    return 1;
                } else {
                    return -1;
                }
            } );

            showData = showData.concat( result );
        }

        {
            let result = [];
            for ( let index = 0; index < dataArray.length; index++ ) {
                const item = dataArray[ index ];
                if ( item.sort.indexOf( keyword ) >= 0 && showData.indexOf( item ) < 0 ) {
                    result.push( item );
                }
            }

            result = result.sort( function ( a, b ) {
                const aIndex = a.sort.indexOf( keyword );
                const bIndex = b.sort.indexOf( keyword );
                if ( aIndex === bIndex ) {
                    return 0;
                } else if ( aIndex > bIndex ) {
                    return 1;
                } else {
                    return -1;
                }
            } );

            showData = showData.concat( result );
        }

        {
            let result = [];
            for ( let index = 0; index < dataArray.length; index++ ) {
                const item = dataArray[ index ];
                if ( item.sort.toUpperCase().indexOf( keyword.toUpperCase() ) >= 0 && showData.indexOf( item ) < 0 ) {
                    result.push( item );
                }
            }

            result = result.sort( function ( a, b ) {
                const aIndex = a.sort.toUpperCase().indexOf( keyword.toUpperCase() );
                const bIndex = b.sort.toUpperCase().indexOf( keyword.toUpperCase() );
                if ( aIndex === bIndex ) {
                    return 0;
                } else if ( aIndex > bIndex ) {
                    return 1;
                } else {
                    return -1;
                }
            } );

            showData = showData.concat( result );
        }


        return showData;
    }

    renderCommonItem( { item } ) {
        return (
            <TouchableItemComponent
                containerStyle={[ { height: 46 } ] }
                style={[ { height: 46 } ]}
                title={item.name}
                content={'+' + item.MobileCode}
                onPress={() => {
                    if ( this.props.onSelect ) {
                        this.props.onSelect( item );
                    }
                }}
                headerInterval={false}
                footerInterval={false}/>
        );
    }

    render() {
        const viewHeight = 46;
        const separatorHeight = 1;

        if ( !this.state.isOpen ) {
            return null;
        }

        return (
            <View style={[ commonStyles.wrapper, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, this.props.style ]}>
                <FlatList
                    keyboardShouldPersistTaps="always"
                    ref={( flatList ) => {
                        this._flatList = flatList;
                    }}
                    data={this.state.showData}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={this.renderCommonItem.bind( this )}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                    onScroll={() => {
                        if ( this.props.onScroll ) {
                            this.props.onScroll();
                        }
                    }}
                />
            </View>
        )
    }
}


function select( store ) {
    return {}
}

export default  connect( select )( CountrySearchListComponent );
