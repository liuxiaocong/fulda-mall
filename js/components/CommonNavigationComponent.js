import React from "react";
import { BackHandler, Dimensions, Image, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import commonStyles from "../styles/commonStyles";
import CommonNavigationMenuComponent from "../components/CommonNavigationMenuComponent";
import constStyles from "../styles/constStyles";


class CommonNavigationComponent extends React.Component {

    static propTypes = {
        menuData: React.PropTypes.array,
        onSelectMenu: React.PropTypes.func.isRequired
    };

    // Mounting
    constructor( props ) {
        super( props );

        this.state = {
            menuOpen: false,
        };
    }

    componentWillMount() {
        BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
    }

    _onBack() {
        if ( this.state.menuOpen ) {
            this.setState( {
                menuOpen: false
            } );

            return true;
        }
        return false;
    }

    render() {
        const viewWidth = Dimensions.get( 'window' ).width;
        //noinspection JSCheckFunctionSignatures
        return (
            <View style={[ commonStyles.wrapper, {
                position: 'absolute',
            } ]}>
                <LinearGradient
                    colors={[ '#000000', '#00000000' ]}
                    style={[ {
                        width: viewWidth,
                        height: 64,
                    } ]}/>
                <View style={[ commonStyles.wrapper, {
                    position: 'absolute',
                } ]}>

                    <View style={[ {
                        height: 47,
                        width: Dimensions.get( 'window' ).width,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: constStyles.STATE_BAR_HEIGHT
                    } ]}>
                        <TouchableHighlight
                            style={[
                                commonStyles.justAlignCenter,
                                styles.operation
                            ]}
                            underlayColor={constStyles.HOME_TAB_UNDERLAY_COLOR}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        >
                            <Image
                                ref={( icon ) => {
                                    this.tabIcons[ i ] = icon;
                                }}
                                style={[
                                    {
                                        width: 28,
                                        height: 28
                                    }
                                ]}
                                source={require( '../imgs/ic_navigation_w_back.png' )}
                            />
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={[
                                commonStyles.justAlignCenter,
                                styles.operation
                            ]}
                            underlayColor={constStyles.HOME_TAB_UNDERLAY_COLOR}
                            onPress={() => {
                                this.setState( {
                                    menuOpen: true
                                } );
                            }}
                        >
                            <Image
                                style={[
                                    {
                                        width: 28,
                                        height: 28
                                    }
                                ]}
                                source={require( '../imgs/ic_navigation_more.png' )}/>
                        </TouchableHighlight>
                    </View>

                    {this.state.menuOpen ?
                        <TouchableOpacity
                            style={[ {
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                position: 'absolute',
                                height: Dimensions.get( 'window' ).height
                            } ]}
                            onPress={() => {
                                this.setState( {
                                    menuOpen: false
                                } );
                            }}
                        >
                            <CommonNavigationMenuComponent menuData={this.props.menuData} onSelectMenu={( menu ) => {
                                this.setState( {
                                    menuOpen: false
                                } );

                                if ( this.props.onSelectMenu ) {
                                    this.props.onSelectMenu( menu );
                                }
                            }}/>

                        </TouchableOpacity>
                        :
                        null}

                </View>
            </View>
        )
            ;
    }
}


const styles = StyleSheet.create( {
    operation: {
        width: 28,
        height: 28,
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 14,
    }
} );


export default CommonNavigationComponent;


