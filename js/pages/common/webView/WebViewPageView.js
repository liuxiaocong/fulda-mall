import React from "react";
import { StyleSheet, View, WebView } from "react-native";
import commonStyles from "../../../styles/commonStyles";

const styles = StyleSheet.create( {} );
class WebViewPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params.webTitle,
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            url: props.navigation.state.params.url
        };
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        console.log( 'componentDidMount url = ' + this.state.url );
    }

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <WebView
                    source={{ uri: this.state.url + "" }}
                />
            </View>
        )
    }
}

export default WebViewPageView;
