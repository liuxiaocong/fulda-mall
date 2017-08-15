import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import PlaceInputComponent from "../../../components/PlaceInputComponent";
import * as UtilConfig from "../../../configs/UtilConfig";


class ShopNameInputPage extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_name ),
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
        let navState = this.props.navigation.state;

        this.state = {
            callback: navState.params.callback,
            text: navState.params.defaultVal,
            autoCompletePredictions: null,
            isRequesting: false,
        };
    }


    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }


    onTapSave() {
        this._placeInputComponent.blur();

        if ( this.state.autoCompletePredictions !== null ) {
            this.setState( {
                isRequesting: true
            } );

            this._placeInputComponent.lookUpPlace( this.state.autoCompletePredictions, ( results ) => {
                this.setState( {
                    isRequesting: false
                } );

                this.tryCallback( results );
            } );
        } else {
            this.tryCallback( null );
        }
    }

    tryCallback( place ) {
        if ( this.state.callback instanceof Function ) {
            this.state.callback( this.state.text, place );
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>

                <PlaceInputComponent
                    ref={( placeInputComponent ) => {
                        this._placeInputComponent = placeInputComponent;
                    }}
                    text={this.state.text}
                    placeholder={I18n.t( Keys.plz_set_shop_name )}
                    maxLength={UtilConfig.MAX_LENGTH.SHOP_NAME}
                    onChangeText={( text, autoCompletePredictions ) => {
                        this.setState( {
                            text: text,
                            autoCompletePredictions: autoCompletePredictions,
                        } );
                    }}
                    onSubmitEditing={() => {
                        this.onTapSave();
                    }}
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
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( ShopNameInputPage );
