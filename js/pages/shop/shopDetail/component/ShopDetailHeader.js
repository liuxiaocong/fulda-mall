import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import constStyles from "../../../../styles/constStyles";
import commonStyles from "../../../../styles/commonStyles";
import TabBarStyleComponent1 from "../../../../components/TabBarStyleComponent1";
import ShopInfoComponent from "./ShopInfoComponent";
import ImageWithPlaceHolder from "../../../../components/ImageWithPlaceHolder";


class ShopDetailHeader extends React.Component {
    static propTypes = {
        onTabSelect: React.PropTypes.func.isRequired,
        business: React.PropTypes.object,
        tabData: React.PropTypes.array.isRequired,
        tab: React.PropTypes.object,
    };

    constructor( props ) {
        super( props );
        this.state = {
            business: this.props.business,
            tab: this.props.tab,
            tabData: this.props.tabData
        };
    }

    render() {
        const viewWidth = Dimensions.get( 'window' ).width;
        const headerImageWidth = viewWidth;
        const headerImageHeight = headerImageWidth * 130 / 375;

        return (
            <View
                style={[
                    {
                        width: viewWidth,
                        alignItems: 'center',
                    },
                    this.props.style
                ]}>

                <View style={[ {
                    width: headerImageWidth,
                    height: headerImageHeight,
                }
                ]}>
                    <ImageWithPlaceHolder
                        style={{
                            width: headerImageWidth,
                            height: headerImageHeight,
                            backgroundColor: constStyles.THEME_COLOR
                        } }
                        source={this.props.business && this.props.business.banner ? { uri: this.props.business.banner } : null}
                    />

                </View>

                <View style={[ {
                    width: 70,
                    height: 70,
                    marginTop: -35,
                    backgroundColor: constStyles.THEME_COLOR,
                }
                ]}>
                    <ImageWithPlaceHolder
                        style={{
                            width: 70,
                            height: 70,
                        } }
                        placeholderForIcon={'md-image'}
                        source={this.props.business && this.props.business.logo ? { uri: this.props.business.logo } : null}
                    />
                </View>


                <Text style={[ {
                    marginTop: 15,
                    fontSize: 16,
                    marginLeft: 15,
                    marginRight: 15
                }, commonStyles.commonTextColorStyle ]}>
                    {this.props.business ? this.props.business.name : ''}
                </Text>

                <ShopInfoComponent style={[ { marginTop: 10 } ]} business={this.state.business}/>

                <View style={[ commonStyles.commonIntervalStyle, { width: viewWidth } ]}/>

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

export default connect( select )( ShopDetailHeader );
