import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
const styles = StyleSheet.create( {} );
class setGenderPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.sex ),
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
            )
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            gender: props.gender,
            isRequesting: false
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave = () => {
        if ( !this.state.gender ) {
            Toast.show( I18n.t( Keys.plz_select_gender ) );
            return;
        }

        this.setState( { isRequesting: true } );
        this.props.onTapSave(
            this.state.gender, ( err, resBody ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    Toast.show( I18n.t( Keys.update_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.update_success ) );
                    this.props.onSaveSuccess();
                }
            }
        )
    };

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
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
                            gender: 1
                        } )
                    }}>
                    <View
                        style={[
                            commonStyles.justAlignCenter,
                            {
                                flexDirection: 'row'
                            }
                        ]}>
                        <Text style={[
                            commonStyles.commonTextColorStyle,
                            {
                                flexGrow: 1,
                                fontSize: 14
                            }
                        ]}>{I18n.t( Keys.male )}</Text>{
                        this.state.gender === 1 && (
                            <Image
                                style={{
                                    width: 14,
                                    height: 10
                                }}
                                source={require( '../../../imgs/ic_confirm.png' )}
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
                            gender: 2
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
                        ]}>{I18n.t( Keys.female )}</Text>
                        {
                            this.state.gender === 2 && (
                                <Image
                                    style={{
                                        width: 14,
                                        height: 10
                                    }}
                                    source={require( '../../../imgs/ic_confirm.png' )}
                                />
                            )
                        }
                    </View>
                </TouchableHighlight>
                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
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

export default setGenderPage;
