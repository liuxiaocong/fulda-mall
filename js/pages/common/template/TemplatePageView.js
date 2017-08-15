/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";

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
class TemplatePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: 'title',
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    保存
                </Button>
            )
        };
    };

    // Mounting
    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            user_name: props.user_name
        };
    }

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                <Text>123</Text>
            </View>
        )
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {

    }

    shouldComponentUpdate( nextProps, nextState ) {

    }

    componentWillUpdate( nextProps, nextState ) {

    }

    componentDidUpdate( prevProps, prevState ) {

    }

    //End Updating

    //Un Mounting
    componentWillUnmount() {

    }

    //End Un Mounting

    onTapSave() {

    };
}
export default TemplatePageView;
