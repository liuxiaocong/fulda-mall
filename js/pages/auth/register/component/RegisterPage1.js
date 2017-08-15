import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import Hyperlink from "react-native-hyperlink";
import PhoneTokenVerifyComponent from "../../../../components/PhoneTokenVerifyComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { memberBindMobile, memberMobileVerifyToken } from "../../../../actions/MemberAction";
import { authMobileGetToken, authMobileVerifyToken } from "../../../../actions/AuthAction";
import UrlActionHandlerUtil from "../../../../util/UrlActionHandlerUtil";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import format from "string-format";


class RegisterPage1 extends React.Component {
    static propTypes = {
        onComplete: React.PropTypes.func.isRequired,
        isFinish: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );
        this.state = {
            error: '',
            isRequesting: false,
            isFinish: this.props.isFinish
        };
    }

    onComplete() {
        this.setState( {
            isFinish: true
        } );

        this
            .props
            .onComplete( {} );
    }

    handlerGetToken( cca2, mobile, callback ) {
        this.setState(
            {
                isRequesting: true,
                error: ''
            }
        );

        if ( this.props.user ) {
            this.props.dispatch(
                memberBindMobile(
                    cca2, mobile, ( err ) => {
                        this.setState(
                            {
                                isRequesting: false,
                                error: err ? err.message : ''
                            }
                        );

                        if ( err ) {
                            callback( false );
                        } else {
                            callback( true );

                            Toast.show( I18n.t( Keys.get_verify_code_success ) );
                        }
                    }
                )
            );
        } else {
            authMobileGetToken(
                cca2, mobile, false, '0', ( err ) => {
                    this.setState(
                        {
                            isRequesting: false,
                            error: err ? err.message : ''
                        }
                    );

                    if ( err ) {
                        callback( false );
                    } else {
                        callback( true );
                        Toast.show( I18n.t( Keys.get_verify_code_success ) );
                    }
                }
            );
        }
    }

    handleVerifyToken( callingCode, mobile, token ) {
        this.setState(
            {
                isRequesting: true,
                error: ''
            }
        );
        if ( this.props.user ) {
            this.props.dispatch(
                memberMobileVerifyToken(
                    token, '0', ( err ) => {
                        this.setState(
                            {
                                isRequesting: false,
                                error: err ? err.message : ''
                            }
                        );

                        if ( err !== null ) {
                            this.onComplete();
                        }
                    }
                )
            );
        } else {
            this.props.dispatch(
                authMobileVerifyToken(
                    callingCode, mobile, token, ( err ) => {
                        this.setState(
                            {
                                isRequesting: false,
                                error: err ? err.message : ''
                            }
                        );

                        if ( err === null ) {
                            this.onComplete();
                        }
                    }
                ) );
        }
    }

    tryVerifyToken() {
        this._phoneTokenVerifyComponent
            .tryVerifyToken();
    }

    render() {
        if ( this.state.isFinish ) {
            return <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}/>;
        }

        return (
            <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}>
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
                    }}
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
                            marginLeft: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={this
                        .tryVerifyToken
                        .bind( this )} title="">
                    {I18n.t( Keys.next_step )}
                </Button>

                <Hyperlink
                    style={[ {
                        marginTop: 26,
                        marginRight: 10,
                        marginLeft: 10
                    }
                    ]}
                    linkStyle={{
                        color: constStyles.THEME_COLOR,
                        fontSize: 12
                    }}
                    linkText={url => url === UrlActionHandlerUtil.genUserPrivacy()
                        ? I18n.t( Keys.user_agreement )
                        : url}
                    onPress={url => {
                        this.props.navigation.dispatch( NavigationActions.navigate( {
                            routeName: 'webViewPage',
                            params: {
                                url: url,
                                webTitle: I18n.t( Keys.user_agreement_title )
                            }
                        } ) )
                    }}>
                    <Text
                        style={[ {
                            textAlign: 'center',
                            fontSize: 12
                        }
                        ]}>
                        {
                            format(
                                I18n.t( Keys.user_agreement_detail ),
                                UrlActionHandlerUtil.genUserPrivacy()
                            )
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
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status }
}

export default  connect( select )( RegisterPage1 );
