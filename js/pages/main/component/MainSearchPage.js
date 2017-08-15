import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import FDLocationServices from "../../../FDNativePackage/FDLocationServices";
import Toast from "react-native-root-toast";
import settingActionTypes from "../../../reducers/setting/settingActionTypes";
import I18n from "../../../I18n";
import { connect } from "react-redux";
import SearchBar from "../../../components/SearchBar";
import commonStyles from "../../../styles/commonStyles";
import LoginTipBanner from "../../auth/component/LoginTipBanner";
import CategorySelectHorizontalList from "../../search/component/CategorySelectHorizontalList";
import ShopSearchFilterBar from "../../search/component/filter/ShopSearchFilterBar";
import ShopList from "../../search/component/ShopList";
import SearchAreaPickerComponent from "../../search/component/SearchAreaPickerComponent";
import MaskViewGroupComponent from "../../search/component/filter/mask/MaskViewGroupComponent2";
import Util from "../../../util/Util";
import { metaGetCategory } from "../../../actions/MetaAction";
import searchCountryData from "../../../../data/searchCountryData";
import sortingFieldData from "../../../../data/sortingFieldData";
import sortingOrderData from "../../../../data/sorting_order_data";
import shopTypeData from "../../../../data/shopTypeData";
import constStyles from "../../../styles/constStyles";
import Keys from "../../../configs/Keys";


class MainSearchPage extends React.Component {
    constructor( props ) {
        super( props );

        const currentSortingField = sortingFieldData[ 0 ];
        const currentSortingOrder = sortingOrderData[ 0 ];
        const currentShopType = shopTypeData[ 0 ];

        let searchCountry = searchCountryData[ 0 ];

        for ( let index = 0; index < searchCountryData.length; index++ ) {
            if ( this.props.searchCountry.code === searchCountryData[ index ].code ) {
                searchCountry = searchCountryData[ index ];
                break;
            }
        }

        this.state = {
            searchCountry: searchCountry,
            countryData: searchCountryData,
            countryPickerModalIsOpen: false,
            categoryData: this.parseCategoryData(),

            sortingFieldData: sortingFieldData,
            currentSortingField: currentSortingField,
            sortingOrderData: sortingOrderData,
            currentSortingOrder: currentSortingOrder,
            typeData: shopTypeData,
            currentType: currentShopType,

            baseQueryData: {
                sortingField: currentSortingField.code,
                sortingOrder: currentSortingOrder,
                type: currentShopType.code,
            },

            location: null,

            isNeedRefreshData: true
        };
    }

    componentWillMount() {
        this.props.dispatch( metaGetCategory( -1, ( err, resBody ) => {
            if ( err ) {
                console.log( err.message );
            } else {
                this.setState( {
                    categoryData: this.parseCategoryData(),
                } );
            }
        } ) );

        FDLocationServices.getCurrentLocation( {} )
            .then( ( location ) => {
                this.setState( {
                    location: location,
                    isNeedRefreshData: true
                } );

            } )
            .catch( ( error ) => {
                Toast.show( I18n.t( Keys.failed_to_get_location ) );
            } );
    }

    parseCategoryData() {
        let categoryList = [];
        if ( this.props.categoryList ) {
            categoryList = this.props.categoryList;
        }
        let ret = Util.buildCategoryPickDate( categoryList );
        let pickerData = ret[ 0 ];
        let dataMap = ret[ 1 ];

        let categoryData = [];

        for ( let index = 0; index < pickerData.length; index++ ) {
            categoryData.push( dataMap[ Object.keys( pickerData[ index ] )[ 0 ] ] );
        }

        return categoryData;
    }

