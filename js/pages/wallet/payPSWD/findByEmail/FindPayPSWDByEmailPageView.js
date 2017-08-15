/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import * as UtilConfig from "../../../../configs/UtilConfig";
import { memberForgotPassword } from "../../../../actions/MemberAction";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#f1f3f5',
        paddingLeft: 0,
        paddingRight: 0,
    },
} );
class FindPayPSWDByEmailPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.find_back_pay_password ),
            headerBackTitle: ( {} ) => {
                return null
            },
            headerRight: (
                state.params && state.params.canFindByMobile ?
                    <Button
                        style={commonStyles.top_info_right_btn}
                        title=''
                        onPress={() => {
                            state.params.onFindBackByPhone()
                        }
                        }
                    >
                        {I18n.t( Keys.find_back_by_phone )}
                    </Button>
                    :
                    null
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            email: props.email
        };
    }

    componentWillMount() {
        this.props.navigation.setParams( {
            onFindBackByPhone: this.onFindBackByPhone.bind( this )
        } );
    }

    componentDidMount() {

    }

    onFindBackByPhone() {
        this.props.onFindBackByPhone();
    }

    componentWillUnmount() {
    }

    handleFindPsdByEmail() {
        this.setState( {
            isRequesting: true,
            error: ''
        } );
        memberForgotPassword( UtilConfig.FORGOT_PASSWORD_BY_EMAIL, ( err, res ) => {
            this.setState( { isRequesting: false } );
            if ( err ) {
                this.setState( { error: err.message } );
            } else {
                this.props.navigation.navigate( 'findPayPSWDByEmailSuccessPage' );
            }
        } );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ commonStyles.inputTextGroupStyle ]}>
                    <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                        <TextInput
                            style={[ commonStyles.wrapper, commonStyles.commonTextColorStyle ]}
                            placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                            ref={"emailTextInput"}
                            placeholder={I18n.t( Keys.plz_input_email )}
                            keyboardType="email-address"
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            editable={false}
                            onChangeText={( text ) => {
                                this.state.email = text;
                                this.setState( {
                                    error: ''
                                } );
                            }}
                            defaultValue={this.state.email}
                            returnKeyType={'done'}
                            returnKeyLabel={I18n.t( Keys.done )}
                            onSubmitEditing={this
                                .handleFindPsdByEmail
                                .bind( this )}
                        />

                    </View>
                </View>

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
                            marginLeft: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => this.handleFindPsdByEmail()} title={null}>
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

export default FindPayPSWDByEmailPageView;
