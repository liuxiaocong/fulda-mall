/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import TouchableItemComponent from "../../../../components/TouchableItemComponent";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
const styles = StyleSheet.create( {} );
class BindWeChatPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.bind_wechat ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    {I18n.t( Keys.apply_access )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            appId: "",
            appSecret: ""
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
                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 20
                    } ]}
                    title="APP ID"
                    content={this.state.appId}
                    onPress={() => {
                        this.props.onTapAppId( "APP ID", "", I18n.t( Keys.plz_input_wechat_appid ),
                            ( value ) => {
                                this.setState( {
                                    appId: value
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    } ]}
                    title="APP SECRET"
                    content={this.state.appSecret}
                    onPress={() => {
                        this.props.onTapAppId( "APP SECRET", "", I18n.t( Keys.plz_input_wehcat_appsecret ),
                            ( value ) => {
                                this.setState( {
                                    appSecret: value
                                } )
                            } );
                    }}
                    headerInterval={true}
                    footerInterval={false}/>

            </View>
        )
    }
}

export default BindWeChatPageView;
