import React from "react";
import { Image, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import CreditCardUtil from "../../../util/CreditCardUtil";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import constStyles from "../../../styles/constStyles";
import { paymentCreditCardCreate } from "../../../actions/PaymentAction";
import UrlActionHandlerUtil from "../../../util/UrlActionHandlerUtil";
import format from "string-format";
import Hyperlink from "react-native-hyperlink";


class MyCreditCardAddPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.add_card ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    {I18n.t( Keys.save )}
                </Button>
            ),
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            cardNo: '',
            creditCardIcon: CreditCardUtil.calcCreditCardIcon( '' ),
            expiryDate: '',
            expiryMonth: 0,
            expiryYear: 0,
            CVV: '',
            isPrimary: false,
            error: '',
            isRequesting: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._cardNoTextInput.blur();
        this._expiryDateTextInput.blur();
        this._CVVTextInput.blur();

        if ( !CreditCardUtil.validateCardNumber( this.state.cardNo ) ) {
            this.setState( { error: I18n.t( Keys.plz_input_card_number ) } );
            return;
        }

        if ( !CreditCardUtil.validateCardExpiry( this.state.expiryDate ) ) {
            this.setState( { error: I18n.t( Keys.plz_input_expiry_date ) } );
            return;
        }

        if ( !CreditCardUtil.validateCardCVC( this.state.CVV ) ) {
            this.setState( { error: I18n.t( Keys.plz_input_cvv ) } );
            return;
        }

        this.state.expiryDate = CreditCardUtil.formatExpiryDate( this.state.expiryDate );

        this.setState( {
            error: '',
            isRequesting: false
        } );

        this.props.dispatch( paymentCreditCardCreate( CreditCardUtil.formatCreditCardNoWithoutSpace( this.state.cardNo ), this.state.CVV, CreditCardUtil.formatExpiryDateWithYYYYMM( this.state.expiryDate ), CreditCardUtil.calcCreditCardType( this.state.cardNo ), this.state.isPrimary, ( err, resBody ) => {
            this.setState( {
                error: err ? err.message : '',
                isRequesting: false
            } );

            if ( !err ) {
                Toast.show( I18n.t( Keys.add_success ) );
                this.props.navigation.goBack();
            }
        } ) );
    }

    renderAmountInput() {
        return (
            <View style={[ { paddingLeft: 15, paddingRight: 15 } ]}>
                <View>
                    <TextInput
                        ref={( cardNoTextInput ) => {
                            this._cardNoTextInput = cardNoTextInput;
                        }}
                        style={[ commonStyles.commonInput, { paddingLeft: 50 } ]}
                        defaultValue={this.state.cardNo}
                        underlineColorAndroid={'transparent'}
                        autoFocus={true}
                        keyboardType="numeric"
                        placeholder={I18n.t( Keys.card_number )}
                        maxLength={19}
                        onChangeText={
                            ( text ) => {
                                this.setState( { cardNo: CreditCardUtil.formatCreditCardNoWithSpace( text ) } )
                            }
                        }
                        returnKeyType={'next'}
                        returnKeyLabel={I18n.t( Keys.next )}
                        onSubmitEditing={() => {
                            this._expiryDateTextInput.focus();
                        }}
                    />

                    <Image
                        pointerEvents={"none"}
                        style={[
                            {
                                width: 30,
                                height: 30,
                                position: 'absolute',
                                left: 10,
                                top: 5,
                                bottom: 5
                            }
                        ]}
                        source={CreditCardUtil.calcCreditCardIcon( CreditCardUtil.calcCreditCardType( this.state.cardNo ) )}/>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop, commonStyles.pdb_normal
                ]}>

                <View style={[ commonStyles.pdt_normal, { backgroundColor: 'white' } ]}>
                    {this.renderAmountInput()}

                    <View style={[ {
                        flexDirection: 'row',
                        marginTop: 10,
                        paddingLeft: 15, paddingRight: 15
                    } ]}>
                        <TextInput
                            ref={( expiryDateTextInput ) => {
                                this._expiryDateTextInput = expiryDateTextInput;
                            }}
                            style={[ commonStyles.commonInput, { flex: 1 } ]}
                            defaultValue={this.state.expiryDate}
                            underlineColorAndroid={'transparent'}
                            keyboardType="numeric"
                            placeholder={'MM / YY'}
                            maxLength={7}
                            onChangeText={
                                ( text ) => {
                                    this.setState( { expiryDate: CreditCardUtil.formatExpiryDate( text ) } )
                                }
                            }
                            returnKeyType={'next'}
                            returnKeyLabel={I18n.t( Keys.next )}
                            onSubmitEditing={() => {
                                this._CVVTextInput.focus();
                            }}
                        />
                        <TextInput
                            ref={( CVVTextInput ) => {
                                this._CVVTextInput = CVVTextInput;
                            }}
                            style={[ commonStyles.commonInput, { flex: 1, marginLeft: 10 } ]}
                            defaultValue={this.state.CVV}
                            underlineColorAndroid={'transparent'}
                            keyboardType="numeric"
                            placeholder={'CVV'}
                            maxLength={4}
                            onChangeText={
                                ( text ) => {
                                    this.setState( { CVV: text } )
                                }
                            }
                            returnKeyType={'done'}
                            returnKeyLabel={I18n.t( Keys.done )}
                            onSubmitEditing={this
                                .onTapSave
                                .bind( this )}
                        />
                    </View>

                    {
                        this.state.error && this.state.error.length > 0 ?
                            <Text
                                style={[
                                    commonStyles.errorTipStyle
                                ]}>
                                {this.state.error}
                            </Text>
                            :
                            null
                    }

                    <View
                        style={[ commonStyles.commonBorderBottom, {
                            flexDirection: 'row',
                            height: 50,
                            alignItems: 'center',
                            backgroundColor: '#fff',
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
                            onValueChange={( value ) => {
                                this.setState( { isPrimary: value } );
                            }}
                            value={this.state.isPrimary}/>
                    </View>
                </View>

                <Hyperlink
                    style={[ {
                        marginTop: 10,
                        marginRight: 15,
                        marginLeft: 15
                    }
                    ]}
                    linkStyle={{
                        color: constStyles.THEME_COLOR,
                        fontSize: 12
                    }}
                    linkText={url => url === UrlActionHandlerUtil.genAddCardPrivacy()
                        ? I18n.t( Keys.add_card_agreement_title )
                        : url}
                    onPress={( url ) => {
                        this.props.navigation.dispatch( NavigationActions.navigate( {
                            routeName: 'webViewPage',
                            params: {
                                url: url,
                                webTitle: I18n.t( Keys.add_card_agreement_title )
                            }
                        } ) )
                    }}>
                    <Text
                        style={[ {
                            fontSize: 12
                        }
                        ]}>
                        {
                            format( I18n.t( Keys.add_card_agreement_detail ), " " + UrlActionHandlerUtil.genAddCardPrivacy() + " " )
                        }
                    </Text>
                </Hyperlink>

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
    return {}
}

export default connect( select )( MyCreditCardAddPage );
