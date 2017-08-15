import React from "react";
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";


class DebugLoginHistoryPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: 'Debug login history',
        };
    };

    constructor( props ) {
        super( props );

        let navState = this.props.navigation.state;

        this.state = {
            callback: navState.params.callback,
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _renderItem = ( { item, index } ) => {
        return (
            <TouchableHighlight style={[
                commonStyles.wrapper,
                {
                    height: 44,
                    backgroundColor: 'white',
                },
            ]}
                                underlayColor='#ddd'
                                onPress={() => {
                                    if ( this.state.callback instanceof Function ) {
                                        this.state.callback( item );
                                        this.props.navigation.goBack();
                                    }
                                }}>
                <View
                    style={[ commonStyles.wrapper, { justifyContent: 'center', paddingLeft: 28, paddingRight: 28, } ]
                    }>
                    <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                        {item.account}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        const viewHeight = 44;
        const separatorHeight = 1;
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <FlatList
                    style={[ commonStyles.wrapper, {} ]}
                    renderItem={this._renderItem}
                    data={this.props.loginHistoryForDebug}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>;
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        loginHistoryForDebug: store.userStore.loginHistoryForDebug,
    }
}

export default  connect( select )( DebugLoginHistoryPage );
