import React, { PropTypes } from "react";

import Icon from "react-native-vector-icons/Ionicons";
import dismissKeyboard from "react-native/Libraries/Utilities/dismissKeyboard";
import Button from "react-native-button";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import constStyles from "../styles/constStyles";
import commonStyles from "../styles/commonStyles";
import I18n from "../I18n";
import Keys from "../configs/Keys";

class SearchBar extends React.Component {

    static propTypes = {
        returnKeyType: PropTypes.string,
        onSearchChange: PropTypes.func,
        onEndEditing: PropTypes.func,
        onSubmitEditing: PropTypes.func,
        onClose: PropTypes.func,
        onStartSearch: PropTypes.func,
        onlyShow: PropTypes.bool,
        autoFocus: PropTypes.bool,
        placeholder: PropTypes.string,
        style: View.propTypes.style,
    };

    static defaultProps = {
        onSearchChange: ( text ) => {
        },
        onEndEditing: ( text ) => {
        },
        onSubmitEditing: ( text ) => {
        },
        onClose: () => {

        },
        onStartSearch: () => {

        },

        returnKeyType: "search",
        onlyShow: false,
        autoFocus: false,
        placeholder: 'Search'
    };

    constructor( props ) {
        super( props );
        this.state = {
            isOnFocus: false,
            text: ''
        };
        this._onFocus = this._onFocus.bind( this );
        this._onBlur = this._onBlur.bind( this );
        this._onClose = this._onClose.bind( this );
        this._onSearchChange = this._onSearchChange.bind( this );
        this._onEndEditing = this._onEndEditing.bind( this );
        this._onSubmitEditing = this._onSubmitEditing.bind( this );
    }

    setTextWithSubmit( text ) {
        this._textInput.setNativeProps( { text: text } );
        if ( text !== this.state.text ) {
            this.setState( { text: text } );
        }
        this._textInput.blur();

        if ( this.props.onSearchChange ) {
            this.props.onSearchChange( text );
        }

        if ( this.props.onSubmitEditing ) {
            this.props.onSubmitEditing( text );
        }
    }

    blur() {
        this._textInput.blur();
    }


    _onClose() {
        SearchBar._dismissKeyboard();

        if ( this.props.onClose ) {
            this.props.onClose();
        }
    }

    _onFocus() {
        this.setState( { isOnFocus: true } );
        if ( this.props.onFocus ) {
            this.props.onFocus();
        }
    }

    _onBlur() {
        this.setState( { isOnFocus: false } );
        if ( this.props.onBlur ) {
            this.props.onBlur();
        }
        SearchBar._dismissKeyboard();
    }

    static _dismissKeyboard() {
        dismissKeyboard()
    }

    _onSearchChange( text ) {
        if ( text !== this.state.text ) {
            this.setState( { text: text } );
        }

        if ( this.props.onSearchChange ) {
            this.props.onSearchChange( text );
        }
    }

    _onEndEditing() {
        if ( this.props.onEndEditing ) {
            this.props.onEndEditing( this.state.text );
        }
    }

    _onSubmitEditing() {
        if ( this.props.onSubmitEditing ) {
            this.props.onSubmitEditing( this.state.text );
        }
    }

    render() {
        const {
            returnKeyType,
        } = this.props;

        return (
            <View
                onStartShouldSetResponder={SearchBar._dismissKeyboard}
                style={[
                    {
                        flexDirection: 'row',
                        height: 30,
                        alignItems: 'center',
                    },
                    this.props.style
                ]}
            >

                <View
                    style={
                        [
                            commonStyles.commonBG,
                            {
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 15,
                                paddingLeft: 16,
                                paddingRight: 16,
                                height: 30
                            },

                        ]
                    }
                >

                    <View
                        style={[
                            {
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                alignItems: 'center',
                            },
                        ]}>


                        <TextInput
                            autoCorrect={false}
                            ref={( c ) => (this._textInput = c)}
                            returnKeyType={returnKeyType}
                            onFocus={this._onFocus}
                            onBlur={this._onBlur}
                            onChangeText={this._onSearchChange}
                            onEndEditing={this._onEndEditing}
                            onSubmitEditing={this._onSubmitEditing}
                            underlineColorAndroid="transparent"
                            placeholder={this.state.isOnFocus ? this.props.placeholder : ""}
                            placeholderTextColor={constStyles.STYLES_PLACE_HOLDER_TEXT_COLOR}
                            defaultValue={this.state.text}
                            autoFocus={this.props.autoFocus}
                            style={[
                                {
                                    flex: 1,
                                    fontSize: 13,
                                    padding: 0,
                                    alignItems: 'center',
                                    height: 30
                                },
                                commonStyles.commonTextColorStyle
                            ]}
                        />
                    </View>


                    {(!this.state.isOnFocus && this.state.text.length <= 0) ?
                        <View style={[ {
                            position: 'absolute',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 16,
                            paddingRight: 16,
                            flexDirection: 'row',
                            left: 0,
                            right: 0
                        } ]}
                              pointerEvents="none"
                        >
                            <Icon
                                name={'md-search'} size={14}
                                color={'#d8d8d8'}
                            />
                            <Text style={[ {
                                fontSize: 13,
                                color: '#d8d8d8',
                                marginLeft: 8,
                            } ]} numberOfLines={1}>
                                {this.props.placeholder}
                            </Text>

                        </View>
                        :
                        null
                    }

                    {(this.props.onlyShow) ?
                        <TouchableOpacity style={[ {
                            position: 'absolute',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 16,
                            paddingRight: 16,
                            flexDirection: 'row',
                            left: 0,
                            right: 0,
                            height: 30
                        } ]}
                                          onPress={() => {
                                              if ( this.props.onStartSearch ) {
                                                  this.props.onStartSearch();
                                              }
                                          }
                                          }
                        />
                        :
                        null
                    }


                </View>

                {this.props.onlyShow === false ?

                    <Button
                        style={[
                            {
                                fontSize: 13,
                                color: constStyles.THEME_COLOR,
                                marginLeft: 15
                            }
                        ]}
                        onPress={this._onClose} title="">
                        { I18n.t( Keys.cancel )}
                    </Button>

                    : null
                }
            </View>
        );
    }
}

export default SearchBar;