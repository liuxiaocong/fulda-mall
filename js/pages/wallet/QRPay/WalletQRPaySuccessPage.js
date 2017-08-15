import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import format from "string-format";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import Util from "../../../util/Util";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class WalletQRPaySuccessPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.qr_pay ),
            headerLeft: (
                null
            )
        };
    };

    constructor( props ) {
        super( props );

        this.state = {
            user: props.navigation.state.params.data,
            amount: props.navigation.state.params.amount,
            useFromMemberCurrency: props.navigation.state.params.useFromMemberCurrency,
            userMe: this.props.user,
        };
    }

    componentWillMount() {

    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.paddingCommon
                ]}>

                <View style={[ commonStyles.justAlignCenter ]}>
                    <Image
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        source={require( '../../../imgs/ic_done.png' )}/>

                    <Text style={[ { marginTop: 40, fontSize: 16 }, commonStyles.commonTextColorStyle ]}>
                        {I18n.t( Keys.qr_pay_success )}
                    </Text>

                    <Text style={[ { fontSize: 14, color: '#717789', marginTop: 30, } ]}>
                        {
                            format(
                                I18n.t( Keys.you_have_qr_pay_to_some_one ),
                                this.state.user.name,
                                Util.getShowPrice( this.state.useFromMemberCurrency ? this.state.userMe.currency : this.state.user.currency, this.state.amount )
                            )
                        }
                    </Text>
                </View>

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 58
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                    title="">
                    {I18n.t( Keys.back_to_main_page )}
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        user: store.userStore.user
    }
}

export default connect( select )( WalletQRPaySuccessPage );
