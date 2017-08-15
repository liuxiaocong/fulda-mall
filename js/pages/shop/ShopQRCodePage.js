import { CameraRoll, Dimensions, StatusBar, Text, View } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import FDPermissionCheck from "../../FDNativePackage/FDPermissionCheck";
import { takeSnapshot } from "react-native-view-shot";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import UrlActionHandlerUtil from "../../util/UrlActionHandlerUtil";
import ShopInfoComponent from "./shopDetail/component/ShopInfoComponent";
import { shopGet } from "../../actions/ShopAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import ImageWithPlaceHolder from "../../components/ImageWithPlaceHolder";
import constStyles from "../../styles/constStyles";


class ShopQRCodePage extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_qrcode ),
            headerRight: (
                <Button
                    style={[
                        {
                            fontSize: 14,
                            color: constStyles.THEME_COLOR,
                            marginRight: 10
                        }
                    ]}
                    title=''
                    onPress={() => {
                        state.params.savePicture();
                    }}
                >
                    {I18n.t( Keys.save_picture )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            shop: props.navigation.state.params.data,
            shopId: props.navigation.state.params.dataId,
            qrUrl: UrlActionHandlerUtil.genShopUrl( props.navigation.state.params.dataId ),
            isProgress: false
        };
    }

    componentWillMount() {
        this.setState(
            {
                isProgress: true,
            }
        );
        this.props.dispatch(
            shopGet(
                this.state.shopId, ( err, res ) => {

                    if ( err ) {
                        Toast.show( err.message );
                    }

                    this.setState(
                        {
                            shop: err === null ? res.data : null,
                            isProgress: false,
                        }
                    );
                }
            )
        );

        this.props.navigation.setParams( {
            savePicture: this.savePicture.bind( this )
        } );
    }

    savePicture() {
        takeSnapshot( this._qrView, {
            format: "jpeg",
            quality: 0.8
        } )
            .then(
                ( uri ) => {
                    FDPermissionCheck.checkWriteExternalStoragePermission( {} )
                        .then( ( data ) => {
                            CameraRoll.saveToCameraRoll( uri, 'photo' )
                                .then( ( data ) => {
                                    Toast.show( I18n.t( Keys.save_success ) );
                                } )
                                .catch( ( error ) => {
                                    Toast.show( I18n.t( Keys.save_failed ) + ': ' + error.message );
                                } );
                        } )
                        .catch( ( error ) => {
                            Toast.show( I18n.t( Keys.save_failed ) + ': ' + error.message );
                        } );
                },
                ( error ) => {
                    Toast.show( I18n.t( Keys.save_failed ) + ': ' + error.message );
                }
            );
    }

    render() {
        let { user, identity } = this.props;
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />
                <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.justAlignCenter ]}
                      ref={( qrView ) => {
                          this._qrView = qrView;
                      }}>
                    <View style={[ { flexGrow: 1, }, commonStyles.justAlignCenter ]}>
                        <View style={[
                            {
                                width: 240,
                                height: 240,
                                borderRadius: 5,
                                borderColor: 'white',
                                borderWidth: 2
                            },
                            commonStyles.justAlignCenter
                        ]}>
                            <QRCode
                                style={[]}
                                value={this.state.qrUrl}
                                size={197}
                                logo={require( '../../imgs/icon.png' )}
                                logoSize={40}
                                bgColor='white'
                                fgColor='black'
                                ref={( qrCodeView ) => {
                                    this._qrCodeView = qrCodeView;
                                }}/>
                        </View>
                    </View>


                    <View style={[ {
                        marginBottom: 0,
                        width: Dimensions.get( 'window' ).width,
                    } ]}>
                        <View style={[ { backgroundColor: 'white', marginTop: 35, paddingTop: 35 } ]}>
                            <Text style={[ commonStyles.commonTextColorStyle, {
                                marginTop: 10,
                                marginBottom: 10,
                                fontSize: 16,
                                backgroundColor: 'rgba(255, 255, 255, 0)',
                                textAlign: 'center',
                                paddingLeft: 28,
                                paddingRight: 28,

                            } ]}>
                                {this.state.shop ? this.state.shop.name : ''}
                            </Text>

                            <ShopInfoComponent style={[ {} ]} business={this.state.shop}/>
                        </View>
                        {/*</View>*/}

                        <View style={[ {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0
                        }, commonStyles.justAlignCenter ]}>
                            <ImageWithPlaceHolder
                                style={{
                                    width: 70,
                                    height: 70,
                                } }
                                placeholderForIcon={'md-image'}
                                source={this.state.shop && this.state.shop.logo ? { uri: this.state.shop.logo } : null}
                            />
                        </View>
                    </View>
                </View>
                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}
                    isOpen={this.state.isProgress}
                >
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        )
    }
}

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default  connect( select )( ShopQRCodePage );
