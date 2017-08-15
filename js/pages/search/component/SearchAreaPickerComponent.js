import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import Button from "react-native-button";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";
const { height: deviceHeight } = Dimensions.get( "window" );
const styles = StyleSheet.create( {
    container: {}
} );
const { height, width } = Dimensions.get( 'window' );

class SearchAreaPickerComponent extends React.Component {
    static propTypes = {
        country: React.PropTypes.object,
        countryData: React.PropTypes.array,
        onChange: React.PropTypes.func.isRequired,
        onClose: React.PropTypes.func.isRequired,
        isOpen: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            oldSelect: this.props.country,
            selectCountry: this.props.country,
            data: this.props.countryData,
            db: this.props.countryData,
            isOpen: this.props.isOpen,
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps( nextProps ) {
        this.setState( {
            isOpen: nextProps.isOpen,
        } );
    }

    closeModal() {
        this.props.onClose();
        this.props.onChange( this.state.selectCountry );
        this.setState( {
            isOpen: false,
        } );
    }

    renderItem( { item, index } ) {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    const newArray = this.state.db.slice();

                    this.state.oldSelect = this.state.selectCountry;
                    this.state.selectCountry = item;

                    this.setState( {
                        data: newArray,
                        db: newArray,
                    } );
                }}
                style={[]}>

                <View style={[
                    commonStyles.wrapper,
                    {
                        height: 46,
                        flexDirection: 'row',
                    },
                    commonStyles.pdl_normal,
                    commonStyles.pdr_normal,
                    commonStyles.justAlignCenter
                ]}>
                    <Text style={[
                        {
                            fontSize: 14,
                            paddingLeft: 15,
                            paddingRight: 15,
                            color: item.code === this.state.selectCountry.code ? '#3e3c43' : '#c3c6d0'
                        }
                    ]}>
                        {item.name}
                    </Text>

                    <View style={[
                        {
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            flex: 1,
                            left: 0,
                            right: 0,
                            paddingLeft: 10,
                            paddingRight: 10
                        },
                    ]}>
                        {
                            item === this.state.selectCountry ?
                                <Image
                                    style={{
                                        width: 15,
                                        height: 10,
                                        right: 0
                                    }}
                                    source={require( '../../../imgs/ic_confirm.png' )}/> : null}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        let containViewHeight = 400;
        let viewHeight = 46;
        let realHeight = 40 + 40 + (46 * this.state.data.length);
        if ( realHeight < containViewHeight ) {
            containViewHeight = realHeight;
        }
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.isOpen}
                onRequestClose={() => {
                    this.props.onClose();
                }}
            >
                <TouchableOpacity style={[ {
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                } ]}
                                  onPress={() => {
                                      this.props.onClose();
                                  }}
                >

                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'white',
                        borderRadius: 5,
                        top: (height - containViewHeight) / 2,
                        bottom: (height - containViewHeight) / 2,
                        left: 63,
                        right: 63,
                        justifyContent: "center",
                        position: 'absolute'
                    }}>
                    <View style={[ {
                        height: 40,
                    }, commonStyles.justAlignCenter ]}>
                        <Text style={[ {
                            color: constStyles.THEME_COLOR,
                            fontSize: 14
                        }, ]}>{I18n.t( Keys.location_choose_title )}</Text>
                    </View>
                    <View style={[ commonStyles.commonIntervalStyle ]}/>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.data}
                        keyExtractor={( item, index ) => {
                            return index;
                        }}
                        renderItem={this.renderItem.bind( this )}
                        getItemLayout={( data, index ) => (
                            { length: viewHeight, offset: viewHeight * index, index }
                        )}
                    />


                    <Button
                        containerStyle={[
                            {
                                left: 0,
                                right: 0,
                                height: 40,
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                backgroundColor: constStyles.THEME_COLOR,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }
                        ]}
                        style={[ commonStyles.buttonContentStyle ]}
                        onPress={this
                            .closeModal
                            .bind( this )} title="">
                        {I18n.t( Keys.confirm )}
                    </Button>
                </View>
            </Modal>

        );
    }
}

export default  SearchAreaPickerComponent;
