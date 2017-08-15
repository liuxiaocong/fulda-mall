import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import { authForgetPassword } from "../../../actions/AuthAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { connect } from "react-redux";


class FindPSWDByEmailPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.find_back_account_or_password ),
            headerRight: (
                state.params && state.params.canFindByMobile ?
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
                            state.params.findByPhone();
                        }}
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
            email: props.user ? props.user.email : '',
            editable: !props.user,
            error: '',
            isRequesting: false,
        };
    }

    componentWillMount() {
        this.props.navigation.setParams( {
            findByPhone: this.findByPhone.bind( this )
        } );
    }

    findByPhone() {
        this._emailTextInput.blur();

        this.props.navigation.goBack();
    }

    handleFindPswdByEmail() {
        this._emailTextInput.blur();

        if ( this.state.email.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_email )
                }
            );
            return;
        }

        this.setState(
            {
                isRequesting: true,
                error: ''
            }
        );

        authForgetPassword(
            this.state.email, ( err, res ) => {
                this.setState(
                    {
                        isRequesting: false,
                        error: err !== null ? err.message : ''
                    }
                );

                if ( err === null ) {
                    this.props.navigation.navigate( 'findPSWDByEmailSuccessPage' );
                }
            }
        );
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
                            ref={( emailTextInput ) => {
                                this._emailTextInput = emailTextInput;
                            }}
                            placeholder={I18n.t( Keys.plz_input_email )}
                            keyboardType="email-address"
                            underlineColorAndroid={'transparent'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            editable={this.state.editable}
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
                                .handleFindPswdByEmail
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
                            marginLeft: 10,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this
                        .handleFindPswdByEmail
                        .bind( this )} title={null}>
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
        );
    }
}

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user
    }
}

export default connect( select )( FindPSWDByEmailPage );

