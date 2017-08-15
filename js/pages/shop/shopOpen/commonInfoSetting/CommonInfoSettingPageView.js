import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "react-native-button";
import commonStyles from "../../../../styles/commonStyles";
import I18n from "../../../../I18n";
import * as UtilConfig from "../../../../configs/UtilConfig";
import Keys from "../../../../configs/Keys";

const styles = StyleSheet.create( {} );
class CommonInfoSettingPageView extends React.Component {

    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params.title + "",
            headerRight: (
                <Button
                    style={commonStyles.top_info_right_btn}
                    title=''
                    onPress={() => {
                        state.params.onTapSave()
                    }}
                >
                    {I18n.t( Keys.save )}
                </Button>
            ),
        };
    };

    constructor( props ) {
        super( props );

        let navState = this.props.navigation.state;

        this.state = {
            defaultVal: navState.params.defaultVal,
            placeholderVal: navState.params.placeholderVal,
            callback: navState.params.callback,
            targetVal: navState.params.defaultVal,
            keyboardType: navState.params.keyboardType,
            maxLength: navState.params.maxLength,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams( { onTapSave: this.onTapSave.bind( this ) } );
    }

    componentWillUnmount() {
    }

    onTapSave() {
        this._textInput.blur();

        if ( this.state.callback instanceof Function ) {
            this.state.callback( this.state.targetVal );
            this.props.navigation.goBack();
        }
    };


    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.paddingCommon, { backgroundColor: 'white' } ]}>
                <TextInput
                    ref={( textInput ) => {
                        this._textInput = textInput;
                    }}
                    style={[ commonStyles.commonInput ]}
                    defaultValue={this.state.defaultVal}
                    underlineColorAndroid={'transparent'}
                    maxLength={this.state.maxLength ? this.state.maxLength : UtilConfig.MAX_LENGTH.DEFAULT}
                    autoFocus={true}
                    keyboardType={this.state.keyboardType ? this.state.keyboardType : "default"}
                    placeholder={this.state.placeholderVal}
                    onChangeText={
                        ( text ) => {
                            this.setState( { targetVal: text } )
                        }
                    }
                    returnKeyType={'done'}
                    returnKeyLabel={I18n.t( Keys.done )}
                    onSubmitEditing={this
                        .onTapSave
                        .bind( this )}
                />
            </View>
        )

    }
}

export default CommonInfoSettingPageView;
