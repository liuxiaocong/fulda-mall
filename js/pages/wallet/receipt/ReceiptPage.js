import QRCode from "react-native-qrcode-svg";
import React from "react";
import { CameraRoll, StatusBar, StyleSheet, Text, View } from "react-native";
import { takeSnapshot } from "react-native-view-shot";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import FDPermissionCheck from "../../../FDNativePackage/FDPermissionCheck";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import UrlActionHandlerUtil from "../../../util/UrlActionHandlerUtil";
import Util from "../../../util/Util";
import Keys from "../../../configs/Keys";
import I18n from "../../../I18n";


class ReceiptPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.receipt ),
        };
    };


    constructor( props ) {
        super( props );

        this.state = {
            amount: null,
        };
    }

    saveImage() {
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

    genSetAmountText() {
        if ( this.state.amount !== null && this.state.amount !== undefined && this.state.amount > 0 ) {
            return I18n.t( Keys.amount_set_cancel );
        } else {
            return I18n.t( Keys.set_amount );
        }
    }

    onPressSetAmount() {
        if ( this.state.amount !== null && this.state.amount !== undefined && this.state.amount > 0 ) {
            this.setState( {
                amount: null
            } );
        } else {
            let that = this;
            this.props.navigation.navigate(
                'receiptSetAmountPage',
                {
                    callback: (function ( amout ) {
                        return that.refreshFunction.bind( that, amout )
                    })()
                }
            );
        }
    }

    refreshFunction( that, amount ) {
        this.setState( Object.assign( {}, this.state, {
            amount: amount
        } ) );
    }


    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBG, commonStyles.commonBorderTop, { alignItems: 'center', } ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <Text style={[ { color: '#c8c9cb', textAlign: 'center', marginTop: 20 } ]}>
                    {I18n.t( Keys.scan_pay_tip )}
                </Text>

                <View
                    style={[ commonStyles.justAlignCenter, {
                        marginTop: 32,
                        backgroundColor: 'white',
                        padding: 40,
                        width: 280,
                        borderRadius: 5,
                        shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 5,
                        },
                        shadowRadius: 5,
                        shadowOpacity: 0.2

                    } ]}
                    ref={( qrView ) => {
                        this._qrView = qrView;
                    }}
                >
                    {
                        this.state.amount !== null && this.state.amount !== undefined && this.state.amount > 0 ?
                            <Text style={[ {
                                marginBottom: 30,
                                fontSize: 14,
                                color: constStyles.THEME_COLOR,
                                fontWeight: 'bold'
                            } ]}>
                                {Util.getDisplaySymbol( this.props.user.currency )}
                                <Text style={[ { fontSize: 24, fontWeight: 'bold' } ]}>
                                    {" " + Util.getDisplayPrice( this.state.amount )}
                                </Text>
                            </Text>
                            :
                            null
                    }

                    <QRCode
                        style={{}}
                        value={
                            this.state.amount && this.state.amount > 0 ?
                                UrlActionHandlerUtil.genPaymentUrl( this.props.user.id, this.props.user.currency, this.state.amount ) :
                                UrlActionHandlerUtil.genQRPaymentUrl( this.props.user.id, this.props.user.currency )
                        }
                        size={198}
                        logo={require( '../../../imgs/icon.png' )}
                        bgColor='white'
                        fgColor='black'
                        ref={( qrCodeView ) => {
                            this._qrCodeView = qrCodeView;
                        }}/>
                </View>

                <View style={[ { flexDirection: 'row', marginTop: 40 }, commonStyles.justAlignCenter ]}>
                    <Button
                        style={[
                            {
                                fontSize: 14
                            },
                            commonStyles.commonTextColorStyle
                        ]}
                        onPress={() => this.onPressSetAmount()}
                        title={this.genSetAmountText()}>
                        {this.genSetAmountText()}
                    </Button>
                    <Button
                        style={[
                            {
                                fontSize: 14,
                                marginLeft: 84
                            },
                            commonStyles.commonTextColorStyle
                        ]}
                        onPress={() => this.saveImage()}
                        title="">
                        {I18n.t( Keys.save_picture )}
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status,
        nav: store.nav
    }
}

export default connect( select )( ReceiptPage );
