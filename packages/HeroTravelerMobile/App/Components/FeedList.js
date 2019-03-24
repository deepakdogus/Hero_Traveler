import React from 'react'
import PropTypes from 'prop-types'
import {
    RefreshControl,
    requireNativeComponent,
} from 'react-native'
import reactMixin from 'react-mixin'
import ScrollResponder from '../../node_modules/react-native/Libraries/Components/ScrollResponder'

import {
  ActionConst as NavActionConst,
  Actions as NavActions,
} from 'react-native-router-flux'
import { Metrics } from '../Shared/Themes'
import styles from './Styles/FeedListStyle'
import _ from 'lodash'
import getImageUrl from '../Shared/Lib/getImageUrl'
import {isLocalMediaAsset} from '../Shared/Lib/getVideoUrl'

const NativeFeed = requireNativeComponent('RHNativeFeed', null)
const NativeFeedHeader = requireNativeComponent('RHNativeFeedHeader', null)
const NativeFeedItem = requireNativeComponent('RHNativeFeedItem', null)

// const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

/*
add pagingIsDisabled instead of pagingEnabled as a prop so that paging is default
and so we do not need to add the property to (almost) every FeedList call we make
*/

export default class FeedList extends React.Component {
  render () {
    return null
  }
}

// export default class FeedList extends React.Component {
//   static propTypes = {
//     targetEntities: PropTypes.arrayOf(PropTypes.object).isRequired, // either guides or stories
//     onRefresh: PropTypes.func,
//     pagingIsDisabled: PropTypes.bool,
//     refreshing: PropTypes.bool,
//     renderHeaderContent: PropTypes.object,
//     renderSectionHeader: PropTypes.object,
//     renderFeedItem: PropTypes.func,
//     headerContentHeight: PropTypes.number,
//     sectionContentHeight: PropTypes.number,
//     style: PropTypes.number,
//     sessionError: PropTypes.string,
//     clearSessionError: PropTypes.func,
//   }

//   static defaultProps = {
//     refreshing: false,
//   }

//   constructor(props) {
//     super(props)

//     this.addListenerOn = this.addListenerOn.bind(this)
//     //this.componentDidMount = this.componentDidMount.bind(this)
//     this.componentWillMount = this.componentWillMount.bind(this)
//     this.componentWillUnmount = this.componentWillUnmount.bind(this)
//     this.scrollResponderFlashScrollIndicators = this.scrollResponderFlashScrollIndicators.bind(this)
//     this.scrollResponderGetScrollableNode = this.scrollResponderGetScrollableNode.bind(this)
//     this.scrollResponderHandleMomentumScrollBegin = this.scrollResponderHandleMomentumScrollBegin.bind(this)
//     this.scrollResponderHandleMomentumScrollEnd = this.scrollResponderHandleMomentumScrollEnd.bind(this)
//     this.scrollResponderHandleResponderGrant = this.scrollResponderHandleResponderGrant.bind(this)
//     this.scrollResponderHandleResponderReject = this.scrollResponderHandleResponderReject.bind(this)
//     this.scrollResponderHandleResponderRelease = this.scrollResponderHandleResponderRelease.bind(this)
//     this.scrollResponderHandleScroll = this.scrollResponderHandleScroll.bind(this)
//     this.scrollResponderHandleScrollBeginDrag = this.scrollResponderHandleScrollBeginDrag.bind(this)
//     this.scrollResponderHandleScrollEndDrag = this.scrollResponderHandleScrollEndDrag.bind(this)
//     this.scrollResponderHandleScrollShouldSetResponder = this.scrollResponderHandleScrollShouldSetResponder.bind(this)
//     this.scrollResponderHandleStartShouldSetResponder = this.scrollResponderHandleStartShouldSetResponder.bind(this)
//     this.scrollResponderHandleStartShouldSetResponderCapture = this.scrollResponderHandleStartShouldSetResponderCapture.bind(this)
//     this.scrollResponderHandleTerminationRequest = this.scrollResponderHandleTerminationRequest.bind(this)
//     this.scrollResponderHandleTouchCancel = this.scrollResponderHandleTouchCancel.bind(this)
//     this.scrollResponderHandleTouchEnd = this.scrollResponderHandleTouchEnd.bind(this)
//     this.scrollResponderHandleTouchMove = this.scrollResponderHandleTouchMove.bind(this)
//     this.scrollResponderHandleTouchStart = this.scrollResponderHandleTouchStart.bind(this)
//     this.scrollResponderInputMeasureAndScrollToKeyboard = this.scrollResponderInputMeasureAndScrollToKeyboard.bind(this)
//     this.scrollResponderIsAnimating = this.scrollResponderIsAnimating.bind(this)
//     this.scrollResponderKeyboardDidHide = this.scrollResponderKeyboardDidHide.bind(this)
//     this.scrollResponderKeyboardDidShow = this.scrollResponderKeyboardDidShow.bind(this)
//     this.scrollResponderKeyboardWillHide = this.scrollResponderKeyboardWillHide.bind(this)
//     this.scrollResponderKeyboardWillShow = this.scrollResponderKeyboardWillShow.bind(this)
//     this.scrollResponderMixinGetInitialState = this.scrollResponderMixinGetInitialState.bind(this)
//     this.scrollResponderScrollNativeHandleToKeyboard = this.scrollResponderScrollNativeHandleToKeyboard.bind(this)
//     this.scrollResponderScrollTo = this.scrollResponderScrollTo.bind(this)
//     this.scrollResponderScrollToEnd = this.scrollResponderScrollToEnd.bind(this)
//     this.scrollResponderScrollWithoutAnimationTo = this.scrollResponderScrollWithoutAnimationTo.bind(this)
//     this.scrollResponderTextInputFocusError = this.scrollResponderTextInputFocusError.bind(this)
//     this.scrollResponderZoomTo = this.scrollResponderZoomTo.bind(this)

