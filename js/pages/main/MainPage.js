import React from "react";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { StatusBar, View } from "react-native";
import MainPageTabBar from "./component/tab/MainPageTabBar";
import { connect } from "react-redux";
import MainFirstPage from "./component/MainFirstPage";
import MainSearchPage from "./component/MainSearchPage";
import MainShoppingCartPage from "./component/mainShoppingCartPage/MainShoppingCartPage";
import MainMePage from "./component/mainMePage/MainMePage";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import MainPageTabType from "./component/tab/MainPageTabType";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import FDCallbackNative from "../../FDNativePackage/FDCallbackNative";


class MainPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: navigation.state.params ? navigation.state.params.title : I18n.t( Keys.home ),
            header: null
        };
    };

    constructor( props ) {
        super( props );

        const initialPageIndex = (props.navigation.state.params !== undefined && props.navigation.state.params.index !== undefined) ? props.navigation.state.params.index : 0;

        this.state = {
            index: initialPageIndex,
        };

        StatusBar.setBackgroundColor( '#00000000', true );
        StatusBar.setTranslucent( true );
        StatusBar.setBarStyle( this.state.index === 0 ? constStyles.STATUS_BAR_CONTENT_STYLE_LIGHT : constStyles.STATUS_BAR_CONTENT_STYLE_DARK, true );
    }

    componentWillMount() {
        // StatusBar.setBarStyle( this.state.index === 0 ? constStyles.STATUS_BAR_CONTENT_STYLE_LIGHT : constStyles.STATUS_BAR_CONTENT_STYLE_DARK, false );

        this.updatePageTitle( this.state.index );
    }

    //noinspection JSMethodCanBeStatic
    componentDidMount() {
        FDCallbackNative.onMainPageDidMount();
    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ( nextProps.isLoggedIn !== this.props.isLoggedIn && nextProps.isLoggedIn === false ) {
            this
                ._scrollableTabView
                .goToPage( 0 );

            return false;
        }
        return true;
    }

    handleChangeTab( { i, ref, from } ) {
        this.updatePageTitle( i );
    }

    updatePageTitle( index ) {
        let title = I18n.t( Keys.home );
        if ( index === 0 ) {
            title = I18n.t( Keys.main_tab_first );
        } else if ( index === 1 ) {
            title = I18n.t( Keys.main_tab_search );
        } else if ( index === 2 ) {
            title = I18n.t( Keys.main_tab_shopping_cart )
        } else if ( index === 3 ) {
            title = I18n.t( Keys.main_tab_me )
        }

        this.props.navigation.setParams( { title: title } );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper ]}>
                <ScrollableTabView
                    ref={( scrollableTabView ) => {
                        this._scrollableTabView = scrollableTabView;
                    }}
                    initialPage={this.state.index}
                    locked={true}
                    tabBarPosition="bottom"
                    onChangeTab={this
                        .handleChangeTab
                        .bind( this )}
                    renderTabBar={() => <MainPageTabBar style={[ {} ]} tryGoToPage={( i ) => {
                        if ( i === 2 || i === 3 ) {
                            if ( !this.props.isLoggedIn ) {
                                this.props.navigation.navigate( 'loginPage' );
                                return false;
                            }
                        }

                        StatusBar.setBarStyle( i === 0 ? constStyles.STATUS_BAR_CONTENT_STYLE_LIGHT : constStyles.STATUS_BAR_CONTENT_STYLE_DARK, false );

                        return true;
                    }
                    }/>}>

                    <MainFirstPage tabLabel={MainPageTabType.MAIN_FIRST_PAGE} navigation={this.props.navigation}
                                   onGoToSearch={() => {
                                       this
                                           ._scrollableTabView
                                           .goToPage( 1 );

                                       StatusBar.setBarStyle( constStyles.STATUS_BAR_CONTENT_STYLE_DARK, false );
                                   }}/>
                    <MainSearchPage tabLabel={MainPageTabType.MAIN_SEARCH_PAGE} navigation={this.props.navigation}/>
                    <MainShoppingCartPage tabLabel={MainPageTabType.MAIN_SHOPPING_CART_PAGE}
                                          navigation={this.props.navigation}/>
                    <MainMePage tabLabel={MainPageTabType.MAIN_ME_PAGE} navigation={this.props.navigation}/>
                </ScrollableTabView>
            </View>
        );
    }
}

function

select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default  connect( select )( MainPage );
