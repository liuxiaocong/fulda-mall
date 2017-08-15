import React from "react";
import { View } from "react-native";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { authFacebook } from "../../../actions/AuthAction";
import { isNeedAdditionalInformation } from "../../../actions/MemberAction";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class BindSelectPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.plz_select_account ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false
        };
    }

    handleCreateNewAccount() {
        this.setState( {
            isRequesting: true
        } );

        this
            .props
            .dispatch( authFacebook( this.props.facebookToken, true, ( err, resBody ) => {
                this.setState( {
                    isRequesting: false
                } );
                if ( err === null ) {
                    if ( isNeedAdditionalInformation( this.props.user ) ) {
                        this.props.navigation.navigate( 'registerPage' );
                    }
                } else {
                    Toast.show( err.message );
                }
            } ) );
    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper,
                    commonStyles.commonBG,
                    commonStyles.commonBorderTop,
                    {
                        paddingTop: 20
                    }
                ]}>
                <TouchableItemComponent
                    style={[ {} ]}
                    title={I18n.t( Keys.create_account )}
                    onPress={this
                        .handleCreateNewAccount
                        .bind( this )}
                    headerInterval={true}
                    footerInterval={true}/>

                <TouchableItemComponent
                    containerStyle={[ {
                        marginTop: 10
                    }
                    ]}
                    style={[ {} ]}
                    title={I18n.t( Keys.bind_exist_account )}
                    onPress={() => {
                        this.props.navigation.navigate( 'bindOldAccountPage' );
                    }}
                    headerInterval={true}
                    footerInterval={true}/>

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
        );
    }
}

function select( store ) {
    return { facebookToken: store.userStore.facebookToken }
}

export default connect( select )( BindSelectPage );