//     this.state = {
//       visibleCells: undefined,
//       targetEntities: props.targetEntities,
//     }
//   }

//   checkEqual(r1,r2) {
//     return r1.id !== r2.id
//   }

//   _handleVisibleCellsChanged = (event) => {
//     this.setState(event.nativeEvent)
//   }

//   componentWillReceiveProps(nextProps) {
//     if (_.xor(nextProps.targetEntities, this.props.targetEntities).length !== 0){
//       this.setState({
//         targetEntities: nextProps.targetEntities,
//       })
//     }
//     //log outif session runs out
//     const { sessionError } = this.props
//     if (sessionError && sessionError === 'Unauthorized') {
//       NavActions.launchScreen({type: NavActionConst.RESET})
//       this.props.clearSessionError()
//       NavActions.login()
//     }
//   }

//   // TODO: NativeFeed should probably be wrapped in another class
//   render () {
//     let feedItemViews = []

//     const {
//       targetEntities,
//       renderSectionHeader,
//       sectionContentHeight,
//       renderHeaderContent,
//       headerContentHeight,
//     } = this.props

//     const imageOptions = {
//       width: 'screen',
//       height: Metrics.storyCover.fullScreen.height,
//     }
//     const videoOptions = {
//       video: true,
//       width: 'screen',
//     }

//     const entitiesInfo = targetEntities.map((entity) => {
//       let totalPadding = Metrics.feedCell.padding

//       if (entity && entity.coverImage) {
//         return {
//           headerImage: getImageUrl(entity.coverImage, 'optimized', imageOptions),
//           height: Metrics.feedCell.imageCellHeight + totalPadding,
//         }
//       }
//       else if (entity && entity.coverVideo) {
//         let headerImage = getImageUrl(entity.coverVideo, 'optimized', videoOptions, entity.cover)
//         if (isLocalMediaAsset(headerImage)) {
//           headerImage = null
//         }

//         return {
//           headerImage,
//           height: Metrics.feedCell.videoCellHeight + totalPadding,
//         }
//       }

//       return {
//         headerImage: null,
//         height: 0,
//       }
//     })

//     if (this.state.visibleCells){
//       const {minCell, maxCell} = this.state.visibleCells

//       let i = minCell - 1
//       let keyIndex = -1
//       feedItemViews = targetEntities.slice(minCell, maxCell).map((entity) => {
//         i = i + 1
//         keyIndex = keyIndex + 1
//         return (
//           <NativeFeedItem
//             key={`FeedItem:${keyIndex}`}
//             cellNum={i}
//            >
//             {this.props.renderFeedItem(entity, i)}
//           </NativeFeedItem>
//         )
//       })
//     }

//     return (
//       <NativeFeed
//         style={[styles.container, this.props.style]}
//         storyInfos={entitiesInfo}
//         numPreloadBehindCells={2}
//         numPreloadAheadCells={3}
//         onVisibleCellsChanged={this._handleVisibleCellsChanged}
//         onMomentumScrollBegin={this.scrollResponderHandleMomentumScrollBegin}
//         onMomentumScrollEnd={this.scrollResponderHandleMomentumScrollEnd}
//         onResponderGrant={this.scrollResponderHandleResponderGrant}
//         onResponderReject={this.scrollResponderHandleResponderReject}
//         onResponderRelease={this.scrollResponderHandleResponderRelease}
//         onResponderTerminate={this.scrollResponderHandleTerminate}
//         onResponderTerminationRequest={this.scrollResponderHandleTerminationRequest}
//         onScrollBeginDrag={this.scrollResponderHandleScrollBeginDrag}
//         onScrollEndDrag={this.scrollResponderHandleScrollEndDrag}
//         onScrollShouldSetResponder={this.scrollResponderHandleScrollShouldSetResponder}
//         onStartShouldSetResponder={this.scrollResponderHandleStartShouldSetResponder}
//         onStartShouldSetResponderCapture={this.scrollResponderHandleStartShouldSetResponderCapture}
//         onTouchEnd={this.scrollResponderHandleTouchEnd}
//         onTouchMove={this.scrollResponderHandleTouchMove}
//         onTouchStart={this.scrollResponderHandleTouchStart}
//         onTouchCancel={this.scrollResponderHandleTouchCancel}
//         leadingCellSpace={1} // leadingCellSpace must be at least 1 for trailing space to appear
//         trailingCellSpace={20}
//       >
//         <RefreshControl
//           enabled={this.props.refreshing}
//           refreshing={false} // workaround to prevent it from persisting
//           onRefresh={this.props.onRefresh}
//         />
//         {renderHeaderContent
//           ? (
//             <NativeFeedHeader
//               headerHeight={headerContentHeight}
//               sticky={false}
//             >
//               {renderHeaderContent}
//             </NativeFeedHeader>
//           )
//           : null
//         }
//         {renderSectionHeader
//           ? (
//             <NativeFeedHeader
//               headerHeight={sectionContentHeight}
//               sticky={true}
//             >
//               {renderSectionHeader}
//             </NativeFeedHeader>
//           )
//           : null
//         }
//         {feedItemViews}
//       </NativeFeed>
//     )
//   }
// }

// reactMixin(FeedList.prototype, ScrollResponder.Mixin)
// reactMixin(FeedList.prototype, ScrollResponder.Mixin.mixins[0])
