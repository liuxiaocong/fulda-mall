import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import commonStyles from "../../../../styles/commonStyles";
import TouchableItemComponent from "../../../../components/TouchableItemComponent";
import Keys from "../../../../configs/Keys";
import I18n from "../../../../I18n";
import constStyles from "../../../../styles/constStyles";
import ImageWithPlaceHolder from "../../../../components/ImageWithPlaceHolder";


const styles = StyleSheet.create(
    {}
);
class MainMePageView extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            id: 1,
        };
    }

    componentDidMount() {
        //this.props.onTapOrder();
    }

    componentWillUnmount() {
    }

    getTypeAction() {
        if ( this.props.type > 0 ) {
            return (
                <View>
                    <TouchableItemComponent
                        containerStyle={{ marginTop: 10 } }
                        title={I18n.t( Keys.top_up_card_list )}
                        onPress={() => {
                            this.props.onTapTopUpList()
                        }}
                        headerInterval={true}
                        footerInterval={true}/>
                    <TouchableItemComponent
                        title={I18n.t( Keys.shop_info )}
                        onPress={() => {
                            this.props.onTapSellerInfo()
                        }}
                        headerInterval={false}
                        footerInterval={true}/>
                </View>

            )
        } else {
            return (
                <TouchableItemComponent
                    containerStyle={{ marginTop: 10 } }
                    title={I18n.t( Keys.become_seller )}
                    onPress={() => {
                        this.props.onTapBecomeSeller()
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
            )
        }
    }


    render() {

        let { isLoggedIn, user } = this.props;
        if ( !isLoggedIn || user === null || user === null ) {
            return (
                <View/>
            );
        }

        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, {
                backgroundColor: constStyles.STATUS_BAR_COLOR,
                paddingTop: constStyles.STATE_BAR_HEIGHT
            }, ]}>
                <ScrollView style={[ commonStyles.wrapper, commonStyles.commonBG, ]}>
                    <View
                        style={[ { paddingBottom: 20 } ]}
                    >
                        <View style={[ { height: 10, backgroundColor: 'white' } ]}/>

                        <TouchableItemComponent
                            onPress={() => {
                                this.props.onTapAvatar()
                            }}
                            headerInterval={false}
                            footerInterval={true}
                        >
                            <View style={[ {
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: -10
                            } ]}>

                                <ImageWithPlaceHolder
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                    } }
                                    placeholderForSource={require( '../../../../imgs/bg_avatar.png' )}
                                    source={user.logo ? { uri: user.logo } : null}
                                />
                                <View style={[ {
                                    flex: 1,
                                    marginLeft: 10
                                } ]}>
                                    <Text
                                        style={[ commonStyles.commonTextColorStyle, {
                                            fontWeight: 'bold',
                                            fontSize: 16
                                        } ]}>
                                        {user.name}
                                    </Text>
                                    {this.props.type > 0 &&
                                    <Text
                                        style={[ {
                                            fontSize: 12,
                                            color: '#717789',
                                            marginTop: 5
                                        } ]}
                                    >{this.props.identity}</Text>
                                    }
                                </View>


                            </View>
                        </TouchableItemComponent>

                        <TouchableItemComponent
                            containerStyle={{ marginTop: 10 } }
                            style={[ {} ]}
                            title={I18n.t( Keys.my_wallet )}
                            onPress={() => {
                                this.props.onTapWallet()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            style={[ {} ]}
                            title={I18n.t( Keys.my_favorites )}
                            onPress={() => {
                                this.props.onTapFav()
                            }}
                            headerInterval={false}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            style={[ {} ]}
                            title={I18n.t( Keys.my_orders )}
                            onPress={() => {
                                this.props.onTapOrder()
                            }}
                            headerInterval={false}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            style={[ {} ]}
                            title={I18n.t( Keys.deliver_address )}
                            onPress={() => {
                                this.props.onTapDeliverAddress()
                            }}
                            headerInterval={false}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            containerStyle={{ marginTop: 10 } }
                            title={I18n.t( Keys.recommend_list )}
                            onPress={() => {
                                this.props.onTapRecommend()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            title={I18n.t( Keys.my_invite )}
                            onPress={() => {
                                this.props.onTapInvite( this.props.user )
                            }}
                            headerInterval={false}
                            footerInterval={true}/>

                        <TouchableItemComponent
                            containerStyle={{ marginTop: 10 } }
                            title={I18n.t( Keys.my_tools )}
                            onPress={() => {
                                this.props.onTapTools()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>

                        {this.getTypeAction()}

                        <TouchableItemComponent
                            containerStyle={{ marginTop: 10 } }
                            title={I18n.t( Keys.setting )}
                            onPress={() => {
                                this.props.onTapSetting()
                            }}
                            headerInterval={true}
                            footerInterval={true}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default MainMePageView;
