import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import constStyles from "../../../styles/constStyles";
import TopUpCardListComponent from "./TopUpCardListComponent";
import TopUpCardUseComponent from "./TopUpCardUseComponent";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { paymentSystemCouponApply } from "../../../actions/PaymentAction";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class TopUpCardPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.top_up_card_list ),
        };
    };


    constructor( props ) {
        super( props );
        this.state = {
            currentItem: null,
            isOpen: false,
            errorStr: '',
            isRequesting: false,
        };
    }

    onApply( account, payPassword ) {
        this.setState( {
            isRequesting: true
        } );

        paymentSystemCouponApply( this.state.currentItem.id, account, payPassword, ( err, res ) => {
            this.setState( {
                errorStr: err !== null ? err.message : '',
                isRequesting: false
            } );

            if ( err === null ) {
                this.setState( {
                    isOpen: false
                } );
            }
        } );
    }


    render() {
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                <StatusBar
                    animated={true}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                <TopUpCardListComponent onSelect={( item ) => {
                    this.setState( {
                        currentItem: item,
                        isOpen: true,
                    } );
                }}/>

                <TopUpCardUseComponent
                    isOpen={this.state.isOpen}
                    errorStr={this.state.errorStr}
                    onClose={() => {
                        this.setState( {
                            isOpen: false,
                        } );
                    }}
                    onApply={this.onApply.bind( this )}
                    navigation={this.props.navigation}
                />


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

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( TopUpCardPage );
