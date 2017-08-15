import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import I18n from "../../I18n";
import * as UtilConfig from "../../configs/UtilConfig";
import commonStyles from "../../styles/commonStyles";
import ModalBox from "react-native-modalbox";
import constStyles from "../../styles/constStyles";
import Spinner from "react-native-spinkit";
import { netMemberEditFavorites, netMemberListFavorites } from "../../net/MemberNet";
import Keys from "../../configs/Keys";
import Util from "../../util/Util";
import ImageWithPlaceHolder from "../../components/ImageWithPlaceHolder";

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#f1f3f5',
            paddingLeft: 0,
            paddingRight: 0,
        },
    }
);

const { width } = Dimensions.get( 'window' );
const targetSize = (width - 30) / 2;

class FavoritesGoodsPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.goods ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            data: [],
            err: "",
            isRequesting: false,
            hasMore: true,
            currentPageNum: UtilConfig.DEFAULT_PAGE_START
        };
    }

    componentDidMount() {
        this.loadData( true );
    }

    componentWillUnmount() {
    }


    _renderItem = ( item ) => {
        let goodsItem = item.item;
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate( 'goodsDetailPage', {
                        data: goodsItem,
                        dataId: goodsItem.id,
                        location: goodsItem.location
                    } );
                }}>
                <View
                    style={{
                        backgroundColor: 'white',
                        width: targetSize,
                        marginLeft: 5,
                        marginRight: 5,
                        marginBottom: 10,
                        borderRadius: 8,
                        shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 1
                        },
                        shadowRadius: 1,
                        shadowOpacity: 0.2

                    }}>
                    <View
                        style={{
                            overflow: 'hidden',
                            width: targetSize,
                            height: targetSize,
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                        }}>
                        <ImageWithPlaceHolder
                            style={{
                                width: targetSize,
                                height: targetSize,
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                                alignItems: 'center',
                                justifyContent: 'center'
                            } }
                            placeholderForIcon={'md-image'}
                            source={{ uri: goodsItem.logo + "" }}
                        />
                        {goodsItem.close &&
                        <Text style={{
                            color: '#e72545',
                            fontSize: 11,
                            position: 'absolute',
                            backgroundColor: '#fff',
                            marginLeft: -15,
                            marginTop: 10,
                            width: 60,
                            transform: [ { rotate: '-45deg' } ],
                            textAlign: 'center'
                        }}>
                            {I18n.t( Keys.already_close )}
                        </Text>
                        }

                        <View
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                height: 32,
                                width: targetSize,
                                backgroundColor: 'rgba( 0, 0, 0, 0.2 )',
                                alignItems: 'flex-end',
                                justifyContent: 'center'
                            }}>
                            <TouchableOpacity onPress={() => {
                                this.unFavItem( goodsItem );
                            }                               }
                                              style={{}}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row'
                                    }}>
                                    <Image
                                        style={{
                                            width: 15,
                                            height: 15
                                        }}
                                        source={require( '../../imgs/ic_collection_cancel.png' )}/>

                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 13,
                                        marginLeft: 5,
                                        marginRight: 10
                                    }}>{I18n.t( Keys.un_favorite )}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4
                        }}>
                        <Text
                            style={{
                                color: '#3e3c43',
                                fontSize: 13,
                                marginTop: 10,
                                marginLeft: 10,
                                marginRight: 10,
                                height: 30
                            }}>{this.getNameDisplay( goodsItem )}</Text>

                        <Text style={{
                            color: '#ffc515',
                            fontSize: 13,
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 10,
                            marginBottom: 10
                        }}>{this.getPriceDisplay( goodsItem )}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };


    unFavItem = ( goodsItem ) => {
        this.setState( { isRequesting: true } );
        netMemberEditFavorites(
            goodsItem.id, UtilConfig.FAV_TYPE_GOODS, 0, true, ( err, res ) => {
                this.setState( { isRequesting: false } );
                if ( !err ) {
                    Toast.show( I18n.t( Keys.un_favorite_success ) );
                    this.removeFromData( goodsItem );
                } else {
                    Toast.show( I18n.t( Keys.un_favorite_fail ) + ': ' + err.message );
                }
            }
        )
    };

    removeFromData( goodsItem ) {
        let data = [];
        for ( let i = 0; i < this.state.data.length; i++ ) {
            if ( this.state.data[ i ].id !== goodsItem.id ) {
                data.push( this.state.data[ i ] );
            }
        }
        this.setState( { data: data } )
    }

    getNameDisplay = ( goodsItem ) => {
        let name = goodsItem.name;
        if ( name.length > 20 ) {
            name = name.substr( 0, 20 ) + "..";
        }
        return name;
    };
    getPriceDisplay = ( goodsItem ) => {
        return Util.getShowPrice( goodsItem.currency, goodsItem.displayPrice );
    };

    onEndReached() {
        if ( this.state.hasMore ) {
            this.loadData( false );
        }
    }

    loadData( isRefresh ) {
        if ( isRefresh ) {
            this.setState( { isRequesting: true, currentPageNum: UtilConfig.DEFAULT_PAGE_START, hasMore: true } );
        }
        if ( !this.state.hasMore ) {
            this.setState( { isRequesting: false } );
            return;
        }
        netMemberListFavorites(
            UtilConfig.FAV_TYPE_GOODS, UtilConfig.DEFAULT_PAGE_SIZE, this.state.currentPageNum, ( err, res ) => {
                this.setState( { isRequesting: false } );
                if ( err ) {
                    this.setState( { err: err + "" } )
                } else {
                    let hasMore = true;
                    let page = this.state.currentPageNum++;
                    if ( res.data === null || res.data.length < UtilConfig.DEFAULT_PAGE_SIZE ) {
                        hasMore = false;
                    }
                    let data = this.state.data;
                    if ( isRefresh ) {
                        data = res.data;
                    } else if ( res.data ) {
                        data = data.concat( res.data )
                    }
                    this.setState( { data: data, hasMore: hasMore, currentPageNum: page } )
                }
            }
        )
    }

    render() {
        let haveData = false;
        if ( this.state.data && this.state.data.length > 0 ) {
            haveData = true;
        }
        return (
            <View style={[ commonStyles.wrapper, styles.container ]}>
                {
                    this.state.err ?
                        <Text
                            style={[
                                commonStyles.errorTipStyle
                            ]}>
                            {this.state.err}
                        </Text>
                        : null
                }
                {haveData ?
                    <FlatList
                        renderItem={this._renderItem.bind( this )}
                        numColumns={2}
                        data={this.state.data}
                        onEndReached={this.onEndReached.bind( this )}
                        keyExtractor={( item, index ) => {
                            return index;
                        }}
                        style={
                            {
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 10
                            }
                        }>
                    </FlatList>
                    :
                    <View
                        style={
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                        <Text style={commonStyles.emptyTipStyle}>
                            {I18n.t( Keys.empty_fav_good )}
                        </Text>
                    </View>
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

export default FavoritesGoodsPageView;
