/**
 * Created by xiaoconglau on 30/03/2017.
 */
import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import Keys from "../../../../configs/Keys";
import I18n from "../../../../I18n";
import format from "string-format";
const styles = StyleSheet.create(
    {
        item_style: {
            height: 30,
            flexDirection: 'row',
            marginLeft: 15,
            marginRight: 15,
            flex: 1,
            alignItems: 'center'
        },
        label_style: {
            color: '#3e3c43',
            fontSize: 14,
        },
        value_style: {
            color: '#717789',
            fontSize: 14,
        }
    }
);
class WithdrawAccountSettingPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.withdraw_account_setting ),
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title={I18n.t( Keys.add_account )}
                    onPress={() => {
                        state.params.onTapAdd()
                    }}
                >
                    {I18n.t( Keys.add_account )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            isRequesting: false,
            withdrawAccounts: props.withdrawAccounts
        };
    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        nextState.withdrawAccounts = nextProps.withdrawAccounts;
        return true;
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapAdd: this.onTapAdd.bind( this ) } );
        if ( this.state.withdrawAccounts === null || this.state.withdrawAccounts.length === 0 ) {
            this.props.getWithdrawAccounts();
        }
    }

    componentWillUnmount() {
    }

    onTapAdd() {
        this.props.onTapAdd();
    };

    setDefaultWithdrawAccount( withdrawAccount ) {
        this.props.setDefaultWithdrawAccount(
            withdrawAccount.id, ( err, resBody ) => {
                if ( err ) {
                    Toast.show( I18n.t( Keys.set_fail ) + ': ' + err.message )
                } else {
                    Toast.show( I18n.t( Keys.set_success ) )
                }
            }
        )
    };

    onTapEdit( withdrawAccount ) {

    };

    onTapDelete( withdrawAccount ) {
        if ( withdrawAccount.default ) {
            Toast.show( I18n.t( Keys.cannot_delete_default_account ) );
            return;
        }
        //noinspection JSCheckFunctionSignatures
        Alert.alert(
            I18n.t( Keys.delete ),
            format(
                I18n.t( Keys.confirm_to_delete_address ),
                withdrawAccount.accountNo
            ),
            [
                { text: I18n.t( Keys.cancel ), onPress: () => console.log( 'cancel' ), style: 'cancel' },
                {
                    text: I18n.t( Keys.confirm ), onPress: () => {
                    this.setState( { isRequesting: true } );
                    this.props.onTapDelete(
                        withdrawAccount, ( err, resBody ) => {
                            this.setState( { isRequesting: false } );
                            if ( err ) {
                                Toast.show( I18n.t( Keys.delete_fail ) + ': ' + err.message )
                            } else {
                                Toast.show( I18n.t( Keys.delete_success ) );
                                this.props.onDeleteSuccess();
                            }
                        }
                    )
                }
                },
            ],
            { cancelable: true }
        )
    }

    _renderItem( item ) {
        let i = item.item;
        //noinspection JSCheckFunctionSignatures
        return (
            <View
                style={[ commonStyles.commonBorderBottom, commonStyles.commonBorderTop, {
                    paddingTop: 15,
                    marginTop: 10,
                    backgroundColor: 'white',
                    flex: 1
                }, ]}>
                <View
                    style={[ styles.item_style, {} ]}>
                    <Text
                        style={styles.label_style}
                        numberOfLines={1}
                    >
                        {I18n.t( Keys.bank_account ) + ": "}
                        <Text
                            style={styles.value_style}
                        >
                            {  i.accountNo}
                        </Text>
                    </Text>

                </View>

                <View
                    style={
                        styles.item_style
                    }>
                    <Text
                        style={styles.label_style}
                        numberOfLines={1}
                    >
                        {I18n.t( Keys.bank_name ) + ": "}
                        <Text
                            style={styles.value_style}
                        >
                            { i.extraInfo}
                        </Text>
                    </Text>
                </View>

                <View
                    style={
                        styles.item_style
                    }
                >
                    <Text
                        style={styles.label_style}
                        numberOfLines={1}
                    >
                        {I18n.t( Keys.bank_account_name ) + ": "}
                        <Text
                            style={styles.value_style}
                        >
                            {  i.memberName}
                        </Text>
                    </Text>
                </View>
                <View style={[ commonStyles.commonBorderBottom, {
                    marginTop: 10,
                } ]}/>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 48,
                        paddingLeft: 15,
                        paddingRight: 15
                    }}>

                    {i.default &&
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                        }}
                        source={require( '../../../../imgs/defaultSelect.png' )}/>
                    }
                    {!i.default &&
                    <TouchableOpacity
                        onPress={() => {
                            this.setDefaultWithdrawAccount( i )
                        }}>
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                            }}
                            source={require( '../../../../imgs/unSelect.png' )}/>
                    </TouchableOpacity>
                    }
                    {i.default &&
                    <Text style={{
                        fontSize: 14,
                        color: '#e72545',
                        marginLeft: 10,
                        flexGrow: 1,

                    }}>
                        {I18n.t( Keys.default_account )}
                    </Text>
                    }
                    {!i.default &&
                    <Text
                        onPress={() => {
                            this.setDefaultWithdrawAccount( i )
                        }}
                        style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flexGrow: 1,
                            marginLeft: 10
                        }}>
                        {I18n.t( Keys.set_default )}
                    </Text>
                    }
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onTapEditWithdrawAccount( i )
                        }}>
                        <Text style={{
                            color: '#717789',
                            fontSize: 14
                        }}>
                            {I18n.t( Keys.edit )}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.onTapDelete( i )
                        }}>
                        <Text style={{
                            color: '#717789',
                            fontSize: 14,
                            marginLeft: 30
                        }}>
                            {I18n.t( Keys.delete )}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        let empty = true;
        if ( this.state.withdrawAccounts && this.state.withdrawAccounts.length > 0 ) {
            empty = false;
        }
        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBG, commonStyles.commonBorderTop ]}>
                {empty ?
                    <View
                        style={
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                        <Text style={commonStyles.emptyTipStyle}>
                            {I18n.t( Keys.empty_withdraw_account_data )}
                        </Text>
                    </View>
                    :
                    <FlatList
                        keyExtractor={( item, index ) => {
                            return index;
                        }}
                        renderItem={this._renderItem.bind( this )}
                        data={this.state.withdrawAccounts}
                        style={
                            {
                                marginTop: 0
                            }
                        }>
                    </FlatList>
                }

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

export default WithdrawAccountSettingPageView;
