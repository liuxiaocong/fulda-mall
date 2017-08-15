import { Image, StyleSheet, Text, View } from "react-native";
import React, { PropTypes } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import commonStyles from "../styles/commonStyles";
import Util from "../util/Util";


class ImageWithPlaceHolder extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        placeholderForIcon: React.PropTypes.string,
        placeholderForSource: PropTypes.oneOfType( [
            PropTypes.number,
            PropTypes.shape( {
                uri: PropTypes.string,
            } ),
        ] ),
        source: PropTypes.oneOfType( [
            PropTypes.number,
            PropTypes.shape( {
                uri: PropTypes.string,
            } ),
        ] ),
        emptyTip: React.PropTypes.string,
        emptyTipColor: React.PropTypes.string
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }


    calcIconSize( style ) {
        let width = null;
        let height = null;
        if ( style ) {
            if ( Util.isArray( style ) ) {
                for ( let index = 0; index < style.length; index++ ) {
                    const result = this.calcIconSize( style[ index ] );

                    width = result.width ? result.width : width;
                    height = result.height ? result.height : height;
                }
            } else {
                width = style.width ? style.width : width;
                height = style.height ? style.height : height;
            }
        }

        return { width: width, height: height };
    }

    renderImage( isNeedBackground, isAbsolute ) {
        return (
            <View
                style={[ isNeedBackground ? { backgroundColor: '#c3c6d0' } : {}, isAbsolute ? { position: 'absolute' } : {}, this.props.style, commonStyles.justAlignCenter ]}>
                <Image
                    style={[ {}, this.props.style, ]}
                    source={this.props.source}
                />
                {
                    !this.props.source && this.props.emptyTip ?
                        <Text
                            style={{
                                color: this.props.emptyTipColor ? this.props.emptyTipColor : '#fff',
                                fontSize: 10,
                                position: 'absolute',
                                textAlign: 'center'
                            }}
                        >
                            {this.props.emptyTip}
                        </Text>
                        :
                        null
                }
            </View>
        );
    }

    render() {
        if ( this.props.placeholderForIcon ) {
            const { width, height } = this.calcIconSize( this.props.style );
            let size = (width > height ? height : width) / 3 * 2;

            if ( size > 150 ) {
                size = 150;
            }

            return (
                <View
                    style={[ { backgroundColor: '#c3c6d0' }, this.props.style, commonStyles.justAlignCenter ]}>
                    <Icon
                        style={[ {} ]}
                        name={this.props.placeholderForIcon}
                        size={size}
                        color={'white'}>
                    </Icon>

                    {this.renderImage( false, true )}
                </View>
            );
        } else if ( this.props.placeholderForSource ) {
            return (
                <Image
                    style={[ { backgroundColor: '#c3c6d0' }, this.props.style, ]}
                    resizeMode={Image.resizeMode.contain}
                    source={this.props.placeholderForSource}
                >
                    {this.renderImage( false, false )}
                </Image>);
        } else {
            return this.renderImage( true, false )
        }
    }
}

const styles = StyleSheet.create( {} );

export default ImageWithPlaceHolder;
