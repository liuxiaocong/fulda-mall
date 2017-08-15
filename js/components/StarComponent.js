/**
 * Created by xiechao on 24/4/17.
 */


import React from "react";

import { StyleSheet, View } from "react-native";
import StarRating from "react-native-star-rating";

class StarComponent extends React.Component {
    static propTypes = {
        style: View.propTypes.style,
        starCount: React.PropTypes.number.isRequired,
    };

    constructor( props ) {
        super( props );


        this.state = {
            starCount: this.props.starCount
        };
    }


    componentWillReceiveProps( nextProps ) {
        this.setState( {
            starCount: nextProps.starCount,
        } );
    }

    render() {
        return (
            <View
                style={[ this.props.style ]}>
                <StarRating
                    disabled={true}
                    emptyStar={'md-star-outline'}
                    fullStar={'md-star'}
                    halfStar={'md-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={this.state.starCount}
                    starColor={'#00beff'}
                    starSize={16}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

export default StarComponent;
