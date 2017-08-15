//
// class MaskViewGroupComponent1 extends React.Component {
//     constructor( props ) {
//         super( props );
//
//         this.state = {
//             maskViewContent: null,
//             maskViewContentMarginTop: 0,
//             maskViewShown: false,
//             viewRef: 0,
//             previewSource: null,
//         };
//     }
//
//     componentWillMount() {
//         BackHandler.addEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
//     }
//
//     componentWillUnmount() {
//         BackHandler.removeEventListener( 'hardwareBackPress', this._onBack.bind( this ) );
//     }
//
//     _onBack() {
//         if ( this.state.maskViewShown ) {
//
//             this.setState( {
//                 maskViewShown: false
//             } );
//
//             return true;
//         }
//         return false;
//     }
//
//
//     hideModalBox() {
//         if ( this.state.maskViewShown ) {
//             this.setState( {
//                 maskViewShown: false
//             } );
//         }
//     }
//
//     showModalBox( isHasStateBar, view, snapView, maskViewContent ) {
//         if ( view === null ) {
//             this.doShowModalBox( isHasStateBar, 0, snapView, maskViewContent );
//         } else {
//             view.measureLayout(
//                 findNodeHandle( snapView ),
//                 ( left,
//                   top,
//                   width,
//                   height ) => {
//                     console.log( 'view.measureLayout(' );
//
//                     console.log( 'left: ' + left );
//                     console.log( 'top: ' + top );
//                     console.log( 'width: ' + width );
//                     console.log( 'height: ' + height );
//
//                     this.doShowModalBox( isHasStateBar, top + height, snapView, maskViewContent );
//                 },
//                 () => {
//                 }
//             );
//         }
//     }
//
//     doShowModalBox( isHasStateBar, maskViewContentMarginTop, snapView, maskViewContent ) {
//         takeSnapshot( snapView, {
//             format: "jpeg",
//             quality: 0.8,
//             result: "data-uri"
//         } )
//             .then(
//                 ( uri ) => {
//                     console.log( "Image saved to", uri );
//                     this.setState( {
//                         previewSource: uri,
//                     } );
//
//                 },
//                 ( error ) => {
//                     console.error( "Oops, snapshot failed", error );
//                 }
//             );
//
//         this.setState( {
//             previewSource: null,
//             maskViewContent: maskViewContent,
//             maskViewContentMarginTop: maskViewContentMarginTop,
//             maskViewShown: true,
//             isHasStateBar: isHasStateBar
//         } );
//     }
//
//     imageLoaded() {
//         console.log( "imageLoaded() {" );
//
//         this.setState( { viewRef: findNodeHandle( this._backgroundImage ) } )
//     }
//
//     render() {
//         //
//         return (
//             this.state.maskViewShown ?
//                 <View style={{
//                     flex: 1,
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     top: this.state.maskViewContentMarginTop + (this.state.isHasStateBar ? 0 : constStyles.STATE_BAR_HEIGHT ),
//                     backgroundColor: 'transparent',
//                 }}
//                 >
//                     <Image
//                         style={{
//                             flex: 1,
//                             resizeMode: 'cover',
//                             marginTop: -this.state.maskViewContentMarginTop,
//                             backgroundColor: 'transparent',
//                         }}
//                         ref={( backgroundImage ) => {
//                             this._backgroundImage = backgroundImage;
//                         }}
//                         onLoadEnd={this.imageLoaded.bind( this )}
//                         source={{ uri: this.state.previewSource ? this.state.previewSource : null }}>
//
//                         <BlurView
//                             blurType="light"
//                             blurAmount={5}
//                             blurRadius={5}
//                             downsampleFactor={1}
//                             overlayColor={'#ffffffe0'}
//                             style={styles.blurView}
//                             viewRef={this.state.viewRef}/>
//                         <View
//                             style={[ { marginTop: this.state.maskViewContentMarginTop, } ]}>
//
//                             <View>
//                                 {this.state.maskViewContent}
//                             </View>
//                         </View>
//                     </Image>
//                 </View>
//                 :
//                 null
//         );
//     }
// }
//
// const styles = StyleSheet.create( {
//     container: {
//         flex: 1,
//         height: 50,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: '#0000007f'
//     },
//     blurView: {
//         position: "absolute",
//         left: 0,
//         top: 0,
//         bottom: 0,
//         right: 0
//     },
// } );
//
// export default MaskViewGroupComponent1;
