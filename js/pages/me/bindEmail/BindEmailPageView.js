import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
const styles = StyleSheet.create( {} );
class BindEmailPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.set_email ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            email: props.user.email ? props.user.email : '',
            error: ''
        };
    }

    componentWillMount() {
        this.props.navigation.state.key = "bindEmailPage";
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    bindEmail() {
        this._emailTextInput.blur();

        if ( !this.state.email || this.state.email.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_email )
            } );
            return;
        }

        this.setState( { isRequesting: true, error: '' } );
        this.props.bindEmail( this.state.email, ( err, resBody ) => {
            this.setState( { isRequesting: false } );
            if ( err ) {
                this.setState( { error: err.message } );
            } else {
                this.props.navigation.navigate( 'bindEmailSuccessPage' );
            }
        } );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, { backgroundColor: 'white' }, commonStyles.paddingCommon ]}>


                <TextInput
                    ref={( emailTextInput ) => {
                        this._emailTextInput = emailTextInput;
                    }}
                    style={[ commonStyles.commonTextColorStyle, commonStyles.commonInput ]}
                    placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                    placeholder={I18n.t( Keys.plz_input_email )}
                    keyboardType="email-address"
                    underlineColorAndroid={'transparent'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={( text ) => {
                        this.state.email = text;
                        this.setState( { error: '' } );
                    }}
                    defaultValue={this.state.email}
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .bindEmail
                        .bind( this )}
                />

                <Text
                    style={[
                        commonStyles.errorTipStyle
                    ]}>
                    {this.state.error}
                </Text>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.bindEmail()} title={null}>
                    {I18n.t( Keys.submit )}
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
        )
    }
}

export default BindEmailPageView;
