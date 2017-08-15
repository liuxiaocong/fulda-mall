import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import commonStyles from "../../styles/commonStyles";
import ShopList from "./component/ShopList";
import I18n from "../../I18n";
import Keys from "../../configs/Keys";
import constStyles from "../../styles/constStyles";


class SearchShopPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.business_list ),
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            baseQueryData: this.props.navigation.state.params.baseQueryData,
            data: this.props.navigation.state.params.data,
            location: this.props.navigation.state.params.location,
            hasMoreData: this.props.navigation.state.params.hasMoreData
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <View
                style={[
                    commonStyles.wrapper, commonStyles.commonBG
                ]}>

                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />
                {/*<Text>*/}
                {/*{"ids:"+JSON.stringify(this.props.favoriteIds)}*/}
                {/*</Text>*/}
                <ShopList {...this.props}
                          getSearchHeader={() => {
                              return null;
                          }}
                          baseQueryData={this.state.baseQueryData}
                          location={this.state.location}
                          isNeedRefreshData={() => {
                              if ( this.state.isNeedRefreshData ) {
                                  this.setState( {
                                      isNeedRefreshData: false
                                  } );

                                  return true;
                              }

                              return false;
                          }}
                          hasMoreData={this.state.hasMoreData}
                          currentPageNum={0}
                          data={this.state.data}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {
        favoriteShopIds: store.userStore.favoriteShopIds
    }
}

export default  connect( select )( SearchShopPage );
