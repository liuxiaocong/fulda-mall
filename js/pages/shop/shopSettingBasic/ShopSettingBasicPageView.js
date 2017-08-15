import React from "react";
import { StyleSheet, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";

const styles = StyleSheet.create( {} );
class ShopSettingBasicPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.base_setting ),
        };
    };

    constructor( props ) {
        super( props );
        let isClose = false;
        if ( props.shopInfo.status = 2 ) {
            isClose = true;
        }
        this.state = {
            shopClose: isClose
        };
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        let isClose = false;
        if ( nextProps.shopInfo.status = 2 ) {
            isClose = true;
        }
        nextState.shopClose = isClose;
        return true;
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
                        marginTop: 15
                    } ]}
                    title={I18n.t( Keys.confirm_close )}
                    onPress={() => {
                        this.props.onTapWhetherClose()
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

                {/*<TouchableItemComponent*/}
                {/*containerStyle={[ {} ]}*/}
                {/*title="底部代码"*/}
                {/*onPress={() => {*/}
                {/*this.props.onTapBottomCode()*/}
                {/*}}*/}
                {/*headerInterval={false}*/}
                {/*footerInterval={true}/>*/}
            </View>
        )
    }
}

export default ShopSettingBasicPageView;
