import React, { PropTypes } from "react";
import { Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import commonStyles from "../styles/commonStyles";

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
    ionIcon: PropTypes.string
};

const CommonIconTab = ( props ) => (
    <View style={[ commonStyles.wrapper, commonStyles.justAlignCenter ]}>
        <Ionicons
            name={props.ionIcon}
            size={30}
            color={props.selected
                ? 'rgb(59,89,152)'
                : 'rgb(204,204,204)'}/>

        <Text
            size={10}
            style={{
                color: props.selected
                    ? 'red'
                    : 'black'
            }}>
            {props.title}
        </Text>

    </View>
);

CommonIconTab.propTypes = propTypes;

export default CommonIconTab;
