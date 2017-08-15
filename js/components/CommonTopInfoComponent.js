import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import commonStyles from "../styles/commonStyles";

class CommonTopInfoComponent extends React.Component {

    static propTypes = {
        onLeft: React.PropTypes.func,
        onRight: React.PropTypes.func,
        title: React.PropTypes.string,
        leftStr: React.PropTypes.string,
        rightStr: React.PropTypes.string,
        style: View.propTypes.style,
        titleStyle: View.propTypes.style,
        leftStyle: View.propTypes.style,
        rightStyle: View.propTypes.style
    };

    constructor( props ) {
        super( props );
        this.state = {
            onLeft: () => {
            },
            onRight: () => {
            },
        };
    }

    render() {
        return (
            <View style={[ commonStyles.top_info, this.props.style ]}>
                {this.props.leftStr &&
                <TouchableOpacity onPress={() => this.props
                    .onLeft()}>
                    <Text style={[ commonStyles.top_info_left_btn, this.props.leftStyle ]}>
                        {this.props.leftStr}
                    </Text>
                </TouchableOpacity>
                }
                <Text style={[ commonStyles.top_info_title, this.props.titleStyle ]}>
                    {this.props.title}
                </Text>

                {this.props.rightStr && <TouchableOpacity onPress={() => this.props.onRight()}>
                    <Text style={[ commonStyles.top_info_right_btn, this.props.rightStyle ]}>
                        {this.props.rightStr}
                    </Text>
                </TouchableOpacity>
                }
            </View>
        );
    }
}

export default CommonTopInfoComponent;
