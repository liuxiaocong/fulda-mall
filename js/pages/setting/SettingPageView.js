import React from "react";
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Button from "react-native-button";
import Picker from "react-native-picker";
import { NavigationActions } from "react-navigation";
import Toast from "react-native-root-toast";
import * as UtilConfig from "../../configs/UtilConfig";
import currencyTypes from "../../../data/currencyType";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import TouchableItemComponent from "../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import FDConfig from "../../FDNativePackage/FDConfig";


const styles = StyleSheet.create(
    {}
);

class SettingPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.setting ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            currency: props.currency,
            appUrl: UtilConfig.APP_URL,
            isRequesting: false,
            versionTapCount: 0
        };
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        Picker.hide();
    }

    static getCurrencyDescription( currency ) {
        return currency.name + ' ' + currency.symbol;
    }

    handleCurrencySelect() {
        let dataArray = [];
        for ( let i = 0; i < currencyTypes.length; i++ ) {
            if ( currencyTypes[ i ] ) {
                dataArray.push( SettingPageView.getCurrencyDescription( currencyTypes[ i ] ) );
            }
        }

        Picker.init(
            {
                pickerCancelBtnText: I18n.t( Keys.cancel ),
                pickerConfirmBtnText: I18n.t( Keys.confirm ),
                pickerConfirmBtnColor: constStyles.PICKER_CONFIRM_COLOR,
                pickerCancelBtnColor: constStyles.PICKER_CANCEL_COLOR,
                pickerTitleText: I18n.t( Keys.plz_select ),
                pickerData: dataArray,
                selectedValue: [ SettingPageView.getCurrencyDescription( this.state.currency ) ],
                onPickerConfirm: ( data ) => {
                    this.setState(
                        {
                            currency: currencyTypes[ dataArray.indexOf( data[ 0 ] ) ]
                        }
                    );
                    this.props.onSelectCurrency( currencyTypes[ dataArray.indexOf( data[ 0 ] ) ] );
                },
                onPickerCancel: data => {
                    console.log( data );
                },
                onPickerSelect: data => {
                    console.log( data );
                }
            }
        );
        Picker.show();
    }

    onTapLogout() {
        this.setState(
            {
                isRequesting: true,
            }
        );
        this.props.onTapLogout(
            ( err, resBody ) => {
                this.setState(
                    {
                        isRequesting: false,
                    }
                );

                if ( err ) {
                    Toast.show( err.message );
                } else {
                    Toast.show( I18n.t( Keys.logout_success ) );
                    this.props.navigation.dispatch(
                        NavigationActions.reset(
                            {
                                index: 0,
                                actions: [
                                    NavigationActions.navigate( { routeName: 'mainPage' } ),
                                ]
                            }
                        )
                    );
                }
            }
        );
    }

    onTapVersion() {
        this.setState(
            {
                versionTapCount: this.state.versionTapCount + 1
            }
        );

        if ( this.state.versionTapCount >= 7 ) {
            Toast.show( 'You have open debug mode' );

            this.props.openDebugMode();
        }
    }

    render() {
        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null || user === null ) {
            return (
                <View/>
            );
        }
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <ScrollView style={[ commonStyles.wrapper, {} ]}>
                    <View style={[ commonStyles.pdt_normal, commonStyles.pdb_normal ]}>
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.user_password )}
                            onPress={() => {
                                console.log( this );
                                this.props.onTapPassword();
                                Picker.hide();
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.paid_password )}
                            onPress={() => {
                                this.props.onTapPaidPassword();
                                Picker.hide();
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.display_currency )}
                            content={SettingPageView.getCurrencyDescription( this.state.currency )}
                            onPress={() => {
                                this.handleCurrencySelect();
                            }}
                            headerInterval={true}
                            footerInterval={false}/>

                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.about_fulda )}
                            onPress={() => {
                                this.props.onTapAbout();
                                Picker.hide();
                            }}
                            headerInterval={true}
                            footerInterval={false}/>
                        <TouchableItemComponent
                            containerStyle={[ {} ]}
                            title={I18n.t( Keys.give_me_comment )}
                            onPress={() => {
                                Linking.openURL( this.state.appUrl );
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        {
                            this.props.isOpenDebugMode ?
                                <TouchableItemComponent
                                    containerStyle={[ {
                                        marginTop: 40
                                    } ]}
                                    title={'Debug'}
                                    onPress={() => {
                                        this.props.navigation.navigate( 'debugPage' )
                                    }}
                                    headerInterval={true}
                                    footerInterval={true}/>
                                :
                                null
                        }


                        <Button
                            containerStyle={[
                                commonStyles.buttonContainerStyle, {
                                    marginLeft: 38,
                                    marginRight: 38,
                                    marginTop: 40
                                }
                            ]}
                            style={[ commonStyles.buttonContentStyle ]}
                            onPress={() => this.onTapLogout()}
                            title={I18n.t( Keys.logout_current_account )}>
                            {I18n.t( Keys.logout_current_account )}
                        </Button>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.onTapVersion();
                            }}>
                            <View
                                style={[
                                    {
                                        height: 40,
                                        marginLeft: 38,
                                        marginRight: 38,
                                    },
                                    commonStyles.justAlignCenter
                                ]}

                            >
                                <Text style={
                                    {
                                        color: '#999',
                                        fontSize: 14
                                    }
                                }>
                                    {I18n.t( Keys.version ) + (FDConfig.getVersion() ? FDConfig.getVersion() : "1.0")}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </ScrollView>

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

export default SettingPageView;
