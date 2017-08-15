import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import * as UtilConfig from "../../../../configs/UtilConfig";
const styles = StyleSheet.create( {} );
class ShopSetTelephonePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.phone ),
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
        this.state = {
            isRequesting: false,
            telephone: props.telephone
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._telephoneTextInput.blur();

        if ( !this.state.telephone || this.state.telephone.length <= 0 ) {
            Toast.show( I18n.t( Keys.plz_set_phone ) );
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.telephone, ( err, resBody ) => {
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

                <TextInput
                    ref={( telephoneTextInput ) => {
                        this._telephoneTextInput = telephoneTextInput;
                    }}
                    style={[ commonStyles.commonInput, ]}
                    underlineColorAndroid={'transparent'}
                    maxLength={UtilConfig.MAX_LENGTH.SHOP_TELEPHONE}
                    autoFocus={true}
                    keyboardType="numeric"
                    placeholder={I18n.t( Keys.plz_set_phone )}
                    onChangeText={
                        ( text ) => {
                            this.setState( { telephone: text } );
                        }
                    }
                    defaultValue={this.state.telephone}
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .onTapSave
                        .bind( this )}
                />

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

export default ShopSetTelephonePageView;
