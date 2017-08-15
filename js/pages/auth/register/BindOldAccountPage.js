import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { isNeedAdditionalInformation } from "../../../actions/MemberAction";
import Button from "react-native-button";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import { authBindAccount } from "../../../actions/AuthAction";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class BindOldAccountPage extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.bind_exist_account ),
            headerRight: (
                state.params && state.params.isOpenDebugMode ?
                    <Button
                        style={commonStyles.top_info_right_btn}
                        title=''
                        onPress={() => {
                            state.params.onTapLoginHisTory()
                        }}
                    >
                        Login history
                    </Button>
                    :
                    null
            )
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            username: '',
            password: '',
            error: '',
            isRequesting: false,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( {
            isOpenDebugMode: this.props.isOpenDebugMode,
            onTapLoginHisTory: this.onTapLoginHisTory.bind( this )
        } );
    }

    componentWillUnmount() {
    }

    onTapLoginHisTory() {
        this.props.navigation.navigate(
            'debugLoginHistoryPage',
            {
                callback: ( item ) => {
                    this.setState( {
                        username: item.account,
                        password: item.password,
                    } );
                }
            }
        );
    };

    componentWillReceiveProps( nextProps ) {
        if ( nextProps.isLoggedIn !== this.props.isLoggedIn && nextProps.isLoggedIn === true ) {
            //will redirect
            this.setState( {
                isRequesting: false
            } );

            this.props.navigation.dispatch( NavigationActions.reset( {
                index: 0,
                actions: [
                    NavigationActions.navigate( { routeName: 'mainPage' } ),
                ]
            } ) );
        }
    }

    handleBind() {
        this._accountTextInput.blur();
        this._PSWDTextInput.blur();

        if ( !this.state.username || !this.state.password ) {
            this.setState( { error: I18n.t( Keys.plz_input_user_name_and_password ) } );
            return;
        }

        this.setState( {
            isRequesting: true,
            error: ''
        } );

        this
            .props
            .dispatch( authBindAccount( this.state.username, this.state.password, this.props.facebookToken, ( err, resBody ) => {
                this.setState( {
                    isRequesting: false,
                    error: err !== null ? err.message : '',
                } );

                if ( err === null ) {
                    if ( isNeedAdditionalInformation( this.props.user ) ) {
                        this.props.navigation.navigate( 'registerPage' );
                    }
                }
            } ) );
    }

    getInputContainer() {
        return (
            <View style={[ commonStyles.inputTextGroupStyle ]}>
                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( accountTextInput ) => {
                            this._accountTextInput = accountTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.phone_or_email )}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        keyboardType={'default'}
                        underlineColorAndroid={'transparent'}
                        onChangeText={( text ) => {
                            this.state.username = text;
                            this.setState( { error: '' } );
                        }}
                        defaultValue={this.state.username}
                        returnKeyType={'next'}
                        returnKeyLabel={I18n.t( Keys.next )}
                        onSubmitEditing={() => {
                            this._PSWDTextInput.focus();
                        }}
                    />
                </View>

                <View style={[ commonStyles.commonIntervalStyle ]}/>

                <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                    <TextInput
                        ref={( PSWDTextInput ) => {
                            this._PSWDTextInput = PSWDTextInput;
                        }}
                        style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                        placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        placeholder={I18n.t( Keys.password )}
                        secureTextEntry={true}
                        autoCapitalize={'none'}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        keyboardType={'default'}
                        onChangeText={( text ) => {
                            this.state.password = text;
                            this.setState( { error: '' } );
                        }}
                        defaultValue={this.state.password}
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        onSubmitEditing={this
                            .handleBind
                            .bind( this )}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.paddingCommon, commonStyles.commonBorderTop, ]}>
                <View style={[ commonStyles.wrapper ]}>
                    {this.getInputContainer()}
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
                            .handleBind
                            .bind( this )} title={null}>
                        {I18n.t( Keys.bind )}
                    </Button>
                </View>

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

const styles = StyleSheet.create( {
    floatView: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    flexSub: {
        flex: 1,
        backgroundColor: 'pink',
        height: 100,
        marginRight: 0
    },
    operation: {
        height: 100,
        flexDirection: 'row'
    }
} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        facebookToken: store.userStore.facebookToken,
        user: store.userStore.user
    }
}
export default connect( select )( BindOldAccountPage );
