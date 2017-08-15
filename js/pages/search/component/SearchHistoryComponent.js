import React from "react";

import { BackHandler, FlatList, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import { clearSearchHistory } from "../../../actions/ShopAction";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class SearchHistoryComponent extends React.Component {
    static propTypes = {
        onSearch: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        isOpen: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            isOpen: this.props.isOpen,
            data: this.props.searchHistory
        };
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

    componentWillReceiveProps( nextPros ) {
        this.setState( {
            isOpen: nextPros.isOpen,
            data: nextPros.searchHistory
        } );
    }

    renderSearchHistoryHeader() {
        return (
            <View >
                <View style={[ {
                    paddingTop: 25,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingBottom: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                } ]}>
                    <Text
                        style={[ {
                            fontSize: 12,
                            color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR
                        } ]}>{I18n.t( Keys.search_history_title )}</Text>
                    <Button
                        style={[
                            {
                                fontSize: 12,
                                color: constStyles.THEME_COLOR,
                                right: 0
                            }
                        ]}
                        onPress={() => {
                            this.props.dispatch( clearSearchHistory() );
                        }} title="">
                        { I18n.t( Keys.clear_history )}
                    </Button>
                </View>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        );
    }

    renderSearchHistory() {
        const viewHeight = 46;
        const separatorHeight = 1;

        return (
            <View style={[ styles.container, {} ]}>
                <FlatList
                    keyboardShouldPersistTaps="always"
                    data={this.state.data}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => {
                        return (
                            <TouchableItemComponent
                                containerStyle={[ {}
                                ]}
                                style={[ {
                                    height: viewHeight
                                } ]}
                                title={item}
                                onPress={() => {
                                    if ( this.props.onSearch ) {
                                        this.props.onSearch( item );
                                    }
                                }}
                                headerInterval={false}
                                footerInterval={false}/>
                        );
                    }}
                    ListHeaderComponent={() => {
                        if ( this.state.data && this.state.data.length > 0 ) {
                            return this.renderSearchHistoryHeader()
                        } else {
                            return null
                        }
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>
                    }}
                    getItemLayout={( item, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                />

            </View>
        );
    }

    render() {
        return (
            this.state.isOpen ? this.renderSearchHistory()
                : null
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#fffffff0',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
} );

function select( store ) {
    return {
        searchHistory: store.userStore.searchHistory,
    }
}

export default connect( select )( SearchHistoryComponent );

