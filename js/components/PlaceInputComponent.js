import React from "react";
import { FlatList, Text, TextInput, TouchableHighlight, View } from "react-native";
import RNGooglePlaces from "react-native-google-places";
import I18n from "../I18n";
import Keys from "../configs/Keys";
import commonStyles from "../styles/commonStyles";


class PlaceInputComponent extends React.Component {
    static propTypes = {
        text: React.PropTypes.string,
        placeholder: React.PropTypes.string.isRequired,
        maxLength: React.PropTypes.number.isRequired,
        style: View.propTypes.style,
        onChangeText: React.PropTypes.func.isRequired,
        onSubmitEditing: React.PropTypes.func.isRequired,
    };

    constructor( props ) {
        super( props );

        this.state = {
            text: this.props.text ? this.props.text : null,
            placeholder: this.props.placeholder,
            maxLength: this.props.maxLength,
            autoCompletePredictions: null,
            data: [],
            autoCompletePredictionsKeyword: '',
        };
    }


    shouldComponentUpdate( nextProps, nextState ) {
        if ( nextState.autoCompletePredictionsKeyword.length > 0 ) {
            if ( this.state.autoCompletePredictionsKeyword !== nextState.autoCompletePredictionsKeyword ) {
                this.getAutocompletePredictions( nextState.autoCompletePredictionsKeyword );
            }
        }

        return true;
    }


    getAutocompletePredictions( keyword ) {
        RNGooglePlaces.getAutocompletePredictions( keyword )
            .then(
                ( results ) => {
                    if ( keyword === this.state.autoCompletePredictionsKeyword ) {
                        this.setState( { data: results } );
                    }
                }
            )
            .catch(
                ( error ) => {
                    console.log( 'RNGooglePlaces.getAutocompletePredictions error = ' + error.message );
                    if ( keyword === this.state.autoCompletePredictionsKeyword ) {
                        this.setState( { data: [] } );
                    }
                }
            );
    }


    lookUpPlace( autoCompletePredictions, callback ) {
        if ( autoCompletePredictions !== null ) {
            RNGooglePlaces.lookUpPlaceByID( autoCompletePredictions.placeID )
                .then(
                    ( results ) => {
                        callback( results );
                    }
                )
                .catch(
                    ( error ) => {
                        console.log( 'RNGooglePlaces.lookUpPlaceByID error = ' + error.message );
                        callback( null );
                    }
                );
        } else {
            callback( null );
        }
    };


    blur() {
        this._textInput.blur();
    }

    renderItem( { item, index } ) {
        return (
            <TouchableHighlight
                style={[
                    commonStyles.wrapper,
                    {
                        height: 44,
                        backgroundColor: 'white',
                    }
                ]}
                underlayColor='#ddd'
                onPress={() => {
                    this._textInput.blur();

                    this.setState( {
                        text: item.primaryText,
                        autoCompletePredictions: item,
                        data: [],
                        autoCompletePredictionsKeyword: ''
                    } );

                    if ( this.props.onChangeText ) {
                        this.props.onChangeText( item.primaryText, item );
                    }
                }}>
                <View
                    style={[
                        commonStyles.wrapper, {
                            justifyContent: 'center'
                        }
                    ]}>
                    <Text style={[ commonStyles.commonTextColorStyle, {
                        fontSize: 14,
                        paddingLeft: 14,
                        paddingRight: 14,
                    } ]}>
                        {item.primaryText}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        const separatorHeight = 1;
        const viewHeight = 44;

        return (
            <View style={[ this.props.style, ]}>
                <View style={[ {
                    height: 40,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                } ]}>
                    <TextInput
                        ref={( textInput ) => {
                            this._textInput = textInput;
                        }}
                        style={[ commonStyles.commonInput, commonStyles.wrapper ]}
                        underlineColorAndroid={'transparent'}
                        autoFocus={true}
                        placeholder={this.state.placeholder}
                        onChangeText={
                            ( text ) => {
                                this.setState( {
                                    name: text,
                                    autoCompletePredictionsKeyword: text,
                                    data: text.length <= 0 ? [] : this.state.data
                                } );

                                if ( this.props.onChangeText ) {
                                    this.props.onChangeText( text, null );
                                }
                            }
                        }
                        defaultValue={this.state.text}
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        maxLength={this.state.maxLength}
                        onSubmitEditing={() => {
                            if ( this.props.onSubmitEditing ) {
                                this.props.onSubmitEditing();
                            }
                        }}
                    />

                </View>


                {
                    this.state.data !== null && this.state.data.length > 0 ?
                        <View style={[ {
                            borderColor: '#e7e7e7',
                            borderWidth: 1,
                            height: 157,
                            backgroundColor: 'white'
                        } ]}>
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                data={this.state.data}
                                keyExtractor={( item, index ) => {
                                    return index;
                                }}
                                renderItem={ this.renderItem.bind( this ) }
                                ItemSeparatorComponent={() => {
                                    return <View style={[ commonStyles.commonIntervalStyle ]}/>
                                }}
                                getItemLayout={( data, index ) => (
                                    { length: viewHeight, offset: (viewHeight + separatorHeight) * index, index }
                                )}
                            />
                        </View>
                        :
                        null
                }

            </View>
        )
    }
}
export default PlaceInputComponent;