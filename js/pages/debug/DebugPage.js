import React from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";


class DebugPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: 'Debug',
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapShare()
                    }}
                >
                    Share
                </Button>
            )
        };
    };


    constructor( props ) {
        super( props );
        this.state = {};
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapShare: this.onTapShare.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapShare() {
        //noinspection JSCheckFunctionSignatures
        Share.share(
            {
                message: this.genContent(),
                title: '调试信息'
            },
            {
                dialogTitle: '富达商城',
                excludedActivityTypes: [],
                tintColor: constStyles.THEME_COLOR
            }
        )
            .then( ( result ) => {
                if ( result.action === Share.sharedAction ) {
                    if ( result.activityType ) {
                        console.log( 'shared with an activityType: ' + result.activityType );
                    } else {
                        console.log( 'Shared success!' );
                    }
                } else if ( result.action === Share.dismissedAction ) {
                    console.log( 'dismissed' );
                }
            } )
            .catch( ( error ) => {
                Toast.show( error.message );
            } );
    }

    genContent() {
        let { userStore, settingStore } = this.props;

        let content = '';

        content += 'isLoggedIn = ' + userStore.isLoggedIn + '\n\n';
        content += 'facebookToken = ' + userStore.facebookToken + '\n\n';
        content += 'account = ' + JSON.stringify( userStore.account ) + '\n\n';
        content += 'user = ' + JSON.stringify( userStore.user ) + '\n\n';
        content += 'pushToken = ' + userStore.pushToken + '\n\n';
        content += 'requestCookie = ' + userStore.requestCookie + '\n\n';

        content += 'displayCurrency = ' + JSON.stringify( settingStore.displayCurrency ) + '\n\n';
        content += 'language = ' + settingStore.language + '\n';
        content += 'deviceCountry = ' + JSON.stringify( settingStore.deviceCountry ) + '\n\n';
        content += 'searchCountry = ' + JSON.stringify( settingStore.searchCountry ) + '\n\n';

        return content;
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <ScrollView>
                    <View style={[ commonStyles.paddingCommon ]}>
                        <Text>
                            {this.genContent()}
                        </Text>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        userStore: store.userStore,
        settingStore: store.settingStore,
    }
}

export default  connect( select )( DebugPage );
