import { CameraRoll, Dimensions, StatusBar, Text, View } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import FDPermissionCheck from "../../FDNativePackage/FDPermissionCheck";
import { takeSnapshot } from "react-native-view-shot";
import constStyles from "../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import UrlActionHandlerUtil from "../../util/UrlActionHandlerUtil";
import { shopGoodsGet } from "../../actions/ShopAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Util from "../../util/Util";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import ImageWithPlaceHolder from "../../components/ImageWithPlaceHolder";


class GoodsQRCodePage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.goods_qrcode ),
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
            goods: props.navigation.state.params.data,
            goodsId: props.navigation.state.params.dataId,
            qrUrl: UrlActionHandlerUtil.genGoodsUrl( props.navigation.state.params.dataId, props.navigation.state.params.data ? props.navigation.state.params.data.shopId : null ),
            isProgress: false
        };
    }

    componentWillMount() {
        this.setState(
            {
                isProgress: true,
            }
        );
        shopGoodsGet(
            this.state.goodsId, ( err, res ) => {

                if ( err ) {
                    Toast.show( err.message );
                }

                this.setState(
                    {
                        goods: err === null ? res.data : null,
                        isProgress: false,
                    }
                );
            }
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
                                    Toast.show( I18n.t( Keys.save_failed ) + error.message );
                                } );
                        } )
                        .catch( ( error ) => {
                            Toast.show( I18n.t( Keys.save_failed ) + error.message );
                        } );
                },
                ( error ) => {
                    Toast.show( I18n.t( Keys.save_failed ) + error.message );
                    console.error( "Oops, snapshot failed", error );
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
                <View style={[ commonStyles.wrapper, commonStyles.justAlignCenter, commonStyles.commonBG, ]}
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


                    <View style={
                        {
                            width: Dimensions.get( 'window' ).width,
                            marginBottom: 0,
                            backgroundColor: 'white',
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                            flexDirection: 'row'
                        }
                    }>

                        <ImageWithPlaceHolder
                            style={{
                                width: 100,
                                height: 100,
                            } }
                            placeholderForIcon={'md-image'}
                            source={this.state.goods && this.state.goods.logo ? { uri: this.state.goods.logo } : null}
                        />

                        <View style={[ { marginLeft: 10, flex: 1 } ]}>
                            <Text style={[ commonStyles.commonTextColorStyle, {
                                fontSize: 14,
                            } ]}>
                                {this.state.goods ? this.state.goods.name : ''}
                            </Text>

                            <Text style={[ { fontSize: 12, color: '#b4b8c0' } ]}>
                                {
                                    this.state.goods && this.state.goods.statistics ? '' + this.state.goods.statistics.noOfHits : ''
                                }
                                <Text>
                                    {I18n.t( Keys.browse )}
                                </Text>
                            </Text>

                            <Text style={[ { fontSize: 13, color: constStyles.THEME_COLOR } ]}>
                                {this.state.goods ? Util.getShowPrice( this.state.goods.displayCurrency, this.state.goods.displayPrice ) : ''}
                            </Text>
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

export default connect( select )( GoodsQRCodePage );
