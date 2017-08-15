import React from "react";

import { BackHandler, findNodeHandle, StyleSheet, View } from "react-native";
import constStyles from "../../../../../styles/constStyles";


class MaskViewGroupComponent2 extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            maskViewContent: null,
            maskViewContentMarginTop: 0,
            maskViewShown: false,
            viewRef: 0,
            isHasStateBar: true,
        };
    }

    componentDidMount() {
        console.log( "MainSearchPage componentDidMount() {" );

        BackHandler.addEventListener( 'hardwareBackPress', () => {
            if ( this.state.maskViewShown ) {

                this.setState( {
                    maskViewShown: false
                } );

                return true;
            }
            return false;
        } );
    }

    hideModalBox() {
        if ( this.state.maskViewShown ) {
            this.setState( {
                maskViewShown: false
            } );
        }
    }

    showModalBox( isHasStateBar, view, snapView, maskViewContent ) {
        if ( view === null ) {
            this.doShowModalBox( isHasStateBar, 0, snapView, maskViewContent );
        } else {
            view.measureLayout(
                findNodeHandle( snapView ),
                ( left,
                  top,
                  width,
                  height ) => {
                    console.log( 'view.measureLayout(' );

                    console.log( 'left: ' + left );
                    console.log( 'top: ' + top );
                    console.log( 'width: ' + width );
                    console.log( 'height: ' + height );

                    this.doShowModalBox( isHasStateBar, top + height, snapView, maskViewContent );
                },
                () => {
                }
            );
        }
    }

    doShowModalBox( isHasStateBar, maskViewContentMarginTop, snapView, maskViewContent ) {
        this.setState( {
            maskViewContent: maskViewContent,
            maskViewContentMarginTop: maskViewContentMarginTop,
            maskViewShown: true,
            isHasStateBar: isHasStateBar
        } );
    }


    render() {
        //
        return (
            this.state.maskViewShown ?
                <View style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: this.state.maskViewContentMarginTop + (this.state.isHasStateBar ? 0 : constStyles.STATE_BAR_HEIGHT),
                }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fffffff0',
                        }}
                    >
                        {this.state.maskViewContent}
                    </View>
                </View>
                :
                null
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0000007f'
    },
    blurView: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    },
} );

export default  MaskViewGroupComponent2;
