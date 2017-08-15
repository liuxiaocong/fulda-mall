import React from "react";
import { SectionList, StatusBar, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import I18n from "../../I18n";
import commonStyles from "../../styles/commonStyles";
import constStyles from "../../styles/constStyles";
import ModalBox from "react-native-modalbox";
import Spinner from "react-native-spinkit";
import { netMemberReferralList } from "../../net/MemberNet";
import RecommendItem from "./component/RecommendItem";
import Keys from "../../configs/Keys";


class RecommendListPageView extends React.Component {
    static navigationOptions = ( props ) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params } = state;

        return {
            title: state.params && state.params.owner ? state.params.owner.content.memberName : I18n.t( Keys.recommend_list ),
        };
    };

    constructor( props ) {
        super( props );

        this.state = {
            sectionsData: props.navigation.state.params && props.navigation.state.params.sectionsData ? props.navigation.state.params.sectionsData : [],
            isRequesting: false,
            isSupportChildren: props.navigation.state.params ? props.navigation.state.params.isSupportChildren : true,
            firstShowDepth: 1
        };
    }

    componentWillMount() {
        if ( this.props.navigation.state.params && this.props.navigation.state.params.owner ) {

        } else {
            this.setState( { isRequesting: true } );
            netMemberReferralList(
                this.props.user.id, ( err, res ) => {
                    this.setState( { isRequesting: false } );
                    if ( !err ) {
                        const sectionsData = [];
                        const childMap = {};

                        for ( let i = 0; i < res.data.length; i++ ) {
                            if ( res.data[ i ].depth >= this.state.firstShowDepth ) {
                                const key = '' + res.data[ i ].memberId;
                                const childArray = [];
                                childMap[ key ] = childArray;

                                if ( res.data[ i ].depth === this.state.firstShowDepth ) {
                                    sectionsData.push( {
                                        key: key,
                                        content: res.data[ i ],
                                        isOpen: false,
                                        data: [],
                                        allData: childArray,
                                    } );
                                }
                            }
                        }

                        for ( let i = 0; i < res.data.length; i++ ) {
                            const sponsorChildArray = childMap[ '' + res.data[ i ].sponsorMemberId ];
                            if ( sponsorChildArray ) {
                                const key = '' + res.data[ i ].memberId;
                                const childArray = [];
                                childMap[ key ] = childArray;

                                sponsorChildArray.push( {
                                    key: key,
                                    content: res.data[ i ],
                                    isOpen: false,
                                    data: [],
                                    allData: childArray,
                                } );
                            }
                        }


                        this.setState( { sectionsData: sectionsData, } )
                    } else {
                        Toast.show( err.message );
                    }
                }
            )
        }
    }

    render() {
        let isEmpty = true;
        if ( this.state.sectionsData && this.state.sectionsData.length > 0 ) {
            isEmpty = false;
        }

        return (
            <View style={[ commonStyles.wrapper, commonStyles.commonBorderTop, commonStyles.commonBG ]}>
                <StatusBar
                    animated={false}
                    barStyle={constStyles.STATUS_BAR_CONTENT_STYLE_DARK}
                    translucent={false}
                    backgroundColor={constStyles.STATUS_BAR_COLOR}
                />

                {isEmpty ?
                    <View
                        style={
                            {
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                        <Text style={commonStyles.emptyTipStyle}>
                            {I18n.t( Keys.empty_recommend_list )}
                        </Text>
                    </View>
                    :
                    <SectionList
                        ListHeaderComponent={() => {
                            return <View style={[ { height: 20 }, commonStyles.commonBorderBottom ]}/>
                        }}
                        SectionSeparatorComponent={() => null}
                        ItemSeparatorComponent={() => null}
                        renderItem={( { item } ) => {
                            return <RecommendItem data={item}
                                                  isOpen={item.isOpen}
                                                  isTitle={false}
                                                  isSupportChildren={this.state.isSupportChildren}
                                                  navigation={this.props.navigation}
                                                  onOpenChanged={() => {
                                                      item.isOpen = !item.isOpen;
                                                      item.data = item.isOpen ? item.allData : [];

                                                      this.setState( { sectionsData: this.state.sectionsData } );
                                                  }}
                            />
                        }}
                        renderSectionHeader={( { section } ) => {
                            return <RecommendItem data={section}
                                                  isOpen={section.isOpen}
                                                  isTitle={true}
                                                  isSupportChildren={this.state.isSupportChildren}
                                                  navigation={this.props.navigation}
                                                  onOpenChanged={() => {
                                                      section.isOpen = !section.isOpen;
                                                      section.data = section.isOpen ? section.allData : [];

                                                      this.setState( { sectionsData: this.state.sectionsData } );
                                                  }}
                            />
                        }}
                        sections={this.state.sectionsData}
                        style={[]}>
                    </SectionList>
                }

                <ModalBox
                    style={[ commonStyles.modalBoxStyle ]}
                    isOpen={this.state.isRequesting}
                    backdropPressToClose={false}
                    animationDuration={10}
                    backdrop={true}
                    backdropOpacity={0}>
                    <Spinner style={[]} isVisible={true} size={50} type="Arc" color={constStyles.SPINNER_COLOR}/>
                </ModalBox>
            </View>
        )
    }
}

export default RecommendListPageView;
