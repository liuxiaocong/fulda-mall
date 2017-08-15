import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import FDLocationServices from "../../../FDNativePackage/FDLocationServices";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import FDPermissionCheck from "../../../FDNativePackage/FDPermissionCheck";
import I18n from "../../../I18n";
import { connect } from "react-redux";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import LoginTipBanner from "../../auth/component/LoginTipBanner";
import RecommendGoodsHorizontalList from "../../search/component/recommend/RecommendGoodsHorizontalList";
import RecommendShopHorizontalList from "../../search/component/recommend/RecommendShopHorizontalList";
import { shopGoodsSearch, shopSearch } from "../../../actions/ShopAction";
import Keys from "../../../configs/Keys";


class MainFirstPage extends React.Component {
    static propTypes = {
        onGoToSearch: React.PropTypes.func.isRequired
    };

    constructor( props ) {
        super( props );
        this.state = {
            hasRecommendData: true,
            recommendServices: null,
            hasRecommendService: false,
            recommendBusinesses: null,
            hasRecommendBusiness: false,
            location: null,
        };
    }

    componentWillMount() {

        this.loadData( ( err1, err2, recommendBusinesses, recommendServices ) => {
            let errMsg = '';

            if ( err1 ) {
                errMsg += err1.message;
            }

            if ( err2 ) {
                errMsg += err2.message;
            }

            if ( errMsg ) {
                Toast.show( errMsg );
            }
            const hasRecommendService = recommendServices && recommendServices.length > 0;
            const hasRecommendBusiness = recommendBusinesses && recommendBusinesses.length > 0;

            this.setState( {
                hasRecommendData: hasRecommendService || hasRecommendBusiness,
                recommendServices: recommendServices,
                hasRecommendService: hasRecommendService,
                recommendBusinesses: recommendBusinesses,
                hasRecommendBusiness: hasRecommendBusiness,
            } );

        } );
    }

    componentWillReceiveProps( nextProps ) {
        if ( this.props.displayCurrency !== nextProps.displayCurrency ) {
            this.loadData( ( err1, err2, recommendBusinesses, recommendServices ) => {
                let errMsg = '';

                if ( err1 ) {
                    errMsg += err1.message;
                }

                if ( err2 ) {
                    errMsg += err2.message;
                }

                if ( errMsg ) {
                    Toast.show( errMsg );
                }
                const hasRecommendService = recommendServices && recommendServices.length > 0;
                const hasRecommendBusiness = recommendBusinesses && recommendBusinesses.length > 0;

                this.setState( {
                    hasRecommendData: hasRecommendService || hasRecommendBusiness,
                    recommendServices: recommendServices,
                    hasRecommendService: hasRecommendService,
                    recommendBusinesses: recommendBusinesses,
                    hasRecommendBusiness: hasRecommendBusiness,
                } );

            } );
        }
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        FDLocationServices.cancelGetLocation();
    }

    loadData( callback ) {
        FDLocationServices
            .getCurrentLocation( {} )

            .then(
                ( location ) => {
                    this
                        .setState( {
                            location: location,
                        } );

                    this
                        .props
                        .dispatch( shopSearch

                        ( {
                                lat: location.latitude
                                ,
                                lng: location.longitude
                                ,
                                pageSize: 20
                                ,
                                pageNum: 0
                            }
                            ,
                            ( errForBusiness, resForBusiness ) => {
                                this.props.dispatch( shopGoodsSearch(
                                    {
                                        lat: location.latitude,
                                        lng: location.longitude,
                                        pageSize: 20,
                                        pageNum: 0
                                    },
                                    ( errForService, resForService ) => {
                                        callback( errForBusiness, errForService, !errForBusiness ? resForBusiness.data : null, !errForService ? resForService.data : null );
                                    } ) );
                            }
                        ) )
                    ;
                } )
            .catch( ( error ) => {
                callback( Error( I18n.t( Keys.failed_to_get_location ) ), null, null, null );
            } );
    }

    handleGoToSearch() {
        if ( this.props.onGoToSearch ) {
            this.props.onGoToSearch();
        }
    }

