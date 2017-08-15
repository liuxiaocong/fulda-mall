import React from "react";
import { StyleSheet, View, WebView } from "react-native";
import Toast from "react-native-root-toast";
import { NavigationActions } from "react-navigation";
import { paymentAccountBalance } from "../../../actions/PaymentAction";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class TopUpByUnionPayPage extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.union_pay ),
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            content: this.props.navigation.state.params.content,
            canGoBack: false,
            navigationUrl: ''
        };
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        if ( nextState ) {

        }
        return true;
    }

    componentWillMount() {
        this.props.navigation.setParams( { onBack: this._onBack.bind( this ) } );
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapTopUpSuccess: this.onTapTopUpSuccess.bind( this ) } );
    }


    onTapTopUpSuccess() {
        if ( this.state.callback instanceof Function ) {
            this.state.callback( true );
        }

        Toast.show( I18n.t( Keys.top_up_success ) );

        this.props.navigation.dispatch( NavigationActions.back( { key: 'topUpPage' } ) );

        this.props.dispatch( paymentAccountBalance( ( error, resBody ) => {
            if ( error ) {
                console.log( error.message );
            }
        } ) );

    };

    _onBack() {
        if ( this.state.canGoBack ) {
            this._webView.goBack();

            return true;
        }
        return false;
    }

    onShouldStartLoadWithRequest( navState ) {
        this.setState( {
            canGoBack: navState.canGoBack,
            navigationUrl: navState.url
        } );

        console.log(
            'onNavigationStateChange navState.canGoBack = ' + navState.canGoBack +
            '; navState.canGoForward = ' + navState.canGoForward +
            '; navState.url = ' + navState.url +
            '; navState.title = ' + navState.title +
            '; navState.loading = ' + navState.loading );

        if ( navState.url.indexOf( 'sinopay/success' ) > 0 ) {
            this.onTapTopUpSuccess();
            return false;
        } else if ( navState.url.indexOf( 'sinopay/failed' ) > 0 ) {
            if ( this.state.callback instanceof Function ) {
                this.state.callback( false );
            }
            this.props.navigation.goBack();
            return false;
        } else if ( navState.url.indexOf( 'sinopay/cancelled' ) > 0 ) {
            this.props.navigation.goBack();
            return false;
        }

        return true;
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <WebView
                    ref={( webView ) => {
                        this._webView = webView;
                    }}
                    style={{}}
                    source={{ html: this.state.content + "" }}
                    onError={( error ) => {
                        console.log( 'onError error.message = ' + error.message );
                    }}
                    onLoad={( paras ) => {
                        console.log( 'onLoad' );
                    }}
                    onLoadEnd={( paras ) => {
                        console.log( 'onLoadEnd' );
                    }}
                    onLoadStart={( paras ) => {
                        console.log( 'onLoadStart' );
                    }}
                    // onMessage={( e ) => {
                    //     console.log( 'onMessage e.nativeEvent.data = ' + e.nativeEvent.data );
                    // }}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest.bind( this )} //for iOS
                    onNavigationStateChange={this.onShouldStartLoadWithRequest.bind( this )} //for Android
                />
            </View>
        );
    }


}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( TopUpByUnionPayPage );
