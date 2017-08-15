import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import Util from "../../../util/Util";
import CreditCardUtil from "../../../util/CreditCardUtil";
import { paymentCreditCardList } from "../../../actions/PaymentAction";


class MyCreditCardPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.fulda_pay ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            data: props.payCreditCardData ? props.payCreditCardData : []
        };
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            data: nextProps.payCreditCardData ? nextProps.payCreditCardData : {}
        } );
    }

    componentWillMount() {
        this.props.dispatch(
            paymentCreditCardList( ( err, resBody ) => {
                if ( err ) {
                    Toast.show( err.message );
                }
            } )
        );
    }

    renderItem( { item, index } ) {
        return (
            <TouchableItemComponent
                containerStyle={[ { height: 46 } ]}
                title={null}
                content={null}
                onPress={() => {
                    this.props.navigation.navigate( 'myCreditCardShowPage', { data: item } )
                }}
                headerInterval={false}
                footerInterval={false}
                leftElement={
                    <View style={[ {
                        flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'center'
                    } ]}>
                        <Image
                            style={{
                                width: 30,
                                height: 30
                            }}
                            source={CreditCardUtil.calcCreditCardIcon( item.type )}/>
                        <View style={[ { marginLeft: 10 } ]}>
                            <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                                {item.last4Digits}
                            </Text>
                            {
                                item.default ?
                                    <Text style={[ { fontSize: 10, color: '#717789' } ]}>
                                        {
                                            I18n.t( Keys.primary )
                                        }
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                    </View>
                }
            />
        );
    }

    renderFooterComponent() {
        return (
            <View>
                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 38,
                            marginLeft: 38,
                            marginTop: 20
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        this.props.navigation.navigate( 'myCreditCardAddPage' )
                    }} title="">
                    {
                        I18n.t( Keys.add_payment_methods )
                    }
                </Button>
            </View>
        );
    }

    render() {
        const separatorHeight = Util.getDpFromPx( 1 );
        const viewHeight = 48;

        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop
                ]}>

                <FlatList
                    keyboardShouldPersistTaps="always"
                    data={this.state.data}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => {
                        return this.renderItem( { item, index } );
                    }}
                    ListHeaderComponent={() => {
                        return (
                            <View style={[ { height: 20 } ]}/>
                        );
                    }}
                    ListFooterComponent={() => {
                        return this.renderFooterComponent();
                    } }
                    ItemSeparatorComponent={() => {
                        return <View style={[ commonStyles.commonIntervalStyle ]}/>
                    }}
                    getItemLayout={( data, index ) => (
                        { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        payCreditCardData: store.walletStore.payCreditCardData,
    }
}

export default connect( select )( MyCreditCardPage );
