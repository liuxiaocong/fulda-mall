import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import * as UtilConfig from "../../../configs/UtilConfig";
const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: 'white',
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: 'center'
        },
    }
);
class SetNamePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.name ),
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
            name: this.props.user.name ? this.props.user.name : ''
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._nameTextInput.blur();

        if ( !this.state.name || this.state.name.length <= 0 ) {
            Toast.show( I18n.t( Keys.plz_input_name ) );
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.name, ( err, resBody ) => {
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
                    ref={( nameTextInput ) => {
                        this._nameTextInput = nameTextInput;
                    }}
                    style={[ commonStyles.commonInput ]}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    placeholder={I18n.t( Keys.plz_input_name )}
                    maxLength={UtilConfig.MAX_LENGTH.USER_NAME}
                    onChangeText={
                        ( text ) => {
                            this.setState( {
                                name: text
                            } );
                        }
                    }
                    defaultValue={this.state.name}
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

export default SetNamePageView;