    renderSearchHeader() {
        return (
            <View style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 7,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    backgroundColor: 'white'
                },
            ]}>

                <TouchableHighlight
                    underlayColor='#ddd'
                    onPress={() => {
                        this.setState( {
                            countryPickerModalIsOpen: true
                        } );
                    }}>
                    <View style={[ { flexDirection: 'row', }, commonStyles.justAlignCenter ]}>
                        <Text style={[ { fontSize: 14, color: '#616775' } ]}>
                            {this.state.searchCountry.name}
                        </Text>


                        <Icon
                            style={[ { marginLeft: 11 } ]}
                            name={'md-arrow-dropdown'} size={25}
                            color={'#616775'}
                        />
                    </View>
                </TouchableHighlight>


                <SearchBar
                    style={[ {
                        flex: 1,
                        marginLeft: 16
                    } ]}
                    onlyShow={true}
                    autoFocus={false}
                    placeholder={I18n.t( Keys.search_tip )}
                    onSearchChange={( text ) => {
                        console.log( "onSearchChange text = " + text );
                    }}
                    onEndEditing={( text ) => {
                        console.log( "onEndEditing text = " + text );
                    }}
                    onSubmitEditing={( text ) => {
                        console.log( "onSubmitEditing text = " + text );
                    }}
                    onClose={() => {
                        console.log( "onClose" );
                    }}
                    onStartSearch={() => {
                        console.log( "onStartSearch" );
                        this.props.navigation.navigate( 'searchPage' );
                    }}
                />

            </View>
        );
    }

    getSearchHeader() {
        return (
            <View>
                <CategorySelectHorizontalList
                    style={[ {} ]} navigation={this.props.navigation} data={this.state.categoryData}/>

                <View style={[ commonStyles.commonIntervalStyle ]}/>
                <View
                    style={[ {
                        height: 10,
                        backgroundColor: '#f1f3f5'
                    } ]}
                />
                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <ShopSearchFilterBar
                    ref={( businessSearchFilterBar ) => {
                        this._businessSearchFilterBar = businessSearchFilterBar;
                    }}

                    onSearchFilterChanged={( currentSortingField,
                                             currentSortingOrder,
                                             currentShopType ) => {
                        this.state.baseQueryData[ 'sortingField' ] = currentSortingField.code;
                        this.state.baseQueryData[ 'sortingOrder' ] = currentSortingOrder;
                        this.state.baseQueryData[ 'type' ] = currentShopType.code;


                        this.setState( {
                            currentSortingField: currentSortingField,
                            currentSortingOrder: currentSortingOrder,
                            currentType: currentShopType,
                            baseQueryData: this.state.baseQueryData,
                            isNeedRefreshData: true
                        } )
                    }}
                    onShowModalBox={( view, modelBoxContent ) => {
                        this._maskViewGroupComponent.showModalBox( false, view, this._contentView, modelBoxContent );
                    }}
                    onRequestClose={() => {
                        this._maskViewGroupComponent.hideModalBox();
                    }}
                    sortingFieldData={this.state.sortingFieldData}
                    currentSortingField={this.state.currentSortingField}
                    sortingOrderData={this.state.sortingOrderData}
                    currentSortingOrder={this.state.currentSortingOrder}
                    typeData={this.state.typeData}
                    currentType={this.state.currentType}
                />
            </View>
        );
    }


    render() {
        // baseQueryData: React.PropTypes.object.isRequired,
        //     location: React.PropTypes.object.isRequired,
        //     isNeedRefreshData: React.PropTypes.bool.isRequired

        return (
            <View style={[ commonStyles.wrapper, {
                paddingTop: constStyles.STATE_BAR_HEIGHT,
                backgroundColor: constStyles.STATUS_BAR_COLOR
            } ]}>
                <View style={[ commonStyles.wrapper, { backgroundColor: 'white' } ]} ref={( contentView ) => {
                    this._contentView = contentView;
                }}>
                    {this.renderSearchHeader()}

                    <ShopList {...this.props} style={[ { backgroundColor: 'white' } ]}
                              getSearchHeader={() => {
                                  return this.getSearchHeader();
                              }}
                              onScroll={() => {
                                  this._maskViewGroupComponent.hideModalBox();
                                  this._businessSearchFilterBar.close();
                              }}

                              baseQueryData={this.state.baseQueryData}
                              location={this.state.location}
                              isNeedRefreshData={() => {
                                  if ( this.state.isNeedRefreshData ) {
                                      this.setState( {
                                          isNeedRefreshData: false
                                      } );

                                      return true;
                                  }

                                  return false;
                              }}
                    />
                </View>

                <MaskViewGroupComponent ref={( maskViewGroupComponent ) => {
                    this._maskViewGroupComponent = maskViewGroupComponent;
                }}/>

                <View style={[ styles.floatView ]}>
                    {this.props.isLoggedIn === true
                        ? ( null )
                        : ( <LoginTipBanner {...this.props} style={[ {} ]}/> )}
                </View>

                <SearchAreaPickerComponent
                    isOpen={this.state.countryPickerModalIsOpen}
                    country={this.state.searchCountry}
                    countryData={this.state.countryData}
                    onChange={( searchCountry ) => {
                        this.setState( {
                            searchCountry: searchCountry,
                        } );

                        this
                            .props
                            .dispatch( ( dispatch ) => {
                                dispatch( {
                                    'type': settingActionTypes.SEARCH_COUNTRY_UPDATE,
                                    searchCountry: searchCountry,
                                } );
                            } );
                        this.setState( {
                            isNeedRefreshData: true
                        } );
                    }}
                    onClose={() => {
                        this.setState( {
                            countryPickerModalIsOpen: false,
                        } );

                    }}
                />
            </View>
        );


    }
}

const styles = StyleSheet.create( {
    floatView: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    welcome: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF',
    },
} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status,
        searchCountry: store.settingStore.searchCountry,
        categoryList: store.metaStore.categoryList,
    }
}

export default connect( select )( MainSearchPage );
