import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
import UtilConfig from "../../../../configs/UtilConfig";
import PlaceInputComponent from "../../../../components/PlaceInputComponent";
const styles = StyleSheet.create( {} );

class ShopSetAddressPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.address ),
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
        this.state = {
            text: props.address,
            autoCompletePredictions: null,
            isRequesting: false,
            error: ''
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._placeInputComponent.blur();

        if ( !this.state.text || this.state.text.length <= 0 ) {
            this.setState( { error: I18n.t( Keys.plz_input_shop_address ) } );
            return;
        }

        this.setState( { isRequesting: true, error: '' } );
        this.props.onTapSave(
            this.state.text, ( err, resBody ) => {
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

                <PlaceInputComponent
                    ref={( placeInputComponent ) => {
                        this._placeInputComponent = placeInputComponent;
                    }}
                    text={this.state.text}
                    placeholder={I18n.t( Keys.plz_input_shop_address )}
                    maxLength={UtilConfig.MAX_LENGTH.SHOP_ADDRESS}
                    onChangeText={( text, autoCompletePredictions ) => {
                        this.setState( {
                            error: '',
                            text: text,
                            autoCompletePredictions: autoCompletePredictions,
                        } );
                    }}
                    onSubmitEditing={() => {
                        this.onTapSave();
                    }}
                />
                <Text
                    style={[
                        commonStyles.errorTipStyle
                    ]}>
                    {this.state.error}
                </Text>


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

export default ShopSetAddressPageView;
