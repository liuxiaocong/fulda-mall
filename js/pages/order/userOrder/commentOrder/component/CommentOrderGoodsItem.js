import React from "react";

import { Image, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { RadioButtons } from "react-native-radio-buttons";
import Toast from "react-native-root-toast";
import I18n from "../../../../../I18n";
import commonStyles from "../../../../../styles/commonStyles";
import constStyles from "../../../../../styles/constStyles";
import Util from "../../../../../util/Util";
import * as UtilConfig from "../../../../../configs/UtilConfig";
import Keys from "../../../../../configs/Keys";
import ImageWithPlaceHolder from "../../../../../components/ImageWithPlaceHolder";

class CommentOrderGoodsItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        onCommentUpdate: React.PropTypes.func,
        onCommentTypeUpdate: React.PropTypes.func,
    };

    constructor( props ) {
        super( props );
        this.state = {
            data: props.data,
            commentType: UtilConfig.DEFAULT_GOODS_COMMENT_TYPE
        }
    }

    render() {
        let goodsOrder = this.state.data;
        let goods = goodsOrder.goods;
        let id = goods.id;
        let attribute = goodsOrder.attributes;
        let selectedOption = null;
        //noinspection JSCheckFunctionSignatures
        const options = [
            { title: I18n.t( Keys.good ), image: require( '../../../../../imgs/good_comment.png' ), value: 1 },
            { title: I18n.t( Keys.normal ), image: require( '../../../../../imgs/normal_comment.png' ), value: 0 },
            { title: I18n.t( Keys.bad ), image: require( '../../../../../imgs/bad_comment.png' ), value: -1 },
        ];
        return (
            <View style={[ commonStyles.commonBorderBottom,
                {
                    height: 181,
                    backgroundColor: '#fff',
                }
            ]}>
                <View style={
                    {
                        height: 120,
                        flex: 1,
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        alignItems: 'center'
                    }
                }>
                    <ImageWithPlaceHolder
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 4
                        } }
                        placeholderForIcon={'md-image'}
                        source={goods.logo ? { uri: goods.logo } : null}
                    />
                    <View style={
                        {
                            flex: 1,
                            height: 100,
                            marginLeft: 10,
                            marginRight: 10,
                            justifyContent: 'flex-start'
                        }
                    }>
                        <Text
                            style={
                                {
                                    color: '#717789',
                                    fontSize: 13
                                }
                            }
                            numberOfLines={2}>
                            {goods.name}
                        </Text>
                        {
                            goodsOrder.attributes &&
                            <Text style={
                                {
                                    marginTop: 5
                                }
                            } numberOfLines={1}>
                                <Text style={
                                    {
                                        fontWeight: 'bold',
                                        color: '#3e3c43'
                                    }
                                }>
                                    {I18n.t( Keys.attributes ) + ": "}
                                </Text>
                                <Text style={
                                    {
                                        color: '#717789',
                                        fontSize: 13
                                    }
                                }>
                                    {goodsOrder.attributes + ""}
                                </Text>
                            </Text>
                        }
                        <RadioButtons
                            options={ options }
                            onSelection={ this.setSelectedOption}
                            selectedOption={selectedOption }
                            renderOption={ this.renderOption }
                            renderContainer={ this.renderContainer }
                        />
                        {/*<Text>Selected option: {this.state.commentType + "" || 'none'}</Text>*/}
                    </View>
                </View>
                <View style={
                    {
                        height: 60,
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }
                }>
                    <Text style={
                        {
                            fontWeight: 'bold',
                            color: constStyles.THEME_COLOR,
                            marginLeft: 10,
                            fontSize: 13,
                            width: 100,
                            marginTop: 5,
                            textAlign: 'left'
                        }
                    }>
                        {/*{I18n.t( Keys.my_comment ) + ": "}*/}
                    </Text>
                    <TextInput
                        ref={( textInput ) => {
                            this._textInput = textInput;
                        }}
                        multiline={true}
                        numberOfLines={2}
                        style={[ commonStyles.commonInput, {
                            height: 50,
                            padding: 5,
                            color: '#3e3c43',
                            fontSize: 12,
                            borderColor: '#ddd',
                            borderRadius: 3,
                            borderWidth: Util.getDpFromPx( 1 ),
                            backgroundColor: '#fff',
                            marginLeft: 3,
                            marginRight: 10,
                            flexGrow: 1
                        } ]}
                        placeholderTextColor={'#717789'}
                        placeholder={I18n.t( Keys.plz_input_comment )}
                        underlineColorAndroid={'transparent'}
                        keyboardType={this.state.keyboardType ? this.state.keyboardType : "default"}
                        onChangeText={
                            ( text ) => {
                                if ( this.props.onCommentUpdate ) {
                                    this.props.onCommentUpdate( id, attribute, text );
                                }
                                this.setState( { comment: text } )
                            }
                        }
                        returnKeyType={'done'}
                        returnKeyLabel={I18n.t( Keys.done )}
                        onSubmitEditing={this
                            .onSaveComment
                            .bind( this )}
                    />
                </View>
            </View>
        );
    }

    onSaveComment = () => {
        Toast.show( "onSaveComment" )
    };

    renderOption = ( option, selected, onSelect, index ) => {
        let isSelect = (option.value === this.state.commentType);
        return (
            <TouchableWithoutFeedback onPress={onSelect} key={index}>
                <View style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 12
                    }
                }>
                    <Image
                        style={{
                            width: 21,
                            height: 21,
                            marginRight: 3
                        }}
                        source={option.image}/>
                    <Text style={{
                        color: constStyles.ACTION_TITLE_COLOR,
                        fontSize: 12
                    }}>{option.title}</Text>
                    {
                        isSelect ?
                            <View style={
                                {
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginLeft: 4,
                                    borderColor: '#888',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }
                            }>
                                <View style={
                                    {
                                        width: 4,
                                        height: 4,
                                        backgroundColor: '#666',
                                        borderRadius: 2
                                    }
                                }/>
                            </View>
                            :
                            <View style={
                                {
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    marginLeft: 4,
                                    borderColor: '#999'
                                }
                            }/>


                    }
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderContainer = ( optionNodes ) => {
        return <View
            style={
                {
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: 5
                }
            }>{optionNodes}</View>;
    };

    setSelectedOption = ( selectedOption ) => {
        let goodsOrder = this.state.data;
        let id = goodsOrder.goods.id;
        let attribute = goodsOrder.attributes;
        if ( this.props.onCommentTypeUpdate ) {
            this.props.onCommentTypeUpdate( id, attribute, selectedOption.value );
        }
        this.setState( {
            commentType: selectedOption.value
        } );
    };

    componentDidMount() {
    }

    //End Mounting

    //Updating
    componentWillReceiveProps( nextProps ) {

    }

    //noinspection JSMethodCanBeStatic
    shouldComponentUpdate( nextProps, nextState ) {
        return true;
    }

    componentWillUpdate( nextProps, nextState ) {

    }

    componentDidUpdate( prevProps, prevState ) {

    }
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#0000007f'
    }
} );

export default CommentOrderGoodsItem;