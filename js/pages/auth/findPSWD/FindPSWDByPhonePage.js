import React from "react";
import { Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import { authMobileGetToken, authMobileVerifyToken } from "../../../actions/AuthAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import PhoneTokenVerifyComponent from "../../../components/PhoneTokenVerifyComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import { isNeedAdditionalInformation } from "../../../actions/MemberAction";
import { connect } from "react-redux";


class FindPSWDByPhonePage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.find_back_account_or_password ),
            headerRight: (
                state.params && state.params.canFindByEmail ?
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
                            state.params.findByEmail();
                        }}
                    >
                        {I18n.t( Keys.find_back_by_email )}
                    </Button>
                    :
                    null
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            error: '',
            isRequesting: false,
        };
    }

    componentWillMount() {
        this.props.navigation.state.key = "findPSWDByPhonePage";

        this.props.navigation.setParams( {
            findByEmail: this.findByEmail.bind( this )
        } );
    }

    findByEmail() {
        this.props.navigation.navigate( 'findPSWDByEmailPage', {
            canFindByMobile: !this.props.user || (this.props.user.mobile && this.props.user.mobile.length > 0)
        } );
    }


    handlerGetToken( cca2, mobile, callback ) {
        this.setState(
            {
                isRequesting: true,
            }
        );

        authMobileGetToken(
            cca2, mobile, false, '1', ( err, resBody ) => {
                this.setState(
                    {
                        isRequesting: false,
                        error: err !== null ? err.message : ''
                    }
                );

                if ( err ) {
                    callback( false );
                } else {
                    Toast.show( I18n.t( Keys.get_verify_code_success ) );

                    callback( true );
                }
            }
        );

    }

    handleVerifyToken( callingCode, mobile, token ) {
        if ( mobile === undefined || mobile.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_mobile )
                }
            );
            return;
        }

        if ( token === undefined || token.length <= 0 ) {
            this.setState(
                {
                    error: I18n.t( Keys.plz_input_verify_code )
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

        this.props.dispatch(
            authMobileVerifyToken(
                callingCode, mobile, token, ( err, resBody ) => {
                    this.setState(
                        {
                            isRequesting: false,
                            error: err !== null ? err.message : ''
                        }
                    );

                    if ( err === null ) {
                        if ( isNeedAdditionalInformation( resBody.data ) ) {
                            this.props.navigation.navigate( 'registerPage' );
                        } else {
                            this.props.navigation.navigate( 'completeUserInfoPage', {
                                title: isNeedAdditionalInformation( resBody.data ) ? I18n.t( Keys.complete_user_info ) : I18n.t( Keys.reset_login_password )
                            } );
                        }
                    }
                }
            ) );
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>

                <PhoneTokenVerifyComponent
                    navigation={this.props.navigation}
                    ref={( phoneTokenVerifyComponent ) => {
                        this._phoneTokenVerifyComponent = phoneTokenVerifyComponent;
                    }}
                    onError={( err ) => {
                        this.setState( { error: err } );
                    }}
                    onGetToken={( country, cca2, callingCode, mobile, callback ) => {
                        this.handlerGetToken( cca2, mobile, callback );
                    }}
                    onVerifyToken={( country, cca2, callingCode, mobile, token ) => {
                        this.handleVerifyToken( callingCode, mobile, token );
                    }}/>

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
                    onPress={() => {
                        this._phoneTokenVerifyComponent.tryVerifyToken();
                    }} title="">
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

export default connect( select )( FindPSWDByPhonePage );
