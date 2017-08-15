import React from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Keys from "../../../configs/Keys";
import I18n from "../../../I18n";
const styles = StyleSheet.create( {} );
class ShopClosePageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.close_reason ),
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
            ),
        };
    };

    constructor( props ) {
        super( props );
        let isClose = false;
        let closeReason = "";
        if ( props.shopInfo ) {
            isClose = props.shopInfo.close;
            closeReason = props.shopInfo.closeReason;
        }
        this.state = {
            shopClose: isClose,
            id: props.shopInfo.id,
            isRequesting: false,
            reason: closeReason
        };
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        return true;
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        if ( this._closeReasonTextInput ) {
            this._closeReasonTextInput.blur();
        }

        if ( this.state.shopClose && (!this.state.reason || this.state.reason.length <= 0) ) {
            Toast.show( I18n.t( Keys.plz_input_close_reason ) );
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.id, this.state.shopClose, this.state.reason, ( err, reason ) => {
                this.setState( { isRequesting: false } );
                if ( !err ) {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                } else {
                    Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message );
                }
            }
        );
    };

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <View
                    style={[ commonStyles.commonBorderTop, commonStyles.commonBorderBottom, {
                        flexDirection: 'row',
                        height: 60,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        marginTop: 10,
                        paddingLeft: 15,
                        paddingRight: 15
                    } ]}
                >
                    <Text style={[ commonStyles.text_h5, {
                        flexGrow: 1
                    } ]}>{I18n.t( Keys.confirm_close )}</Text>
                    <Switch
                        onValueChange={( value ) => {
                            this.setState( { shopClose: value } );
                        }}
                        value={this.state.shopClose}/>
                </View>
                {this.state.shopClose &&


                <TextInput
                    ref={( closeReasonTextInput ) => {
                        this._closeReasonTextInput = closeReasonTextInput;
                    }}
                    style={[ commonStyles.commonInput, commonStyles.mgr_normal, commonStyles.mgl_normal, commonStyles.commonTextInputStyle, {
                        marginTop: 20,
                        height: 150,
                        paddingTop: 10,
                        paddingBottom: 10,
                        fontSize: 14
                    } ]}
                    placeholderTextColor={"#ccb4b8c0"}
                    underlineColorAndroid={'transparent'}
                    autoFocus={true}
                    placeholder={I18n.t( Keys.close_reason )}
                    multiline={true}
                    onChangeText={
                        ( text ) => {
                            this.setState( { reason: text } )
                        }
                    }
                    defaultValue={this.state.reason}
                />
                }


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

export default ShopClosePageView;
