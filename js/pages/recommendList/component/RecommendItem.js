import React from "react";

import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import I18n from "../../../I18n";
import commonStyles from "../../../styles/commonStyles";
import Keys from "../../../configs/Keys";

class RecommendItem extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        isOpen: React.PropTypes.bool.isRequired,
        isTitle: React.PropTypes.bool.isRequired,
        isSupportChildren: React.PropTypes.bool.isRequired,
        onOpenChanged: React.PropTypes.func.isRequired,
    };

    constructor( props ) {
        super( props );
    }


    render() {
        //noinspection JSCheckFunctionSignatures
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => {
                    if ( this.props.isSupportChildren ) {
                        if ( this.props.isTitle ) {
                            if ( this.props.onOpenChanged ) {
                                this.props.onOpenChanged();
                            }
                        } else {
                            this.props.navigation.navigate(
                                'recommendListPage',
                                {
                                    owner: this.props.data,
                                    sectionsData: this.props.data.allData,
                                    isSupportChildren: false,
                                } );
                        }
                    }
                }}
                style={[ {
                    paddingLeft: 14,
                    paddingRight: 14,
                    height: 48,
                    backgroundColor: (this.props.isSupportChildren && this.props.isTitle) ? (this.props.isOpen ? '#f1f6f8' : 'white') : 'white'
                }, commonStyles.commonBorderBottom ]}>
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: this.props.isTitle ? 0 : 14
                        },
                        commonStyles.wrapper,
                    ]}>

                    <Text
                        style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            flex: 1
                        }}
                        numberOfLines={1}
                    >
                        {this.props.data.content.memberName + " (" + this.props.data.content.memberUsername + ")"}
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: '#3e3c43',
                            marginLeft: 10,
                            marginRight: 10,
                        }}>
                        {this.props.data.content.memberClassText}
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: '#3e3c43',
                        }}>
                        {I18n.t( Keys.people_count ) + ": " + this.props.data.content.downMemberCount}
                    </Text>


                    {
                        this.props.isSupportChildren ?
                            <Image
                                style={{
                                    width: 8,
                                    height: 13,
                                    marginLeft: 10,
                                    transform: [ { rotate: this.props.isOpen ? '90deg' : '0deg' } ]
                                }}
                                source={require( '../../../imgs/ic_right_arrow.png' )}/>
                            :
                            null
                    }


                </View>
            </TouchableHighlight>
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

export default  RecommendItem;