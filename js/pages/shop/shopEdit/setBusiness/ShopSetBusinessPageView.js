import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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
class ShopSetBusinessPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.main_business ),
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
            business: props.business,
            error: ''
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._businessTextInput.blur();

        if ( !this.state.business || this.state.business.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_set_main_business ) } );
            return;
        }

        this.setState( { isRequesting: true, error: '' } );
        this.props.onTapSave(
            this.state.business, ( err, resBody ) => {
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
                    ref={( businessTextInput ) => {
                        this._businessTextInput = businessTextInput;
                    }}
                    style={[ commonStyles.commonInput ]}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    maxLength={UtilConfig.MAX_LENGTH.SHOP_BUSINESS}
                    placeholder={I18n.t( Keys.plz_set_main_business )}
                    onChangeText={
                        ( text ) => {
                            this.setState( { business: text } );
                        }
                    }
                    defaultValue={this.state.business}
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .onTapSave
                        .bind( this )}
                />

                <Text
                    style={[
                        commonStyles.errorTipStyle
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

export default ShopSetBusinessPageView;
