import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import PhoneTokenVerifyComponent from "../../../components/PhoneTokenVerifyComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
const styles = StyleSheet.create( {} );

class BindMobilePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.verify_phone ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false
        };
    }

    componentWillMount() {
        // this.props.navigation.state.key = "bindMobilePage";
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    bindMobile( cca2, mobile, callback ) {
        this.setState( {
            isRequesting: true,
            error: ''
        } );
        this.props.bindMobile( cca2, mobile, ( err, resBody ) => {
            this.setState( { isRequesting: true } );
            if ( err ) {
                this.setState( { error: err.message } );
                callback( false );
            } else {
                callback( true );
            }
        } );

    }

    verifyToken( callingCode, mobile, token ) {
        this.setState( {
            isRequesting: true,
            error: ''
        } );
        this.props.verifyToken( token, ( err, resBody ) => {
            this.setState( { isRequesting: false } );
            if ( err ) {
                this.setState( { error: err.message } );
            } else {
                this.props.navigation.navigate( 'bindMobileSuccessPage' );
            }
        } );
    }

    tryVerifyToken() {
        this._phoneTokenVerifyComponent
            .tryVerifyToken();
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
                        this.bindMobile( cca2, mobile, callback );
                    }}
                    onVerifyToken={( country, cca2, callingCode, mobile, token ) => {
                        this.verifyToken( callingCode, mobile, token );
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
                            marginLeft: 10
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        this.tryVerifyToken()
                        // this.props.navigation.navigate( 'bindMobileSuccessPage' );
                    }}
                    title="">
                    {I18n.t( Keys.submit )}
                </Button>
                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isLoading}
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

export default BindMobilePageView;
