import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import * as UtilConfig from "../../../configs/UtilConfig";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 0,
        paddingRight: 0,
        alignItems: 'center'
    },
} );

class setIdCardPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.id_number ),
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
        let idNo = this.props.user.idNo + "";
        this.state = {
            idNo: idNo,
            isRequesting: false,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._idNumberTextInput.blur();

        if ( !this.state.idNo || this.state.idNo.length <= 0 ) {
            Toast.show( I18n.t( Keys.plz_input_id_number ) );
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave( this.state.idNo, ( err, resBody ) => {
            this.setState( { isRequesting: false } );
            if ( err ) {
                Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message )
            } else {
                Toast.show( I18n.t( Keys.update_success ) );
                this.props.onSaveSuccess();
            }
        } );
    };

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>
                <TextInput
                    ref={( idNumberTextInput ) => {
                        this._idNumberTextInput = idNumberTextInput;
                    }}
                    style={[ commonStyles.commonInput, {} ]}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    placeholder={I18n.t( Keys.plz_input_id_number )}
                    defaultValue={this.state.idNo}
                    maxLength={UtilConfig.MAX_LENGTH.USER_ID_NO}
                    onChangeText={
                        ( text ) => {
                            this.setState( { idNo: text } )
                        }
                    }
                    value={this.state.idNo}
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

export default setIdCardPageView;
