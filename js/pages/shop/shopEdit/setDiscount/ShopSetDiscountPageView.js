import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Keys from "../../../../configs/Keys";
import I18n from "../../../../I18n";
import * as UtilConfig from "../../../../configs/UtilConfig";

const styles = StyleSheet.create( {} );
class ShopSetDiscountPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.fulda_discount_setting ),
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
            )
        };
    };

    constructor( props ) {
        super( props );

        let discount = "";
        if ( props.discount > 0 ) {
            discount = props.discount + "";
        }
        let shopType = props.shopType;

        let navState = this.props.navigation.state;
        if ( navState.params ) {
            if ( discount.length <= 0 && navState.params.discount ) {
                discount = '' + navState.params.discount;
            }

            if ( !shopType ) {
                shopType = navState.params.shopType;
            }
        }

        this.state = {
            shopType: shopType,
            discount: discount,
            callback: navState.params ? navState.params.callback : null,
            isRequesting: false,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._discountTextInput.blur();

        if ( !this.state.discount || this.state.discount.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_set_discount_percentage ) } );
            return;
        }

        const discount = parseInt( this.state.discount );

        let minDiscount = 5;
        if ( this.state.shopType && this.state.shopType === 1 ) {
            minDiscount = 10;
        }

        if ( isNaN( discount ) || discount < minDiscount || discount > 100 ) {
            this.setState( { error: I18n.t( Keys.plz_set_discount_percentage ) } );
            return;
        }

        if ( this.state.callback instanceof Function ) {
            this.state.callback( this.state.discount );
            this.props.navigation.goBack();
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.discount, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        )
    };

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>

                <View
                    style={
                        {
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    }>
                    <TextInput
                        ref={( discountTextInput ) => {
                            this._discountTextInput = discountTextInput;
                        }}
                        maxLength={UtilConfig.MAX_LENGTH.SHOP_DISCOUNT}
                        style={[ commonStyles.commonInput, { flexGrow: 1, fontSize: 14 } ]}
                        underlineColorAndroid={'transparent'}
                        autoFocus={true}
                        keyboardType="numeric"
                        placeholder={I18n.t( Keys.plz_set_discount_percentage )}
                        onChangeText={
                            ( text ) => {
                                this.setState( { discount: text } );
                            }
                        }
                        defaultValue={this.state.discount}
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        onSubmitEditing={this
                            .onTapSave
                            .bind( this )}
                    />
                    <Text style={
                        {
                            color: "#000",
                            marginLeft: 5
                        }
                    }>%</Text>
                </View>


                <View style={{
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: '#c8c9cb',
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        {I18n.t( Keys.min_discount_tip )}</Text>
                </View>

                <Text
                    style={[
                        commonStyles.errorTipStyle, {
                            marginTop: 20
                        }
                    ]}>
                    {this.state.error}
                </Text>

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
        )
    }
}

export default ShopSetDiscountPageView;
