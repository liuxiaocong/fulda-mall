import React from "react";

import { ActivityIndicator, Dimensions } from "react-native";


class LoadingMoreItem extends React.Component {
    static propTypes = {
        waiting: React.PropTypes.bool.isRequired,
    };

    constructor( props ) {
        super( props );
    }

    render() {
        return (
            this.props.waiting ?
                <ActivityIndicator style={[ { width: Dimensions.get( 'window' ).width, height: 40 } ]}/>
                :
                null
        );
    }
}

export default LoadingMoreItem;
