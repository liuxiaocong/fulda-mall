import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import commonStyles from "../styles/commonStyles";
class TouchableItemComponent extends React.Component {

    static propTypes = {
        onPress: React.PropTypes.func,
        title: React.PropTypes.string,
        content: React.PropTypes.string,
        headerInterval: React.PropTypes.bool,
        footerInterval: React.PropTypes.bool,
        containerStyle: View.propTypes.style,
        style: View.propTypes.style,
        titleFontSize: React.PropTypes.number,
        contentStyle: View.propTypes.style,
        leftElement: React.PropTypes.element,
        children: React.PropTypes.element,
        hideRightNav: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );
    }

    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ styles.container, this.props.containerStyle ]}>
                {this.props.headerInterval
                    ? <View style={[ commonStyles.commonIntervalStyle ]}/>
                    : null}
                <TouchableHighlight
                    style={[
                        {
                            backgroundColor: "white",
                            minHeight: 46,
                            paddingRight: 11,
                            paddingLeft: 16,
                            paddingTop: 14,
                            paddingBottom: 14
                        },
                        this.props.style
                    ]}
                    underlayColor='#ddd'
                    onPress={() => {
                        this
                            .props
                            .onPress();
                    }}>
                    <View
                        style={[
                            {
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            },
                            commonStyles.justAlignCenter
                        ]}>
                        {

                            <View style={{
                                flexDirection: 'row',
                                marginRight: 10
                            }}>
                                {
                                    this.props.title ?
                                        <Text
                                            style={[
                                                {
                                                    fontSize: this.props.titleFontSize,
                                                },
                                                commonStyles.commonTextColorStyle
                                            ]}>
                                            {this.props.title}
                                        </Text>
                                        :
                                        null
                                }
                                {this.props.leftElement ? this.props.leftElement : null}
                            </View>
                        }


                        {
                            <View style={[
                                {
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                } ]
                            }>
                                {
                                    this.props.content && this.props.content.length > 0 ?
                                        <Text
                                            style={[
                                                {
                                                    flex: 1,
                                                    fontSize: 14,
                                                    textAlign: 'right',
                                                    color: '#717789',
                                                },
                                                this.props.contentStyle
                                            ]}>
                                            {this.props.content }
                                        </Text>
                                        :
                                        null
                                }
                                {this.props.children !== null ? this.props.children : null}
                            </View>
                        }

                        <Image
                            style={{
                                width: 8,
                                height: 13,
                                marginLeft: 15
                            }}
                            source={require( '../imgs/ic_right_arrow.png' )}/>
                    </View>
                </TouchableHighlight>
                {this.props.footerInterval
                    ? <View style={[ commonStyles.commonIntervalStyle ]}/>
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create( { container: {} } );

export default TouchableItemComponent;
