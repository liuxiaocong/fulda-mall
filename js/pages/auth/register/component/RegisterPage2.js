import React from "react";
import { Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import { memberCompleteSignUp1 } from "../../../../actions/MemberAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import * as UtilConfig from "../../../../configs/UtilConfig";


class RegisterPage2 extends React.Component {
    static propTypes = {
        onComplete: React.PropTypes.func.isRequired,
        isFinish: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );
        this.state = {
            name: '',
            idNo: '',
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

    onNext() {
        this._nameTextInput.blur();
        this._idTextInput.blur();

        if ( this.state.name.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_name )
            } );
            return;
        }

        if ( this.state.idNo.length <= 0 ) {
            this.setState( {
                error: I18n.t( Keys.plz_input_id_number )
            } );
            return;
        }

        this.setState( {
            isRequesting: true
        } );

        this.props.dispatch( memberCompleteSignUp1( this.state.name, this.state.idNo, ( err, resBody ) => {
            this.setState( {
                isRequesting: false,
                error: err !== null ? err.message : ''
            } );
            if ( err === null ) {
                this.onComplete();
            }
        } ) );
    }


    render() {
        if ( this.state.isFinish ) {
            return <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}/>;
        }

        return (
            <View style={[ commonStyles.wrapper, commonStyles.paddingCommon ]}>
                <View style={[ commonStyles.wrapper ]}>
                    <View style={[ commonStyles.inputTextGroupStyle ]}>
                        <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                            <TextInput
                                ref={( nameTextInput ) => {
                                    this._nameTextInput = nameTextInput;
                                }}
                                style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                placeholder={I18n.t( Keys.name )}
                                autoCapitalize={'none'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                onChangeText={( text ) => {
                                    this.state.name = text;
                                }}
                                defaultValue={this.state.name}
                                returnKeyType={'next'}
                                returnKeyLabel={I18n.t( Keys.next )}
                                onSubmitEditing={() => {
                                    this._idTextInput.focus();
                                }}
                            />
                        </View>

                        <View style={[ commonStyles.commonIntervalStyle ]}/>
                        <View style={[ commonStyles.inputTextGroupItemStyle ]}>
                            <TextInput
                                ref={( idTextInput ) => {
                                    this._idTextInput = idTextInput;
                                }}
                                style={[ commonStyles.wrapper, commonStyles.commonTextInputStyle ]}
                                placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                                placeholder={I18n.t( Keys.id_number )}
                                autoCapitalize={'none'}
                                underlineColorAndroid={'transparent'}
                                autoCorrect={false}
                                maxLength={UtilConfig.MAX_LENGTH.USER_ID_NO}
                                onChangeText={( text ) => {
                                    this.state.idNo = text;
                                }}
                                defaultValue={this.state.idNo}
                                returnKeyType={'done'}
                                returnKeyLabel={I18n.t( Keys.done )}
                                onSubmitEditing={this
                                    .onNext
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
                        onPress={this
                            .onNext
                            .bind( this )} title="">
                        {I18n.t( Keys.next_step )}
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

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status }
}

export default connect( select )( RegisterPage2 );
