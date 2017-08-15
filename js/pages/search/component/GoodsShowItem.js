import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import constStyles from "../../../styles/constStyles";
import commonStyles from "../../../styles/commonStyles";
import { connect } from "react-redux";
import Util from "../../../util/Util";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class GoodsShowItem extends React.Component {
    static propTypes = {
        goods: React.PropTypes.object.isRequired,
        location: React.PropTypes.object,
        containerStyle: View.propTypes.style,
        imageHeight: React.PropTypes.number.isRequired,
        index: React.PropTypes.number,
        tag: React.PropTypes.string,
    };

    constructor( props ) {
        super( props );
    }

    render() {
        if ( this.props.index === 20 ) {
            console.log( 'this.props.index === 20' );
        }

        //noinspection JSSuspiciousNameCombination
        return (
            <TouchableOpacity style={[
                this.props.containerStyle,
                {
                    borderRadius: 4,
                    backgroundColor: 'white',
                    height: this.props.imageHeight + 55,
                    marginBottom: 1,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0.5,
                        height: 0.5,
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.2
                },
            ]}
                              underlayColor='#ddd'
                              onPress={() => {
                                  this.props.navigation.navigate( 'goodsDetailPage', {
                                      data: this.props.goods,
                                      dataId: this.props.goods.id,
                                      location: this.props.location
                                  } );
                              }}>
                <View>
                    <View style={[ {
                        height: this.props.imageHeight,
                        flexDirection: 'column'
                    } ]}>

                        <View
                            style={[ {
                                flex: 1,
                                width: this.props.imageHeight,
                                height: this.props.imageHeight,
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                                overflow: 'hidden',
                            }
                            ]}>

                            <ImageWithPlaceHolder
                                style={{
                                    flex: 1,
                                    width: this.props.imageHeight,
                                    height: this.props.imageHeight,
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                } }
                                placeholderForIcon={'md-image'}
                                source={this.props.goods.logo ? { uri: this.props.goods.logo } : null}
                            />
                        </View>


                    </View>

                    <View style={[
                        {
                            height: 54,
                            justifyContent: 'center',
                            paddingLeft: 11,
                            paddingRight: 5
                        },
                    ]}>
                        <Text
                            style={[ { fontSize: 13 }, commonStyles.commonTextColorStyle ]}
                            numberOfLines={1}>{this.props.tag ? this.props.tag + ': ' + this.props.goods.name : this.props.goods.name}</Text>
                        <Text style={[ {
                            fontSize: 13,
                            color: constStyles.THEME_COLOR,
                            marginTop: 10,
                            fontWeight: 'bold'
                        } ]}
                              numberOfLines={1}>{Util.getShowPrice( this.props.goods.displayCurrency, this.props.goods.displayPrice )}</Text>
                    </View>
                </View>


            </TouchableOpacity>
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
    }
} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn }
}
export default  connect( select )( GoodsShowItem );
