/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import QRCode from "react-native-qrcode-svg";
import { CameraRoll, StyleSheet, Text, View } from "react-native";
import FDPermissionCheck from "../../../FDNativePackage/FDPermissionCheck";
import { takeSnapshot } from "react-native-view-shot";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import UrlActionHandlerUtil from "../../../util/UrlActionHandlerUtil";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import constStyles from "../../../styles/constStyles";

const styles = StyleSheet.create(
    {}
);
class myNameCardPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.my_name_card ),
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
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            qrUrl: UrlActionHandlerUtil.genMemberUrl( this.props.user.id ),
        };
    }

    componentWillMount() {
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
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.wrapper, { backgroundColor: 'white', } ]} ref={( qrView ) => {
                    this._qrView = qrView;
                }}>
                    <View style={[ { flexGrow: 1, }, commonStyles.justAlignCenter ]}>
                        <View style={
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 240,
                                height: 240,
                                borderRadius: 5,
                                backgroundColor: '#f1f3f5',
                                borderColor: '#ffffff',
                                borderWidth: 2,
                                padding: 20,
                                shadowColor: '#000000',
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowRadius: 5,
                                shadowOpacity: 0.2
                            }
                        }>
                            <QRCode
                                style={[]}
                                value={this.state.qrUrl}
                                size={200}
                                logo={require( '../../../imgs/icon.png' )}
                                logoSize={40}
                                bgColor='white'
                                fgColor='black'
                                ref={( qrCodeView ) => {
                                    this._qrCodeView = qrCodeView;
                                }}/>
                        </View>
                    </View>

                    <View>
                        <View style={[
                            commonStyles.pdl_normal,
                            commonStyles.pdr_normal,
                            commonStyles.pdt_normal,
                            commonStyles.pdb_normal,
                            commonStyles.commonBorderTop,
                            commonStyles.commonBorderBottom,
                            {
                                backgroundColor: '#f5f7fa',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }
                        ]
                        }>
                            <Text style={ [ commonStyles.commonTextColorStyle,
                                {
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }
                            ] }
                            >{user.name}</Text>
                            <Text
                                style={[
                                    commonStyles.commonTextColorStyle,
                                    {
                                        fontSize: 14,
                                    }
                                ]}>
                                {identity}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <View style={[
                            commonStyles.pdl_normal,
                            commonStyles.pdr_normal,
                            commonStyles.pdt_normal,
                            commonStyles.pdb_normal,
                            {
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        ]
                        }>
                            {
                                user.email && user.email.length > 0 ?
                                    <Text
                                        style={
                                            {
                                                fontSize: 13,
                                                color: '#717789',
                                                textAlign: 'center'
                                            }
                                        }
                                    >{I18n.t( Keys.email ) + ": " + user.email}</Text>
                                    :
                                    null
                            }

                            {
                                user.mobile && user.mobile.length > 0 ?
                                    <Text
                                        style={
                                            {
                                                fontSize: 13,
                                                color: '#717789',
                                                textAlign: 'center'
                                            }
                                        }>{user.mobile ? I18n.t( Keys.phone ) + ": " + user.mobile : ""}</Text>
                                    :
                                    null
                            }

                            {
                                user.address && user.address.length > 0 ?
                                    <Text
                                        style={
                                            {
                                                fontSize: 13,
                                                color: '#717789',
                                                textAlign: 'center'
                                            }
                                        }>{user.address ? I18n.t( Keys.address ) + ": " + user.address : ""}</Text>
                                    :
                                    null
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default myNameCardPageView;
