import React from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "react-native-button";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import { memberGetById } from "../../actions/MemberAction";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import constStyles from "../../styles/constStyles";


class UserProfilePage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.name_card ),
            headerRight: (
                state.params.shopExists ?
                    <Button
                        style={commonStyles.top_info_right_btn}
                        title=''
                        onPress={() => {
                            state.params.onTapShop()
                        }}
                    >
                        {I18n.t( Keys.shop )}
                    </Button>
                    :
                    null
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            user: props.navigation.state.params.data,
            userId: props.navigation.state.params.dataId,
            isProgress: false,
        };
    }

    componentWillMount() {
        this.setState(
            {
                isProgress: true,
            }
        );
        memberGetById(
            this.state.userId, ( err, res ) => {

                if ( err ) {
                    Toast.show( err.message );
                }

                this.setState(
                    {
                        user: err === null ? res.data : null,
                        isProgress: false,
                    }
                );

                this.props.navigation.setParams(
                    {
                        data: this.state.user,
                        dataId: this.state.userId,
                        shopExists: this.state.user ? this.state.user.shopExists : false
                    }
                );
            }
        );
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapShop: this.onTapShop.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapShop() {
        this.props.navigation.navigate(
            'shopDetailPage', {
                dataId: this.state.user.id,
            }
        );
    }

    render() {
        return (
            <View style={[
                commonStyles.wrapper,
                commonStyles.commonBG,
                commonStyles.commonBorderTop,
                {
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingRight: 10
                }
            ]}
            >
                <View
                    style={[
                        {
                            backgroundColor: '#f5f7fa',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingBottom: 10,
                            paddingTop: 50,
                            marginTop: 40,
                            alignItems: 'center'
                        }
                    ]}
                >
                    <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 16, textAlign: 'center' } ]}>
                        {this.state.user ? this.state.user.name : ''}
                    </Text>

                    {
                        this.state.user && this.state.user.shopExists ?
                            <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                                {I18n.t( Keys.normal_shop )}
                            </Text>
                            :
                            null
                    }
                </View>

                <View
                    style={[ {
                        height: 80,
                        position: 'absolute',
                        top: 20,
                        left: 0,
                        right: 0,
                    }, commonStyles.justAlignCenter
                    ]}>
                    <Image
                        style={[ {
                            width: 80,
                            height: 80,
                        }
                        ]}
                        source={
                            this.state.user && this.state.user.logo ?
                                {
                                    uri: this.state.user.logo
                                }
                                : null
                        }
                    />
                </View>


                <View
                    style={[
                        {
                            backgroundColor: 'white',
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            paddingTop: 14,
                            paddingBottom: 20,
                        },
                        commonStyles.justAlignCenter
                    ]}
                >

                    {
                        this.state.user && this.state.user.email && this.state.user.email.length > 0 ?
                            <Text style={[ { fontSize: 13, color: '#717789' } ]}>
                                {I18n.t( Keys.email ) + ":"}
                                <Text>
                                    {this.state.user ? this.state.user.email : ''}
                                </Text>
                            </Text>
                            :
                            null
                    }

                    {
                        this.state.user && this.state.user.mobile && this.state.user.mobile.length > 0 ?
                            <Text style={[ { fontSize: 13, color: '#717789' } ]}>
                                {I18n.t( Keys.phone ) + ":"}
                                <Text>
                                    {this.state.user ? this.state.user.mobile : ''}
                                </Text>
                            </Text>
                            :
                            null
                    }

                    {
                        this.state.user && this.state.user.address && this.state.user.address.length > 0 ?
                            <Text style={[ { fontSize: 13, color: '#717789' } ]}>
                                {I18n.t( Keys.address ) + ":"}
                                <Text>
                                    {this.state.user ? this.state.user.address : ''}
                                </Text>
                            </Text>
                            :
                            null
                    }
                </View>

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}
                    isOpen={this.state.isProgress}
                >
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        );
    }
}

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}

export default connect( select )( UserProfilePage );
