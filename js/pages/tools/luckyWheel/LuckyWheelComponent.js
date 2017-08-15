import React from "react";

import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, G, Path, Text, TSpan } from "react-native-svg";
import commonStyles from "../../../styles/commonStyles";

class LuckyWheelComponent extends React.Component {
    static propTypes = {
        squareSize: React.PropTypes.number.isRequired,
        data: React.PropTypes.array.isRequired,
        onPointToIndex: React.PropTypes.func,
        colorsData: React.PropTypes.array.isRequired,
        onLoadResult: React.PropTypes.func.isRequired,
    };

    static show_result_time = 5000;
    static show_result_radius = 1800;
    static failed_time = 1000;
    static failed_radius = 360;
    static waiting_result_time = 60000;
    static waiting_result_radius = LuckyWheelComponent.show_result_radius / LuckyWheelComponent.show_result_time * LuckyWheelComponent.waiting_result_time;
    static minValue = 0;
    static maxValue = 100;

    constructor( props ) {
        super( props );


        this.state = {
            data: this.props.data,

            animatedValue: new Animated.Value( 0 ),

            isRunning: false,
            isLoading: false,

            startDegree: 0,
            endDegree: 0,

            selectDataIndex: -1,
            error: null,

            colorsData: this.props.colorsData
        };
    }

    componentWillMount() {
        this.state.animatedValue.addListener( ( state ) => {
            if ( state.value >= LuckyWheelComponent.maxValue ) {
                if ( this.state.isLoading ) {
                    this.setState( {
                        isLoading: false,
                        startDegree: this.state.endDegree % 360
                    } );

                    this.startShowResult( -1 );
                } else {
                    this.setState( {
                        isRunning: false,
                        startDegree: this.state.endDegree % 360
                    } );
                }

                if ( this.props.onPointToIndex ) {
                    this.props.onPointToIndex( this.state.error, this.state.selectDataIndex );
                }
            }
        } );
    }

    componentDidMount() {

    }

    componentWillReceiveProps( nextProps ) {
        if ( this.state.data !== nextProps.data || this.state.colorsData !== nextProps.colorsData ) {
            this.setState( {
                data: nextProps.data,
                colorsData: nextProps.colorsData
            } );
        }
    }

    start() {
        if ( this.state.isRunning ) {
            return;
        }

        const isLoading = true;

        this.setState( {
            isRunning: true,
            isLoading: isLoading,
            endDegree: this.state.startDegree + LuckyWheelComponent.waiting_result_radius,
            selectDataIndex: -1
        } );

        this.state.animatedValue.setValue( 0 );

        Animated.timing( this.state.animatedValue, {
            toValue: LuckyWheelComponent.maxValue,
            duration: this.state.waiting_result_time,
            easing: Easing.out( Easing.quad ),
            delay: 0
        } ).start();

        if ( this.props.onLoadResult ) {
            this.props.onLoadResult( ( error, selectDataIndex ) => {
                this.startShowResult( error, selectDataIndex );
            } );
        }
    }

    startShowResult( error, selectDataIndex ) {
        this.state.animatedValue.stopAnimation( ( state ) => {
            const startDegree = LuckyWheelComponent.calcStartDegreeByStateValue( this.state.startDegree, this.state.endDegree, state );
            let endDegree = startDegree + (selectDataIndex >= 0 ? LuckyWheelComponent.show_result_radius : LuckyWheelComponent.failed_radius);

            if ( selectDataIndex >= 0 ) {
                endDegree = LuckyWheelComponent.correctionEndDegreeBySelectIndex( endDegree, this.state.data.length, selectDataIndex )
            }

            const isLoading = false;

            this.setState( {
                isRunning: true,
                isLoading: isLoading,
                startDegree: startDegree,
                endDegree: endDegree,
                selectDataIndex: selectDataIndex,
                error: error
            } );

            this.state.animatedValue.setValue( 0 );

            Animated.timing( this.state.animatedValue, {
                toValue: LuckyWheelComponent.maxValue,
                duration: selectDataIndex >= 0 ? LuckyWheelComponent.show_result_time : LuckyWheelComponent.failed_time,
                easing: Easing.out( Easing.quad ),
                delay: 0
            } ).start();
        } );
    }

