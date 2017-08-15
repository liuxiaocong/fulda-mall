import React from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import CreditCardUtil from "../../../util/CreditCardUtil";
import constStyles from "../../../styles/constStyles";
import { paymentCreditCardDelete, paymentCreditCardSetDefault } from "../../../actions/PaymentAction";


class MyCreditCardShowPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: CreditCardUtil.calcCreditCardTitle( params.data.cardNo ),
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            data: this.props.navigation.state.params.data,
            isPrimary: this.props.navigation.state.params.data.default,
            payCreditCardData: this.props.payCreditCardData,
            isRequesting: false
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            payCreditCardData: nextProps.payCreditCardData
        } );
    }

    handlerSetPrimary() {
        this.setState( {
            isRequesting: true
        } );

        this.props.dispatch( paymentCreditCardSetDefault( this.state.data, ( err, resBody ) => {
            this.setState( {
                isRequesting: false
            } );

            if ( err ) {
                Toast.show( err.message );
                this.setState( { isPrimary: false } );
            }
        } ) );
    }

    handlerDelete() {
        this.setState( {
            isRequesting: true
        } );

        this.props.dispatch( paymentCreditCardDelete( this.state.data, ( err, resBody ) => {
            this.setState( {
                isRequesting: false
            } );

            if ( err ) {
                Toast.show( err.message );
            } else {
                Toast.show( I18n.t( Keys.delete_success ) );
                this.props.navigation.goBack();
            }
        } ) );
    }

    render() {
        const creditCardLogoResult = CreditCardUtil.calcCreditCardLogo( this.state.data.type );
        const resource = creditCardLogoResult.resource;
        const width = creditCardLogoResult.width;
        const height = creditCardLogoResult.height;

        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <View style={[ { flex: 1 } ]}>
                    <View style={[ {
                        backgroundColor: 'white', overflow: 'hidden',
                        borderRadius: 5, marginLeft: 15, marginRight: 15, marginTop: 15, padding: 15
                    } ]}>
                        <View style={[ { flexDirection: 'row', justifyContent: 'space-between' } ]}>
                            <Image
                                style={{
                                    height: height, width: width
                                }}
                                resizeMode={'contain'}
                                source={resource}/>

                            {
                                this.state.data.default ?
                                    <View style={[ {
                                        backgroundColor: '#0ed912',
                                        borderRadius: 5,
                                        padding: 5, height: 20
                                    }, commonStyles.justAlignCenter ]}>
                                        <Text style={[ {
                                            fontSize: 10,
                                            includeFontPadding: false,
                                            padding: 0,
                                            color: 'white'
                                        } ]}>
                                            {
                                                I18n.t( Keys.primary ).toUpperCase()
                                            }
                                        </Text>
                                    </View>
                                    :
                                    null
                            }
                        </View>

                        <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14, marginTop: 30 } ]}>
                            {CreditCardUtil.formatCreditCardNoWithEncryptionAndSpace( this.state.data.last4Digits )}
                        </Text>

                        <Text style={[ { fontSize: 12, color: '#717789', marginTop: 50 } ]}>
                            {
                                I18n.t( Keys.expiry_data ).toUpperCase()
                            }
                        </Text>
                        <Text style={[ { fontSize: 12, color: '#717789' } ]}>
                            {CreditCardUtil.formatExpiryDate( this.state.data.expiryDate )}
                        </Text>
                    </View>

                    {
                        this.state.payCreditCardData.length <= 1 ?
                            <Text style={[ commonStyles.text_h5, {
                                marginTop: 15,
                                marginBottom: 15,
                                marginLeft: 15,
                                marginRight: 15,
                            } ]}>
                                Your primary card
                            </Text>
                            :
                            <View
                                style={[ {
                                    flexDirection: 'row',
                                    height: 60,
                                    alignItems: 'center',
                                    marginTop: 10,
                                    paddingLeft: 15,
                                    paddingRight: 15
                                } ]}
                            >
                                <Text style={[ commonStyles.text_h5, {
                                    flexGrow: 1
                                } ]}>
                                    {
                                        I18n.t( Keys.set_as_primary )
                                    }
                                </Text>
                                <Switch
                                    value={this.state.isPrimary}
                                    disabled={this.state.isPrimary}
                                    onValueChange={( value ) => {
                                        this.setState( { isPrimary: value } );

                                        this.handlerSetPrimary();
                                    }}
                                />
                            </View>
                    }
                </View>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 38,
                            marginLeft: 38,
                            marginBottom: 20
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this
                        .handlerDelete
                        .bind( this )} title="">
                    {
                        I18n.t( Keys.delete )
                    }
                </Button>

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
        payCreditCardData: store.walletStore.payCreditCardData,
    }
}

export default connect( select )( MyCreditCardShowPage );
