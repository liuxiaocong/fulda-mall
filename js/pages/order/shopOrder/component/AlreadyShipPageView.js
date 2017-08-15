import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import Toast from "react-native-root-toast";
import commonStyles from "../../../../styles/commonStyles";
import constStyles from "../../../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import OrderShopItem from "../../component/OrderShopItem";
import I18n from "../../../../I18n";
import Keys from "../../../../configs/Keys";


const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#f1f3f5',
        paddingLeft: 0,
        paddingRight: 0,
    },
    actionButton: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
    },
    actionText: {
        color: constStyles.THEME_COLOR,
        fontSize: 15
    }
} );
class AlreadyShipPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

    };

    constructor( props ) {
        super( props );
        this.state = {
            getData: false,
            data: [],
            isRequesting: false,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
        this.refreshData();
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this.props.onTapSave();
    };

    _renderItem = ( { item } ) => {
        return (
            <View>
                <OrderShopItem
                    { ...this.props }
                    data={item}
                    isShopOrder={true}/>
                <View style={[ commonStyles.commonIntervalStyle ]}/>
            </View>
        )
    };


    refreshData() {
        this.setState( {
            isRequesting: true
        } );

        this.props.loadData( ( err, response ) => {
            if ( err ) {
                Toast.show( err + "" );
                this.setState( {
                    isRequesting: false
                } );
            } else {
                this.setState( {
                    data: response.data,
                    getData: true,
                    isRequesting: false
                } )
            }
        } );
    }



    render() {
        let isEmpty = true;
        if ( this.state.data && this.state.data.length > 0 ) {
            isEmpty = false;
        }
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                {
                    this.state.getData ?
                        isEmpty ?
                            <View
                                style={
                                    {
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                }>
                                <Text style={commonStyles.emptyTipStyle}>
                                    {I18n.t( Keys.empty_wait_ship_order )}
                                </Text>
                            </View>
                            :
                            <FlatList
                                style={{
                                    flexGrow: 1,
                                }}
                                renderItem={this._renderItem}
                                data={this.state.data}
                            >
                            </FlatList>
                        :
                        <View/>
                }

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc"
                             color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        )
    }
}

export default AlreadyShipPageView;
