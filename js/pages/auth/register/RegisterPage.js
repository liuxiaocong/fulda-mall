import React from "react";
import { StyleSheet, View } from "react-native";
import ViewPager from "react-native-viewpager";
import StepIndicator from "react-native-step-indicator";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import commonStyles from "../../../styles/commonStyles";
import RegisterPage1 from "./component/RegisterPage1";
import RegisterPage2 from "./component/RegisterPage2";
import RegisterPage3 from "./component/RegisterPage3";
import constStyles from "../../../styles/constStyles";
import I18n from "../../../I18n";
import Keys from "../../../configs/Keys";


const PAGES_1 = 'Page 1';
const PAGES_2 = 'Page 2';
const PAGES_3 = 'Page 3';
const PAGES = [ PAGES_1, PAGES_2, PAGES_3 ];

const thirdIndicatorStyles = {
    stepIndicatorSize: 27,
    currentStepIndicatorSize: 27,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: constStyles.THEME_COLOR,
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: constStyles.THEME_COLOR,
    stepStrokeUnFinishedColor: constStyles.THEME_COLOR,
    separatorFinishedColor: constStyles.THEME_COLOR,
    separatorUnFinishedColor: constStyles.THEME_COLOR,
    stepIndicatorFinishedColor: constStyles.THEME_COLOR,
    stepIndicatorUnFinishedColor: 'white',
    stepIndicatorCurrentColor: 'white',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: 'white',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#3e3c43cc',
    labelSize: 12,
    currentStepLabelColor: '#3e3c43cc'
};

class RegisterPage extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: I18n.t( Keys.register ),
        };
    };

    constructor( props ) {
        super( props );
        //noinspection JSCheckFunctionSignatures
        const dataSource = new ViewPager.DataSource( {
            pageHasChanged: ( p1, p2 ) => p1 !== p2
        } );

        let initialPage = 0;

        if ( this.props.user ) {
            if ( this.props.user.mobile && this.props.user.mobileVerified ) {
                initialPage = 1;
            }

            if ( this.props.user.idNo && this.props.user.idNo.length > 0 ) {
                initialPage = 2;
            }
        }

        //noinspection JSCheckFunctionSignatures
        this.state = {
            initialPage: initialPage,
            dataSource: dataSource.cloneWithPages( PAGES ),
            currentPage: 0
        }
    }

    render() {
        return (
            <View
                style={[ commonStyles.wrapper, commonStyles.pdt_normal, commonStyles.commonBorderTop, { backgroundColor: 'white' } ]}>
                <View style={[ {
                    marginTop: 8,
                    paddingLeft: 10,
                    paddingRight: 10
                }
                ]}>
                    <StepIndicator
                        stepCount={3}
                        customStyles={thirdIndicatorStyles}
                        currentPosition={this.state.currentPage}
                        labels={[ I18n.t( Keys.account_info ), I18n.t( Keys.base_info ), I18n.t( Keys.password_and_currency ) ]}/>
                </View>
                <ViewPager
                    locked={true}
                    ref={( viewPager ) => {
                        this._viewPager = viewPager;
                    }}
                    initialPage={this.state.initialPage}
                    renderPageIndicator={false}
                    dataSource={this.state.dataSource}
                    renderPage={this.renderViewPagerPage}
                    onChangePage={( page ) => {
                        this.setState( { currentPage: page } )
                    }}
                    style={[]}/>
            </View>
        );
    }

    renderViewPagerPage = ( data ) => {
        if ( data === PAGES_1 ) {
            return <RegisterPage1
                onComplete={() => {
                    this._viewPager
                        .goToPage( 1 );
                }}
                navigation={this.props.navigation}
                isFinish={this.state.initialPage > 0}
            />
        } else if ( data === PAGES_2 ) {
            return <RegisterPage2
                onComplete={() => {
                    this._viewPager
                        .goToPage( 2 );
                }}
                navigation={this.props.navigation}
                isFinish={this.state.initialPage > 1}
            />
        } else if ( data === PAGES_3 ) {
            return <RegisterPage3
                onComplete={() => {
                    this.props.navigation.dispatch( NavigationActions.reset( {
                        index: 0,
                        actions: [
                            NavigationActions.navigate( { routeName: 'mainPage' } ),
                        ]
                    } ) );
                }}
                navigation={this.props.navigation}
                isFinish={this.state.initialPage > 2}
            />
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create( {
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
} );

function select( store ) {
    return {
        isLoggedIn: store.userStore.isLoggedIn,
        user: store.userStore.user,
        status: store.userStore.status
    }
}

export default connect( select )( RegisterPage );
