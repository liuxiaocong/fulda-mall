import Camera from "react-native-camera";

import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import ImagePicker from "react-native-image-crop-picker";
import FDQRScan from "../../FDNativePackage/FDQRScan";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import UrlActionHandlerUtil from "../../util/UrlActionHandlerUtil";
import UrlActionType from "../../util/UrlActionType";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";


class ScanPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.scan ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapAlbum()
                    }}
                >
                    {I18n.t( Keys.album )}
                </Button>
            )
        };
    };

    constructor( props ) {
        super( props );

        this.state = {
            barcode: '',
            cameraType: 'back',
            text: 'Scan Barcode',
            torchMode: 'off',
            type: '',
            barcodeScannerEnabled: true,
            isRequesting: false,
        };

        this.props.navigation.setParams( { onTapAlbum: this.onTapAlbum.bind( this ) } );
    };

    componentWillMount() {
        this.props.navigation.state.key = "scanPage";
    }

    componentDidMount() {
    }

    // shouldComponentUpdate( nextProps, nextState ) {
    //     return false;
    // }

    componentWillUnmount() {
    }

    onTapAlbum() {
        ImagePicker.openPicker( {
            width: 400,
            height: 400,
            cropping: true
        } ).then( image => {
            if ( image ) {
                this.setState( {
                    isRequesting: true,
                    barcodeScannerEnabled: false,
                } );

                FDQRScan.tryDecodeQRCode( {
                    width: image.width,
                    height: image.height,
                    mime: image.mime,
                    path: image.path,
                } )
                    .then( ( result ) => {
                        this.setState( {
                            isRequesting: false,
                            barcodeScannerEnabled: true,
                        } );

                        this.parseData( result.data )
                    } )
                    .catch( ( error ) => {
                        this.setState( {
                            isRequesting: false,
                            barcodeScannerEnabled: true,
                        } );

                        this.parseData( '' );
                    } );
            }
        } );
    };

    parseData( data ) {
        if ( !this.state.barcodeScannerEnabled ) {
            return;
        }

        const result = UrlActionHandlerUtil.parse( data );

        if ( result !== null ) {
            switch ( result.action ) {
                case UrlActionType.ACTION_USER:
                    this.state.barcodeScannerEnabled = false;

                    this.setState( {
                        barcodeScannerEnabled: false,
                    } );

                    this.props.navigation.navigate( 'userProfilePage', {
                        data: null,
                        dataId: parseInt( result.recomid )
                    } );
                    return;
                case UrlActionType.ACTION_SHOP:
                    this.state.barcodeScannerEnabled = false;

                    this.setState( {
                        barcodeScannerEnabled: false,
                    } );

                    this.props.navigation.navigate( 'shopDetailPage', {
                        data: null,
                        dataId: parseInt( result.shopid )
                    } );
                    return;
                case UrlActionType.ACTION_GOODS:
                    this.state.barcodeScannerEnabled = false;

                    this.setState( {
                        barcodeScannerEnabled: false,
                    } );

                    this.props.navigation.navigate( 'goodsDetailPage', {
                        data: null,
                        dataId: parseInt( result.goodid )
                    } );
                    return;
                case UrlActionType.ACTION_QR_PAYMENT:
                    this.state.barcodeScannerEnabled = false;

                    this.setState( {
                        barcodeScannerEnabled: false,
                    } );

                    if ( !this.props.isLoggedIn ) {
                        this.props.navigation.navigate( 'loginPage' );
                    } else {
                        this.props.navigation.navigate( 'walletQRPayPage', {
                            id: parseInt( result.receiver ),
                            currency: result.currency,
                            amount: result.receiver_amount,
                        } );
                    }
                    return;
                case UrlActionType.ACTION_PAYMENT:
                    this.state.barcodeScannerEnabled = false;

                    this.setState( {
                        barcodeScannerEnabled: false,
                    } );

                    if ( !this.props.isLoggedIn ) {
                        this.props.navigation.navigate( 'loginPage' );
                    } else {
                        this.props.navigation.navigate( 'walletQRPayPage', {
                            id: parseInt( result.receiver ),
                            currency: result.currency,
                            amount: result.receiver_amount,
                        } );
                    }
                    return;
            }
        }

        Toast.show( I18n.t( Keys.qrcode_not_valid ) + ': ' + data );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <Camera
                    style={[
                        commonStyles.wrapper,
                        {} ]}
                    aspect={Camera.constants.Aspect.fill}
                    barcodeScannerEnabled={this.state.barcodeScannerEnabled}
                    onBarCodeRead={( result ) => {
                        this.parseData( result.data );
                    }}
                />

                <View style={[ {
                    position: 'absolute',
                    bottom: 200,
                    left: 28,
                    right: 28,

                }, commonStyles.justAlignCenter ]}>

                    {/*<Button*/}
                    {/*style={[*/}
                    {/*{*/}
                    {/*fontSize: 16*/}
                    {/*},*/}
                    {/*commonStyles.commonTextColorStyle*/}
                    {/*]}*/}
                    {/*onPress={() => {*/}
                    {/*// this.parseData( UrlActionHandlerUtil.genReceiptUrl( this.props.user ? this.props.user.id : 31, this.props.user ? this.props.user.currency : 'SGD', null ) );*/}
                    {/*// this.parseData( UrlActionHandlerUtil.genReceiptUrl( this.props.user ? this.props.user.id : 31, this.props.user ? this.props.user.currency : 'SGD', 10 ) );*/}
                    {/*this.parseData( UrlActionHandlerUtil.genMemberUrl( this.props.user ? this.props.user.id : 31 ) );*/}
                    {/*// this.parseData( UrlActionHandlerUtil.genShopUrl( 31 ) );*/}
                    {/*// this.parseData( UrlActionHandlerUtil.genGoodsUrl( 4, 2 ) );*/}

                    {/*// this.parseData( 'sadsadadsa' );*/}
                    {/*}} title="">*/}
                    {/*测试*/}
                    {/*</Button>*/}

                    <Text style={[
                        {
                            fontSize: 20,
                            textAlign: 'center',
                            color: 'white',
                            backgroundColor: '#000000aa',
                            padding: 6
                        } ]}>
                        {I18n.t( Keys.scan_tips )}
                    </Text>
                </View>

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status
    }
}

export default connect( select )( ScanPage );
