/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import { connect } from "react-redux";
import countryDataMap from "../../../../data/countryDataMap";
import CountrySelectListComponent from "./CountrySelectListComponent";
import SearchBar from "../../../components/SearchBar";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import constStyles from "../../../styles/constStyles";
import CountrySearchListComponent from "./CountrySearchListComponent";


const styles = StyleSheet.create( {} );
class CountrySelectPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.search ),
            header: null
        };
    };

    constructor( props ) {
        super( props );

        const keys = Object.keys( countryDataMap );

        let values = keys.map( function ( v ) {
            return countryDataMap[ v ];
        } );

        values = values.sort( function ( a, b ) {
            if ( a.sort === b.sort ) {
                return 0;
            } else if ( a.sort > b.sort ) {
                return 1;
            } else {
                return -1;
            }
        } );

        let navState = this.props.navigation.state;

        this.state = {
            countryDataMap: countryDataMap,
            dataKeys: keys,
            showData: values,
            isOpenSearchPage: false,
            keyword: '',
            callback: navState.params ? navState.params.callback : null,
        };

        this._renderSearchHeader = this.renderSearchHeader();
    }

    componentWillUnmount() {
    }

    componentDidMount() {

    }

    renderSearchHeader() {
        return (
            <View style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 7,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 10,
                    backgroundColor: 'white',
                },
            ]}>
                <SearchBar
                    style={[ {
                        flex: 1,
                    } ]}
                    ref={( searchBar ) => {
                        this._searchBar = searchBar;
                    }}
                    onlyShow={false}
                    autoFocus={false}
                    placeholder={I18n.t( Keys.search_country_tip )}
                    onSearchChange={( text ) => {
                        this.setState( {
                            keyword: text
                        } );
                    }}
                    onEndEditing={( text ) => {
                        console.log( "onEndEditing text = " + text );
                    }}
                    onSubmitEditing={( text ) => {

                    }}
                    onClose={() => {
                        if ( this.state.isOpenSearchPage ) {
                            this.setState( {
                                isOpenSearchPage: false
                            } );

                            this._searchBar.blur();

                            this._searchBar.setTextWithSubmit( '' );
                        } else {
                            this.props.navigation.goBack();
                        }
                    }}
                    onStartSearch={() => {
                        console.log( "onStartSearch" );
                    }}
                    onFocus={() => {
                        this.setState( {
                            isOpenSearchPage: true
                        } );
                    }}
                    onBlur={() => {
                        // this.setState( {
                        //     isOpenSearchPage: false
                        // } );

                        // this._searchBar.setTextWithSubmit( '' );
                    }}
                />
            </View>
        )
            ;
    }

    onCallback( item ) {
        if ( this.state.callback && this.state.callback instanceof Function ) {
            this.state.callback( item );
        }

        this.props.navigation.goBack();
    };

    render() {
        return (
            <View style={[ commonStyles.wrapper, {
                backgroundColor: 'white',
                paddingTop: constStyles.STATE_BAR_HEIGHT
            }, ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={true}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                {
                    this._renderSearchHeader
                }

                <View style={[ commonStyles.wrapper ]}>
                    <CountrySelectListComponent
                        data={this.state.showData}
                        isShowYIndex={!this.state.isOpenSearchPage}
                        onSelect={( item ) => {
                            this.onCallback( item )
                        }}
                        onScroll={() => {

                        }}
                    />


                    <CountrySearchListComponent
                        style={[ {
                            flex: 1,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        } ]}
                        data={this.state.showData}
                        keyword={this.state.keyword}
                        onSelect={( item ) => {
                            this.onCallback( item )
                        }}
                        onScroll={() => {

                        }}
                        isOpen={this.state.isOpenSearchPage}
                        onClose={
                            () => {
                                this._searchBar.blur();
                            }
                        }
                    />
                </View>
            </View>
        )
    }
}


function select( store ) {
    return {}
}

export default connect( select )( CountrySelectPage );