    renderOperationView() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ styles.operation ]}>
                <TouchableHighlight
                    underlayColor={constStyles.HOME_TAB_UNDERLAY_COLOR}
                    onPress={() => {
                        // this.props.navigation.navigate( 'testPage' );

                        FDPermissionCheck.checkCameraPermission( {} )
                            .then( ( data ) => {
                                this.props.navigation.navigate( 'scanPage' );
                            } )
                            .catch( ( error ) => {
                                this.props.navigation.navigate( 'scanPage' );
                            } );

                        // this.props.navigation.navigate( 'locationPickerPage1' );
                    }}
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub ]}>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50
                            }}
                            source={require( '../../../imgs/ic_scan.png' )}/>
                        <Text style={[ { fontSize: 15, color: 'white', marginTop: 6 } ]}>{I18n.t( Keys.scan )}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={constStyles.HOME_TAB_UNDERLAY_COLOR}
                    onPress={() => {
                        if ( !this.props.isLoggedIn ) {
                            this.props.navigation.navigate( 'loginPage' );
                        } else {
                            this.props.navigation.navigate( 'receiptPage' );
                        }
                    }}
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub ]}>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50
                            }}
                            source={require( '../../../imgs/ic_receipt.png' )}/>
                        <Text style={[ { fontSize: 15, color: 'white', marginTop: 6 } ]}>{I18n.t( Keys.receipt )}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor={constStyles.HOME_TAB_UNDERLAY_COLOR}
                    onPress={() => {
                        if ( !this.props.isLoggedIn ) {
                            this.props.navigation.navigate( 'loginPage' );
                        } else {
                            this.props.navigation.navigate( 'topUpPage' );
                        }
                    }}
                    style={[ commonStyles.wrapper, commonStyles.justAlignCenter, styles.flexSub ]}>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50
                            }}
                            source={require( '../../../imgs/ic_recharge.png' )}/>

                        <Text style={[ { fontSize: 15, color: 'white', marginTop: 6 } ]}>{I18n.t( Keys.top_up )}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    renderRecommendData() {
        return (
            <View>
                {this.state.hasRecommendService ?
                    <RecommendGoodsHorizontalList
                        {...this.props}
                        style={[ {
                            flex: 1,
                        }
                        ]}
                        data={this.state.recommendServices}
                        location={this.state.location}
                    />
                    :
                    null
                }

                {this.state.hasRecommendBusiness ?
                    <RecommendShopHorizontalList
                        { ...this.props }
                        style={[ {
                            flex: 1,
                        }
                        ]}
                        data={this.state.recommendBusinesses}
                        location={this.state.location}
                    />
                    : null
                }
            </View>);
    }

    renderSearchTip() {
        return (
            <View style={[ styles.searchTip, commonStyles.justAlignCenter ]}>
                <View style={[ { width: Dimensions.get( 'window' ).width, } ]}>
                    <Text style={[ {
                        fontSize: 16, textAlign: 'center', marginRight: 38,
                        marginLeft: 38, color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR
                    } ]}>
                        {I18n.t( Keys.more_goods_tip )}
                    </Text>
                    <Button
                        containerStyle={[
                            commonStyles.buttonContainerStyle, {
                                marginRight: 38,
                                marginLeft: 38,
                                marginTop: 40
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this
                            .handleGoToSearch
                            .bind( this )} title="">
                        {I18n.t( Keys.search )}
                    </Button>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG ]}>
                <View style={
                    {
                        height: constStyles.STATE_BAR_HEIGHT,
                        backgroundColor: constStyles.THEME_STATUS_BAR_COLOR,
                    }
                }/>
                {this.renderOperationView()}
                <ScrollView style={[ commonStyles.wrapper ]}>
                    <View style={[ commonStyles.wrapper, { paddingBottom: this.props.isLoggedIn === true ? 0 : 50 } ]}>
                        {this.state.hasRecommendData ? this.renderRecommendData() : this.renderSearchTip()}

                    </View>
                </ScrollView>

                <View style={[ styles.floatView ]}>
                    {this.props.isLoggedIn === true
                        ? ( null )
                        : ( <LoginTipBanner {...this.props} style={[ {} ]}/> )}
                </View>
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
    flexSub: {
        flex: 1,
        height: 114,
        marginRight: 0
    },
    operation: {
        height: 114,
        flexDirection: 'row',
        backgroundColor: constStyles.THEME_COLOR
    },
    searchTip: {
        width: Dimensions.get( 'window' ).width,
        height: Dimensions.get( 'window' ).height - ( 114 + constStyles.STATE_BAR_HEIGHT) - 48 - 50,
    }
} );
function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status,
        displayCurrency: store.settingStore.displayCurrency
    }
}
export default  connect( select )( MainFirstPage );
