import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import ViewPager from "react-native-viewpager";
import { connect } from "react-redux";
import ImageWithPlaceHolder from "../../../components/ImageWithPlaceHolder";


class GoodsDetailHeaderViewPage extends React.Component {
    static propTypes = {
        service: React.PropTypes.object,
    };

    constructor( props ) {
        super( props );

        //noinspection JSCheckFunctionSignatures
        const dataSource = new ViewPager.DataSource( {
            pageHasChanged: ( p1, p2 ) => p1 !== p2
        } );

        const PAGES = [];

        if ( this.props.service ) {
            if ( this.props.service.logo && this.props.service.logo.length > 0 ) {
                PAGES.push( this.props.service.logo );
            }

            if ( this.props.service.detail && this.props.service.detail.gallery ) {
                for ( let index = 0; index < this.props.service.detail.gallery.length > 0; index++ ) {
                    PAGES.push( this.props.service.detail.gallery[ index ] );
                }
            }
        }

        //noinspection JSCheckFunctionSignatures
        this.state = {
            service: this.props.service,
            dataSource: dataSource.cloneWithPages( PAGES ),
            data: PAGES,
            currentPage: 0
        };
    }

    render() {
        const viewWidth = Dimensions.get( 'window' ).width;
        //noinspection JSSuspiciousNameCombination
        const viewHeight = viewWidth;

        return (
            <View
                style={[
                    {
                        width: viewWidth,
                        height: viewHeight,
                    },
                    this.props.style
                ]}>

                {
                    this.state.data && this.state.data.length > 0 ?
                        <ViewPager
                            ref={( viewPager ) => {
                                this._viewPager = viewPager;
                            }}
                            dataSource={this.state.dataSource}
                            renderPage={this.renderViewPagerPage}
                            onChangePage={( page ) => {
                                this.setState( { currentPage: page } )
                            }}
                            style={[ { backgroundColor: 'yellow' } ]}/>
                        :
                        <ImageWithPlaceHolder
                            style={{
                                flex: 1,
                                width: viewWidth,
                                height: viewHeight,
                            } }
                            placeholderForIcon={'md-image'}
                            source={null}
                        />
                }
            </View>
        );
    }

    renderViewPagerPage = ( data ) => {
        const viewWidth = Dimensions.get( 'window' ).width;
        //noinspection JSSuspiciousNameCombination,UnnecessaryLocalVariableJS
        const viewHeight = viewWidth;
        return (
            <ImageWithPlaceHolder
                style={{
                    flex: 1,
                    width: viewWidth,
                    height: viewHeight,
                } }
                placeholderForIcon={'md-image'}
                source={data && data.length >= 0 ? { uri: data } : null}
            />
        );


    }
}

const styles = StyleSheet.create( {} );

function select( store ) {
    return {}
}

export default connect( select )( GoodsDetailHeaderViewPage );
