import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import Keys from "../../../configs/Keys";
import I18n from "../../../I18n";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import * as UtilConfig from "../../../configs/UtilConfig";
const styles = StyleSheet.create( {} );

class setPostcodePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.postcode ),
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
            postalCode: props.user.postalCode ? props.user.postalCode : '',
            isRequesting: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._postcodeTextInput.blur();

        if ( !this.state.postalCode || this.state.postalCode.length <= 0 ) {
            Toast.show( I18n.t( Keys.plz_input_postcode ) );
            return;
        }

        this.setState( {
            isRequesting: true,
        } );

        this.props.onTapSave( this.state.postalCode, ( err, resBody ) => {
            this.setState( {
                isRequesting: false,
            } );

            if ( err ) {
                Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message )
            } else {
                Toast.show( I18n.t( Keys.update_success ) );
                this.props.onSaveSuccess();
            }
        } )
    };

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>
                <TextInput
                    ref={( postcodeTextInput ) => {
                        this._postcodeTextInput = postcodeTextInput;
                    }}
                    style={[ commonStyles.commonInput, ]}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    placeholder={I18n.t( Keys.plz_input_postcode )}
                    defaultValue={this.state.postalCode}
                    keyboardType={"numeric"}
                    maxLength={UtilConfig.MAX_LENGTH.USER_POSTALCODE}
                    onChangeText={
                        ( text ) => {
                            this.setState( {
                                postalCode: text
                            } );
                        }
                    }
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

export default setPostcodePageView;