    stop() {
        this.state.animatedValue.stopAnimation( ( state ) => {
            this.setState( {
                isRunning: false,
                isLoading: false,
                startDegree: LuckyWheelComponent.calcStartDegreeByStateValue( this.state.startDegree, this.state.endDegree, state )
            } );
        } );
    }

    static correctionEndDegreeBySelectIndex( endDegree, count, selectDataIndex ) {
        if ( count <= 0 || selectDataIndex <= 0 ) {
            return endDegree;
        }

        const angle = 360 / count;

        endDegree = endDegree + ((360 - endDegree % 360) % 360 + (360 - selectDataIndex * angle) + Math.floor( Math.random() * (angle - 6) + 3 ) - angle / 2 + 360) % 360;

        return endDegree;
    }

    static calcStartDegreeByStateValue( startDegree,
                                        endDegree, value ) {
        return (startDegree + value / LuckyWheelComponent.maxValue * (endDegree - startDegree)) % 360;
    }

    static renderPointOnBorder( squareSize,
                                strokeWidth ) {
        const pointCount = 6;

        const degreeUnit = 360 / pointCount;

        const pointCoordinateData = [];

        for ( let index = 0; index < pointCount; index++ ) {
            const degree = degreeUnit * index;
            const radian = degree * Math.PI / 180;

            const sinValue = Math.sin( radian );
            const cosValue = Math.cos( radian );

            const xInterval = (squareSize - strokeWidth) / 2 * (sinValue );
            const yInterval = (squareSize - strokeWidth) / 2 * (cosValue );

            let cx = squareSize / 2 + xInterval;
            let cy = squareSize / 2 + yInterval;

            pointCoordinateData.push( {
                cx: cx,
                cy: cy
            } )
        }


        const pointData = [];
        for ( let index = 0; index < pointCoordinateData.length; index++ ) {
            pointData.push(
                <Circle
                    key={'pointIndex: ' + index}
                    cx={pointCoordinateData[ index ].cx }
                    cy={pointCoordinateData[ index ].cy}
                    r={3}
                    fill="#c4c2a7"
                />
            );
        }

        return pointData;
    }


    static splitStringToTSpan( string, squareSize, strokeWidth, line_width, fontSize, lineInterval ) {
        const contentArray = [];

        if ( !string ) {
            return contentArray;
        }

        const dataArray = string.split( ' ' );
        let tmpText = '';
        for ( let index = 0; index < dataArray.length; index++ ) {

            if ( tmpText.length + dataArray[ index ].length > line_width ) {
                if ( tmpText.length <= 0 ) {
                    tmpText = dataArray[ index ];
                } else {
                    index--;
                }

                contentArray.push( tmpText );
                tmpText = '';
            } else {
                if ( tmpText.length > 0 ) {
                    tmpText += ' ';
                }

                tmpText += dataArray[ index ];
            }
        }

        if ( tmpText.length > 0 ) {
            contentArray.push( tmpText );
        }

        const startY = squareSize / 2 - (contentArray.length * fontSize + (contentArray.length - 1) * lineInterval) / 2 - 4;

        const spanArray = [];
        let dy = 0;
        for ( let index = 0; index < contentArray.length; index++ ) {
            spanArray.push(
                <TSpan
                    key={"tspan" + contentArray[ index ]}
                    x={'' + (strokeWidth + 20) }
                    y={'' + (startY + dy) }
                >
                    {contentArray[ index ]}
                </TSpan>
            );

            dy += fontSize;

            if ( index < contentArray.length - 1 ) {
                dy += lineInterval;
            }
        }


        return {
            spanArray: spanArray,
            height: dy
        };
    }

