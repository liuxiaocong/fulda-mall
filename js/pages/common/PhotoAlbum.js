import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";

class PhotoAlbum extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {};
    }

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <View style={[ commonStyles.wrapper ]}>
                <Text>
                    {I18n.t( Keys.photo_album )}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return { isLoggedIn: store.userStore.isLoggedIn, user: store.userStore.user, status: store.userStore.status, }
}

export default connect( select )( PhotoAlbum );
