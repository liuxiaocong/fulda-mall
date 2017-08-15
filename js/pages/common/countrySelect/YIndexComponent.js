import React from "react";
import { Text, View } from "react-native";
import commonStyles from "../../../styles/commonStyles";
import { connect } from "react-redux";


class YIndexComponent extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        style: View.propTypes.style,
        isOpen: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            data: [
                '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
                'Z' ],
            width: 0,
            height: 0,
            pageX: 0,
            pageY: 0,
            currentKey: null,
            isFocus: false,
        };

        this._renderContent = this.renderContent();
    }

    static renderItem( data ) {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.justAlignCenter ]}
                key={data}
                onStartShouldSetResponder={() => {
                    return false;
                }}
            >
                <Text
                    style={[ commonStyles.commonTextColorStyle, { fontSize: 12 } ]}
                    onStartShouldSetResponder={() => {
                        return false;
                    }}
                >
                    {
                        data
                    }
                </Text>
            </View>
        );
    }

    calcCurrentKey( evt ) {
        const currentY = evt.nativeEvent.pageY - this.state.pageY - 15;
        const totalHeight = this.state.height - 15 - 15;
        const itemHeight = totalHeight / this.state.data.length;

        if ( currentY / itemHeight > this.state.data.length || currentY <= 0 ) {
            this.state.currentKey = null;
        } else {
            const newKey = this.state.data[ parseInt( currentY / itemHeight ) ];
            if ( newKey !== this.state.currentKey ) {
                this.state.currentKey = newKey;

                if ( this.props.onSelect ) {
                    this.props.onSelect( this.state.currentKey );
                }
            }
        }
    }

    renderContent() {
        const pages = [];
        for ( let i = 0; i < this.state.data.length; i++ ) {
            pages.push(
                YIndexComponent.renderItem( this.state.data[ i ] )
            );
        }

        return pages;
    }

    render() {
        if ( !this.props.isOpen ) {
            return null;
        }

        return (
            <View
                ref={( view ) => {
                    this._view = view;
                }}
                style={[
                    commonStyles.wrapper,
                    {
                        width: 30,
                        backgroundColor: this.state.isFocus ? '#ddd' : '#f1f3f5',
                        marginTop: 40,
                        marginBottom: 40,
                        borderRadius: 15,
                        paddingTop: 15,
                        paddingBottom: 15
                    },
                    this.props.style ]}
                onLayout={( event ) => {
                    this._view.measure( ( x,
                                          y,
                                          width,
                                          height,
                                          pageX,
                                          pageY, ) => {
                            this.setState( {
                                width: width,
                                height: height,
                                pageX: pageX,
                                pageY: pageY,
                            } );
                        }
                    );
                }}
                onStartShouldSetResponder={() => {
                    return true;
                }}
                onResponderStart={( evt ) => {
                    this.setState( {
                        isFocus: true
                    } );

                    this.calcCurrentKey( evt );
                }}
                onResponderMove={( evt ) => {
                    this.calcCurrentKey( evt )
                }}
                onResponderRelease={( evt ) => {
                    this.state.currentKey = null;
                }}
                onResponderEnd={( evt ) => {
                    this.setState( {
                        isFocus: false
                    } );
                }}
            >
                {this._renderContent}
            </View>
        )
    }
}


function select( store ) {
    return {}
}

export default connect( select )( YIndexComponent );
