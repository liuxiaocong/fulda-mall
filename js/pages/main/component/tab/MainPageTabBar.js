import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import I18n from "../../../../I18n";
import constStyles from "../../../../styles/constStyles";
import MainPageTabType from "./MainPageTabType";
import Keys from "../../../../configs/Keys";

const MainPageTabBar = React.createClass( {
    propTypes: {
        tryGoToPage: React.PropTypes.func,
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array
    },

    componentDidMount() {
    },

    //color between rgb(59,89,152) and rgb(204,204,204)
    iconColor( progress ) {
        const red = 59 + ( 204 - 59 ) * progress;
        const green = 89 + ( 204 - 89 ) * progress;
        const blue = 152 + ( 204 - 152 ) * progress;
        return `rgb(${ red }, ${ green }, ${ blue })`;
    },

    renderTab( tab, i ) {
        let tabIcon;
        let tabName;

        if ( tab === MainPageTabType.MAIN_FIRST_PAGE ) {
            //noinspection JSCheckFunctionSignatures
            tabIcon = this.props.activeTab === i ? require( '../../../../imgs/ic_tab_home_focus.png' ) : require( '../../../../imgs/ic_tab_home.png' );
            tabName = I18n.t( Keys.main_tab_first );
        } else if ( tab === MainPageTabType.MAIN_SEARCH_PAGE ) {
            //noinspection JSCheckFunctionSignatures
            tabIcon = this.props.activeTab === i ? require( '../../../../imgs/ic_tab_discover_focus.png' ) : require( '../../../../imgs/ic_tab_discover.png' );
            tabName = I18n.t( Keys.main_tab_search );
        } else if ( tab === MainPageTabType.MAIN_SHOPPING_CART_PAGE ) {
            //noinspection JSCheckFunctionSignatures
            tabIcon = this.props.activeTab === i ? require( '../../../../imgs/ic_tab_shop_focus.png' ) : require( '../../../../imgs/ic_tab_shop.png' );
            tabName = I18n.t( Keys.main_tab_shopping_cart );
        } else if ( tab === MainPageTabType.MAIN_ME_PAGE ) {
            //noinspection JSCheckFunctionSignatures
            tabIcon = this.props.activeTab === i ? require( '../../../../imgs/ic_tab_me_focus.png' ) : require( '../../../../imgs/ic_tab_me.png' );
            tabName = I18n.t( Keys.main_tab_me );
        }

        return (
            <TouchableOpacity
                focusedOpacity={1}
                activeOpacity={1}
                key={tab} onPress={() => {
                if ( !this.props.tryGoToPage || this.props.tryGoToPage( i ) ) {
                    this.props.goToPage( i );
                }
            }} style={styles.tab}>
                <Image
                    style={{
                        width: 28,
                        height: 28
                    }}
                    source={tabIcon}/>

                <Text style={[ {
                    fontSize: 10,
                    color: this.props.activeTab === i
                        ? constStyles.THEME_COLOR
                        : '#c3c6d0',
                    includeFontPadding: false
                } ]}>{tabName}</Text>

            </TouchableOpacity>
        );
    },

    render() {
        return <View style={[ styles.tabs, this.props.style ]}>
            {this
                .props
                .tabs
                .map( ( tab, i ) => {
                    return this.renderTab( tab, i );
                } )}
        </View>;
    }
} );

const styles = StyleSheet.create( {
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    tabs: {
        height: 48,
        flexDirection: 'row',
        paddingTop: 0,
        borderWidth: 0,
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopColor: '#eaeaea'

    }
} );

export default MainPageTabBar;
