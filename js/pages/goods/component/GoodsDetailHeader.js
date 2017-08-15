import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import constStyles from "../../../styles/constStyles";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import TabBarStyleComponent1 from "../../../components/TabBarStyleComponent1";
import GoodsDetailHeaderViewPage from "./GoodsDetailHeaderViewPage";
import TouchableItemComponent from "../../../components/TouchableItemComponent";
import Util from "../../../util/Util";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const mapStoreToProps = ( store, ownProps ) => {
    return {}
};

class GoodsDetailHeader extends React.Component {
    static propTypes = {
        onTabSelect: React.PropTypes.func.isRequired,
        onServiceChoose: React.PropTypes.func.isRequired,
        service: React.PropTypes.object,
        tabData: React.PropTypes.array.isRequired,
        tab: React.PropTypes.object
    };

    constructor( props ) {
        super( props );
        this.state = {
            service: this.props.service,
            tab: this.props.tab,
            tabData: this.props.tabData,
        };
    }

    refreshData( service ) {
        this.setState( {
            service: service
        } );
    }


    static renderInfoItem( title, content ) {
        return (
            <View style={[
                commonStyles.wrapper,
                {
                    flexDirection: 'row'
                }
            ]}>
                <Text style={[ { fontSize: 12, color: '#717789' } ]}>
                    {title}
                    <Text>
                        {content}
                    </Text>
                </Text>

            </View>
        );
    }

    renderChoose() {
        const viewWidth = Dimensions.get( 'window' ).width;

        const stockTypes = this.state.service && this.state.service.detail && this.state.service.detail.stockTypes ? this.state.service.detail.stockTypes : [];
        const stocks = this.state.service && this.state.service.detail && this.state.service.detail.stocks ? this.state.service.detail.stocks : {};

        let chooseTip = '';
        for ( let index = 0; index < stockTypes.length; index++ ) {
            chooseTip += stockTypes[ index ].key + ' ';
        }

        chooseTip += '数量';

        return (
            <View>
                <View style={[ { backgroundColor: '#f1f3f5', height: 10, width: viewWidth } ]}/>

                <TouchableItemComponent
                    style={[ { width: viewWidth } ]}
                    title={I18n.t( Keys.plz_select ) + " " + chooseTip}
                    onPress={() => {
                        if ( this.props.onServiceChoose ) {
                            this.props.onServiceChoose();
                        }
                    }}
                    headerInterval={true}
                    footerInterval={true}/>
            </View>

        );
    }


    render() {
        const viewWidth = Dimensions.get( 'window' ).width;

        return (
            <View
                style={[
                    {
                        width: viewWidth,
                        alignItems: 'center',
                    },
                    this.props.style
                ]}>

                <GoodsDetailHeaderViewPage service={this.state.service}/>

                <View style={[
                    {
                        width: viewWidth,
                        paddingLeft: 15,
                        paddingRight: 15,
                    },

                ]}>
                    <Text
                        style={[
                            commonStyles.commonTextColorStyle,
                            {
                                fontSize: 14,
                                marginTop: 13
                            }
                        ]}>
                        {this.state.service ? this.state.service.name : null}
                    </Text>
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                marginTop: 13,
                                marginBottom: 10,
                                alignItems: 'center'
                            }
                        ]}>
                        <Text style={[ {
                            color: constStyles.THEME_COLOR,
                            fontSize: 16,
                            fontWeight: 'bold'
                        } ]}>
                            {this.state.service ? Util.getShowPrice( this.state.service.displayCurrency, this.state.service.displayPrice ) : ''}
                        </Text>
                        <Text style={[ {
                            color: constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR,
                            fontSize: 12,
                            marginLeft: 24
                        } ]}>
                            {I18n.t( Keys.original_price ) + " :"}
                            <Text style={[ {
                                textDecorationLine: 'line-through'
                            } ]}>
                                {this.state.service ? Util.getShowPrice( this.state.service.displayCurrency, (this.state.service.detail && this.state.service.detail.displayMarketPrice) ? this.state.service.detail.displayMarketPrice : this.state.service.displayPrice ) : ''}
                            </Text>
                        </Text>
                    </View>
                </View>


                <View style={[ commonStyles.commonIntervalStyle, { width: viewWidth } ]}/>
                <View style={[ {
                    width: viewWidth,
                    height: 35,
                    paddingLeft: 15,
                    paddingRight: 15,
                    flexDirection: 'row',
                },
                    commonStyles.justAlignCenter
                ]}>
                    {GoodsDetailHeader.renderInfoItem( I18n.t( Keys.brand ) + ": ", '' + (this.state.service && this.state.service.brandName ? this.state.service.brandName : '') )}
                    {GoodsDetailHeader.renderInfoItem( I18n.t( Keys.serial_number ) + ": ", '' + (this.state.service && this.state.service.brandId ? this.state.service.brandId : '') )}
                    {GoodsDetailHeader.renderInfoItem( I18n.t( Keys.sales ) + ": ", '' + (this.state.service && this.state.service.statistics && this.state.service.statistics.salesNo ? this.state.service.statistics.salesNo : '0') )}
                </View>
                <View style={[ commonStyles.commonIntervalStyle, { width: viewWidth } ]}/>

                {this.renderChoose()}

                <View style={[ { backgroundColor: '#f1f3f5', height: 10, width: viewWidth } ]}/>

                <View style={[ commonStyles.commonIntervalStyle, { width: viewWidth } ]}/>
                <TabBarStyleComponent1 style={[ {
                    height: 48
                } ]}
                                       data={this.state.tabData}
                                       tab={this.state.tab}
                                       onTabSelect={( tab ) => {
                                           if ( this.props.onTabSelect ) {
                                               this.props.onTabSelect( tab );
                                           }
                                       }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default  connect( select )( GoodsDetailHeader );
