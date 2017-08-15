import React from "react";
import { Text, TextInput, View } from "react-native";
import constStyles from "../styles/constStyles";
import Util from "../util/Util";
import I18n from "../I18n";
import Keys from "../configs/Keys";

class AmountInputComponent extends React.Component {
    static propTypes = {
        onAmountChange: React.PropTypes.func.isRequired,
        style: View.propTypes.style,
        amountStr: React.PropTypes.string,
        currency: React.PropTypes.string.isRequired,
        returnKeyType: React.PropTypes.string,
        returnKeyLabel: React.PropTypes.string,
        onSubmitEditing: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        autoFocus: React.PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            style: this.props.style,
            amountStr: this.props.amountStr,
            currency: this.props.currency,
        };
    }


    componentWillReceiveProps( nextProps ) {
        this.setState( {
            style: nextProps.style,
            amountStr: nextProps.amountStr,
            currency: nextProps.currency,
        } );
    }

    blur() {
        this._textInput.blur();
    }

    focus() {
        this._textInput.focus();
    }

    render() {

        return (
            <View style={[ {
                height: 40,
                borderWidth: 1,
                borderColor: constStyles.THEME_COLOR,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12
            },
                this.props.style, ]}>
                <Text style={[ { fontSize: 14, color: constStyles.THEME_COLOR } ]}>
                    {Util.getDisplaySymbol( this.state.currency )}
                </Text>
                <TextInput
                    ref={( textInput ) => {
                        this._textInput = textInput;
                    }}
                    style={[ {
                        flex: 1,
                        color: constStyles.THEME_COLOR,
                        fontSize: 24,
                        padding: 0,
                        marginLeft: 14
                    } ]}
                    underlineColorAndroid={'transparent'}
                    autoFocus={this.props.autoFocus}
                    value={this.state.amountStr}
                    keyboardType="numeric"
                    placeholder={I18n.t( Keys.plz_input_amount )}
                    onChangeText={
                        ( text ) => {
                            if ( this.state.amountStr !== text ) {
                                this.setState( { amountStr: text } );

                                if ( this.props.onAmountChange ) {
                                    this.props.onAmountChange( text );
                                }
                            }
                        }
                    }
                    onFocus={() => {
                        if ( this.props.onFocus ) {
                            this.props.onFocus()
                        }
                    }}
                    returnKeyType={this.props.returnKeyType}
                    returnKeyLabel={this.props.returnKeyLabel}
                    onSubmitEditing={() => {
                        if ( this.props.onSubmitEditing ) {
                            this.props.onSubmitEditing();
                        }
                    }}
                />
            </View>
        )
    }
}
export default AmountInputComponent;