import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
const styles = StyleSheet.create( {} );
class ShopBottomCodePageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.bottom_code ),
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
            ),
        };
    };

    constructor( props ) {
        super( props );
        // let isClose = props.shopInfo.status === 2;

        this.state = {
            code: ""
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this.props.onTapSave();
    };

    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <TextInput
                    style={{
                        height: 95,
                        borderColor: '#e7e7e7',
                        borderWidth: 1,
                        backgroundColor: '#f1f6f8',
                        margin: 15,
                        fontSize: 12,
                        color: '#b4b8c0',
                        padding: 15
                    }}
                    multiline={true}
                    placeholder={I18n.t( Keys.bottom_code )}
                    underlineColorAndroid={'transparent'}
                    onChangeText={( text ) => this.setState( { code: text } )}
                    value={this.state.code}/>
            </View>
        )
    }
}

export default ShopBottomCodePageView;
