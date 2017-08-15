import React from "react";
import {
    BackHandler,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import Grid from "react-native-grid-component";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "react-native-button";
import Toast from "react-native-root-toast";
import Modal from "react-native-root-modal";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


class GoodsChooseComponent extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,

        isOpen: React.PropTypes.bool,

        stockTypes: React.PropTypes.array.isRequired,
        stocks: React.PropTypes.object.isRequired,
        currentStockSelectTypes: React.PropTypes.array.isRequired,
        currentStockSelectCount: React.PropTypes.number.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            isOpen: this.props.isOpen,

            stockTypes: this.props.stockTypes,
            stocks: this.props.stocks,
            currentStockSelectTypes: this.props.currentStockSelectTypes,
            currentStockSelectCount: this.props.currentStockSelectCount,

        };
    }

    componentWillMount() {
        BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }


    componentWillReceiveProps( nextProps ) {
        this.setState( {
            isOpen: nextProps.isOpen,

            stockTypes: nextProps.stockTypes,
            stocks: nextProps.stocks,
            currentStockSelectTypes: nextProps.currentStockSelectTypes,
            currentStockSelectCount: nextProps.currentStockSelectCount,
        } );
    }

    _onBack() {
        if ( this.state.isOpen ) {
            if ( this.props.onClose ) {
                this.props.onClose();
            }

            return true;
        }
        return false;
    }

    renderTypeSelect( data, currentSelect, select ) {
        const viewWidth = Dimensions.get( 'window' ).width;

        return (
            <View>
                <Text style={[
                    commonStyles.commonTextColorStyle,
                    {
                        width: viewWidth,
                        marginTop: 15,
                        fontSize: 14,
                        marginLeft: 15,
                        marginRight: 15,
                    }
                ]}>
                    {data.key}
                </Text>

                <View style={[
                    {
                        width: viewWidth,
                        paddingLeft: 11,
                        paddingRight: 11,
                    }
                ]}>
                    <Grid
                        style={[]}
                        itemHasChanged={( r1, r2 ) => {
                            return true;
                        }}
                        renderItem={( data, i ) => {
                            return (
                                <TouchableHighlight
                                    style={[
                                        commonStyles.justAlignCenter,
                                        {
                                            flex: 1,
                                            height: 40,
                                            width: (viewWidth - 11 - 11) / 4,
                                            margin: 1,
                                            marginTop: 8,
                                            marginLeft: 4,
                                            marginRight: 4,
                                            backgroundColor: (currentSelect.value === data) ? constStyles.THEME_COLOR : 'white',
                                            borderWidth: 1,
                                            borderColor: (currentSelect.value === data) ? constStyles.THEME_COLOR : '#717789'
                                        }
                                    ]}
                                    underlayColor='#ddd'
                                    onPress={() => {
                                        if ( select ) {
                                            select( data );
                                        }
                                    }}
                                    key={data + ': ' + i}
                                >
                                    <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                                        {data}
                                    </Text>
                                </TouchableHighlight>
                            );
                        }}
                        data={data.value}
                        itemsPerRow={4}
                    />

                </View>
            </View>
        );
    }

    renderCounter() {
        const viewWidth = Dimensions.get( 'window' ).width;

        const maxCount = this.calcCounter();

        return (
            <View>
                <Text style={[
                    commonStyles.commonTextColorStyle,
                    {
                        width: viewWidth,
                        marginTop: 15,
                        fontSize: 14,
                        marginLeft: 15,
                        marginRight: 15,
                    }
                ]}>
                    {I18n.t( Keys.count )}
                </Text>

                <View style={[ {
                    flexDirection: 'row',
                    marginTop: 10,
                    marginLeft: 15,
                    marginRight: 15
                } ]}>
                    <TouchableHighlight
                        style={[
                            commonStyles.justAlignCenter,
                            commonStyles.commonBG,
                            {
                                height: 28,
                                width: 40,
                            }
                        ]}
                        underlayColor='#ddd'
                        onPress={() => {
                            this.setState( {
                                currentStockSelectCount: ((maxCount !== null && this.state.currentStockSelectCount < maxCount) || maxCount === null) ? (this.state.currentStockSelectCount + 1) : maxCount
                            } );
                        }}
                    >
                        <Icon
                            name={'md-add'}
                            size={22}
                            color={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        />
                    </TouchableHighlight>

                    <View style={[ commonStyles.justAlignCenter, {
                        height: 28,
                        width: 40,
                        borderWidth: 1,
                        borderColor: '#717789',
                        marginLeft: 5,
                        marginRight: 5,
                    } ]}>
                        <Text style={[ commonStyles.commonTextColorStyle, { fontSize: 14 } ]}>
                            {this.state.currentStockSelectCount}
                        </Text>
                    </View>

                    <TouchableHighlight
                        style={[
                            commonStyles.justAlignCenter,
                            commonStyles.commonBG,
                            {
                                height: 28,
                                width: 40,
                            }
                        ]}
                        underlayColor='#ddd'
                        onPress={() => {
                            this.setState( {
                                currentStockSelectCount: this.state.currentStockSelectCount > 1 ? (this.state.currentStockSelectCount - 1) : this.state.currentStockSelectCount
                            } );
                        }}
                    >
                        <Icon
                            name={'md-remove'}
                            size={22}
                            color={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                        />
                    </TouchableHighlight>


                    {
                        maxCount !== null ?
                            (
                                <Text style={[ { fontSize: 14, color: '#717789', marginLeft: 10, marginTop: 10 } ]}>
                                    当前商品库存（
                                    <Text>
                                        {maxCount}
                                        <Text>
                                            ）
                                        </Text>
                                    </Text>
                                </Text>
                            )
                            :
                            null
                    }

                </View>

            </View>
        );
    }

    calcCounter() {
        if ( this.state.currentStockSelectTypes.length <= 0 ) {
            return null;
        }

        let stocksKey = '';
        for ( let index = 0; index < this.state.currentStockSelectTypes.length; index++ ) {
            if ( this.state.currentStockSelectTypes[ index ].value === null ) {
                return null;
            }

            stocksKey = stocksKey + this.state.currentStockSelectTypes[ index ].value + ':';
        }

        stocksKey = stocksKey.substr( 0, stocksKey.length - 1 );

        let count = this.state.stocks[ stocksKey ];

        if ( count === undefined ) {
            count = null;
        }

        return count;
    }

    renderContent() {


        return (
            <ScrollView style={[ commonStyles.wrapper ]}>
                <FlatList
                    data={this.state.stockTypes}
                    keyExtractor={( item, index ) => {
                        return index;
                    }}
                    renderItem={( { item, index } ) => {
                        return (
                            this.renderTypeSelect( item, this.state.currentStockSelectTypes[ index ],
                                ( selectData ) => {
                                    this.state.currentStockSelectTypes[ index ] = {
                                        key: item.key,
                                        value: selectData,
                                    };

                                    const stockTypes = this.state.stockTypes.slice();

                                    this.setState( {
                                        currentStockSelectTypes: this.state.currentStockSelectTypes,
                                        stockTypes: stockTypes
                                    } );
                                } )
                        );
                    }}
                />

                {
                    this.renderCounter()
                }

                <Button
                    containerStyle={[
                        commonStyles.buttonContainerStyle, {
                            marginRight: 37,
                            marginLeft: 37,
                            marginTop: 40,
                            marginBottom: 20,
                        }
                    ]}
                    style={[ commonStyles.buttonContentStyle ]}
                    onPress={() => {
                        for ( let index = 0; index < this.state.currentStockSelectTypes.length; index++ ) {
                            if ( this.state.currentStockSelectTypes[ index ].value === null ) {
                                Toast.show( I18n.t( Keys.plz_select ) + ": " + this.state.currentStockSelectTypes[ index ].key );

                                return;
                            }
                        }

                        if ( this.state.currentStockSelectCount <= 0 ) {
                            Toast.show( I18n.t( Keys.plz_select_goods_count ) );

                            return;
                        }


                        if ( this.props.onSelect ) {
                            this.props.onSelect( this.state.currentStockSelectTypes, this.state.currentStockSelectCount );
                        }
                        if ( this.props.onClose ) {
                            this.props.onClose();
                        }
                    }} title="">
                    {I18n.t( Keys.confirm )}
                </Button>

            </ScrollView>
        )
            ;
    }

    render() {
        const viewWidth = Dimensions.get( 'window' ).width;
        const headerImageHeight = viewWidth * 130 / 375;

        const viewHeight = Dimensions.get( 'window' ).height;

        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isOpen}
                onRequestClose={() => {
                    if ( this.props.onClose ) {
                        this.props.onClose();
                    }
                }}
            >

                <View>
                    <TouchableOpacity
                        style={[ {
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        } ]}
                        onPress={() => {
                            if ( this.props.onClose ) {
                                this.props.onClose();
                            }
                        }}
                    />

                    <View
                        style={[
                            {
                                backgroundColor: 'white',
                                width: viewWidth, height: viewHeight - viewWidth + 200
                            }
                        ]}
                    >
                        {this.renderContent()}
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create( {
    grid: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
} );

function select( store ) {
    return {}
}

export default connect( select )( GoodsChooseComponent );
