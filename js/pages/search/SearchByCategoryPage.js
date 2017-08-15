import React from "react";
import { Image, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Toast from "react-native-root-toast";
import FDLocationServices from "../../FDNativePackage/FDLocationServices";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import ShopSearchFilterBar from "./component/filter/ShopSearchFilterBar";
import ShopList from "./component/ShopList";
import MaskViewGroupComponent from "./component/filter/mask/MaskViewGroupComponent2";
import ShopSearchCategoryFilterBarChild from "./component/filter/ShopSearchCategoryFilterBarChild";
import sortingFieldData from "../../../data/sortingFieldData";
import sortingOrderData from "../../../data/sorting_order_data";
import shopTypeData from "../../../data/shopTypeData";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import constStyles from "../../styles/constStyles";


class SearchByCategoryPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        //noinspection JSCheckFunctionSignatures
        return {
            title: I18n.t( Keys.search_by_category ),
            headerTitle: (
                <TouchableHighlight style={[ { flex: 1 } ]} underlayColor='#ddd' onPress={() => {
                    state.params.onSearchFilter()
                }}>
                    <View style={[ {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexDirection: 'row'
                    } ]}>
                        <Text
                            style={[ {
                                color: 'black',
                                fontSize: 18,
                                fontWeight: 'bold'
                            } ]}>
                            {state.params.category.name}
                        </Text>

                        <Image
                            style={{
                                width: 8,
                                height: 4,
                                marginLeft: 5
                            }}
                            source={state.params.currentOpenType ? require( '../../imgs/ic_arrow_up.png' ) : require( '../../imgs/ic_arrow_down.png' )}/>
                    </View>
                </TouchableHighlight>
            )
        };
    };

    constructor( props ) {
        super( props );

        const currentSortingField = sortingFieldData[ 0 ];
        const currentSortingOrder = sortingOrderData[ 0 ];
        const currentShopType = shopTypeData[ 0 ];

        this.state = {
            category: this.props.navigation.state.params.category,
            childCategory: null,
            sortingFieldData: sortingFieldData,
            currentSortingField: currentSortingField,
            sortingOrderData: sortingOrderData,
            currentSortingOrder: currentSortingOrder,
            typeData: shopTypeData,
            currentType: currentShopType,

            baseQueryData: {
                category: this.props.navigation.state.params.category.id,
                sortingField: currentSortingField.code,
                sortingOrder: currentSortingOrder,
                type: currentShopType.code,
            },

            location: null,

            isNeedRefreshData: true
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onSearchFilter: this.onSearchFilter.bind( this ) } );
    }

    componentWillMount() {
        FDLocationServices.getCurrentLocation( {} )
            .then(
                ( location ) => {
                    this.setState(
                        {
                            location: location,
                            isNeedRefreshData: true
                        }
                    );

                }
            )
            .catch(
                ( error ) => {
                    Toast.show( I18n.t( Keys.failed_to_get_location ) );
                }
            );
    }

    onSearchFilter() {
        if ( !this.props.navigation.state.params.currentOpenType ) {
            this._maskViewGroupComponent.showModalBox(
                true,
                null,
                this._contentView,
                <ShopSearchCategoryFilterBarChild
                    onSearchFilterChanged={( rowData ) => {
                        this._maskViewGroupComponent.hideModalBox();
                        this.props.navigation.setParams( { currentOpenType: !this.props.navigation.state.params.currentOpenType } );
                        this.state.baseQueryData[ 'category' ] = rowData.id;

                        this.setState( {
                            childCategory: rowData,
                            baseQueryData: this.state.baseQueryData,
                            isNeedRefreshData: true
                        } )
                        ;
                    }}
                    data={this.state.category.children}
                />
            );
        } else {
            this._maskViewGroupComponent.hideModalBox();
        }

        this.props.navigation.setParams( { currentOpenType: !this.props.navigation.state.params.currentOpenType } );
    };


    getSearchHeader() {
        return (
            <View>
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
                        this._maskViewGroupComponent.showModalBox( true, view, this._contentView, modelBoxContent );
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
        return (
            <View
                style={[
                    commonStyles.wrapper
                ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}
                      ref={( contentView ) => {
                          this._contentView = contentView;
                      }}>
                    <ShopList {...this.props}
                              style={[ { backgroundColor: 'white' } ]}
                              getSearchHeader={() => {
                                  return this.getSearchHeader();
                              }}
                              onScroll={() => {
                                  this._maskViewGroupComponent.hideModalBox();
                                  this._businessSearchFilterBar.close();
                                  // this.props.navigation.setParams( { currentOpenType: false } );
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
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( SearchByCategoryPage );
