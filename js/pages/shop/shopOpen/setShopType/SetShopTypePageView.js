import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";
const styles = StyleSheet.create( {} );
class SetShopTypePageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.shop_type ),
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
            ),
        };
    };


    constructor( props ) {
        super( props );
        let navState = this.props.navigation.state;

        this.state = {
            type: props.type,
            callback: navState.params.callback,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave = () => {
        if ( this.state.callback instanceof Function ) {
            this.state.callback( this.state.type );
            this.props.navigation.goBack();
        } else {
            this.props.onTapSave(
                this.state.type, ( err, resBody ) => {
                }
            )
        }
    };

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <TouchableHighlight
                    underlayColor={constStyles.DIVIDER_COLOR}
                    style={
                        [
                            commonStyles.commonBorderTop,
                            commonStyles.commonBorderBottom, {
                            marginTop: 10,
                            height: 48,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingLeft: 16,
                            paddingRight: 16,
                        } ]
                    }
                    onPress={() => {
                        this.setState( {
                            type: 1
                        } )
                    }}>
                    <View
                        style={[
                            {
                                flexDirection: 'row'
                            },
                            commonStyles.justAlignCenter
                        ]}>
                        <Text style={[
                            commonStyles.commonTextColorStyle,
                            {
                                flexGrow: 1,
                                fontSize: 14
                            }
                        ]}>{I18n.t( Keys.online )}</Text>{
                        this.state.type === 1 && (
                            <Image
                                style={{
                                    width: 14,
                                    height: 10
                                }}
                                source={require( '../../../../imgs/ic_confirm.png' )}
                            />
                        )
                    }
                    </View>
                </TouchableHighlight>

                <TouchableHighlight
                    underlayColor={constStyles.DIVIDER_COLOR}
                    style={[
                        commonStyles.commonBorderBottom, {
                            height: 48,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingLeft: 16,
                            paddingRight: 16
                        } ]
                    }
                    onPress={() => {
                        this.setState( {
                            type: 2
                        } )
                    }}>
                    <View
                        style={[
                            {
                                flexDirection: 'row'
                            },
                            commonStyles.justAlignCenter
                        ]}>
                        <Text style={[
                            commonStyles.commonTextColorStyle,
                            {
                                flexGrow: 1,
                                fontSize: 14
                            }
                        ]}>{I18n.t( Keys.entity )}</Text>
                        {
                            this.state.type === 2 && (
                                <Image
                                    style={{
                                        width: 14,
                                        height: 10
                                    }}
                                    source={require( '../../../../imgs/ic_confirm.png' )}
                                />
                            )
                        }
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

export default SetShopTypePageView;