    renderSectorItem( squareSize,
                      strokeWidth, index, item, count, rotateAngle ) {
        const radius = (squareSize - 2 * strokeWidth) / 2;
        const angle = 360 / count;
        const radian = angle * Math.PI / 180;


        const halfRadian = radian / 2;

        const halfAngleSin = Math.sin( halfRadian );
        const halfAngleCos = Math.cos( halfRadian );

        let data = 'M' + squareSize / 2 + ' ' + squareSize / 2;
        data += ' ' + 'L' + (squareSize / 2 - halfAngleCos * radius) + ' ' + (squareSize / 2 + halfAngleSin * radius);
        data += ' ' + 'A' + radius + ',' + radius + " 0 0,1 " + (squareSize / 2 - halfAngleCos * radius) + "," + (squareSize / 2 - halfAngleSin * radius) + " Z";
        data += ' ' + 'L' + squareSize / 2 + ' ' + squareSize / 2;

        const {
            spanArray,
            height
        } = LuckyWheelComponent.splitStringToTSpan( item.name, squareSize, strokeWidth, 7, 12, 2 );


        return (
            <G
                key={"sectorItem: " + item.name}
                rotate={"" + rotateAngle}
                origin={"" + squareSize / 2 + ", " + squareSize / 2}
            >
                <Path
                    d={data}
                    fill={this.props.colorsData[ index % this.props.colorsData.length ]}
                    stroke={this.props.colorsData[ index % this.props.colorsData.length ]}
                />

                <Text x={"" + ( strokeWidth + 20)}
                      y={"" + ( squareSize / 2 - height / 2 )}
                      fill="#ffffff"
                >
                    {
                        spanArray
                    }
                </Text>
            </G>
        );
    }

    renderAllSector( squareSize,
                     strokeWidth ) {
        const sectorData = [];
        for ( let index = 0; index < this.state.data.length; index++ ) {
            sectorData.push(
                this.renderSectorItem(
                    squareSize,
                    strokeWidth,
                    index,
                    this.state.data[ index ],
                    this.state.data.length,
                    360 / this.state.data.length * index + 90
                )
            );
        }

        return sectorData;
    }

    render() {
        const squareSize = this.props.squareSize ? this.props.squareSize : 200;
        const strokeWidth = 14;

        let interpolatedAnimation = this.state.animatedValue.interpolate( {
            inputRange: [ 0, LuckyWheelComponent.maxValue ],
            outputRange: [ "" + this.state.startDegree + "deg", "" + this.state.endDegree + "deg" ]
        } );

        //noinspection JSCheckFunctionSignatures
        return (
            <View style={styles.container}>
                <View>
                    <View style={[ { marginTop: 31 } ]}>
                        <Animated.View style={[
                            {
                                width: squareSize,
                                height: squareSize,
                            },
                            {
                                transform: [
                                    { rotate: interpolatedAnimation },
                                    // { translateY: this.state.animatedValue }
                                ]
                            }
                        ]}>
                            <Svg
                                style={[ {} ]}
                                height={(squareSize)}
                                width={(squareSize )}
                            >
                                <Circle
                                    cx={squareSize / 2 }
                                    cy={squareSize / 2}
                                    r={squareSize / 2 - strokeWidth / 2}
                                    stroke="white"
                                    strokeWidth={'' + strokeWidth}
                                    fill="gray"
                                />

                                {
                                    LuckyWheelComponent.renderPointOnBorder( squareSize, strokeWidth )
                                }

                                {
                                    this.renderAllSector( squareSize,
                                        strokeWidth )
                                }

                                <Circle
                                    cx={squareSize / 2 }
                                    cy={squareSize / 2}
                                    r={squareSize / 2 - strokeWidth - 5}
                                    stroke="white"
                                    strokeWidth={1}
                                    fillOpacity="0"
                                />
                            </Svg>
                        </Animated.View>

                        <TouchableOpacity style={[
                            {
                                position: 'absolute',
                                left: (squareSize - 70) / 2,
                                top: (squareSize - 70) / 2,
                                borderRadius: 35,
                                backgroundColor: 'white',
                                height: 70,
                                width: 70,
                            },
                        ]}
                                          onPress={() => {
                                              this.start();
                                          }}>
                            <Image
                                style={{
                                    width: 70,
                                    height: 70
                                }}
                                source={require( '../../../imgs/wheel_middle_spin.png' )}
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[ { position: 'absolute', left: (squareSize - 25) / 2 }, commonStyles.justAlignCenter, ]}
                    >
                        <Image
                            style={{
                                width: 25,
                                height: 26
                            }}
                            source={require( '../../../imgs/wheel_pointer_1.png' )}
                        />
                        <Image
                            style={{
                                width: 5,
                                height: 18,
                                marginTop: -5
                            }}
                            source={require( '../../../imgs/wheel_pointer_2.png' )}
                        />
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container: {},
    }
);
export default LuckyWheelComponent;