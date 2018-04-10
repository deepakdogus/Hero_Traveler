import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    RefreshControl,
    requireNativeComponent,
} from 'react-native'
import reactMixin from 'react-mixin'
import ScrollResponder from '../../node_modules/react-native/Libraries/Components/ScrollResponder'

import { Metrics } from '../Shared/Themes'
import { connect } from 'react-redux'
import styles from './Styles/StoryListStyle'
import ModifiedListView from './ModifiedListView'
import _ from 'lodash'
import getImageUrl from '../Shared/Lib/getImageUrl'

const NativeFeed = requireNativeComponent('RHNativeFeed', null)
const NativeFeedHeader = requireNativeComponent('RHNativeFeedHeader', null)
const NativeFeedItem = requireNativeComponent('RHNativeFeedItem', null)

// const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

/*
add pagingIsDisabled instead of pagingEnabled as a prop so that paging is default
and so we do not need to add the property to (almost) every StoryList call we make
*/
export default class StoryList extends React.Component {
  static propTypes = {
    stories: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRefresh: PropTypes.func,
    pagingIsDisabled: PropTypes.bool,
    refreshing: PropTypes.bool,
    renderHeaderContent: PropTypes.object,
    renderSectionHeader: PropTypes.object,
  }

  static defaultProps = {
    refreshing: false
  }

  constructor(props) {
    super(props)

    this.addListenerOn = this.addListenerOn.bind(this)
    //this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.scrollResponderFlashScrollIndicators = this.scrollResponderFlashScrollIndicators.bind(this)
    this.scrollResponderGetScrollableNode = this.scrollResponderGetScrollableNode.bind(this)
    this.scrollResponderHandleMomentumScrollBegin = this.scrollResponderHandleMomentumScrollBegin.bind(this)
    this.scrollResponderHandleMomentumScrollEnd = this.scrollResponderHandleMomentumScrollEnd.bind(this)
    this.scrollResponderHandleResponderGrant = this.scrollResponderHandleResponderGrant.bind(this)
    this.scrollResponderHandleResponderReject = this.scrollResponderHandleResponderReject.bind(this)
    this.scrollResponderHandleResponderRelease = this.scrollResponderHandleResponderRelease.bind(this)
    this.scrollResponderHandleScroll = this.scrollResponderHandleScroll.bind(this)
    this.scrollResponderHandleScrollBeginDrag = this.scrollResponderHandleScrollBeginDrag.bind(this)
    this.scrollResponderHandleScrollEndDrag = this.scrollResponderHandleScrollEndDrag.bind(this)
    this.scrollResponderHandleScrollShouldSetResponder = this.scrollResponderHandleScrollShouldSetResponder.bind(this)
    this.scrollResponderHandleStartShouldSetResponder = this.scrollResponderHandleStartShouldSetResponder.bind(this)
    this.scrollResponderHandleStartShouldSetResponderCapture = this.scrollResponderHandleStartShouldSetResponderCapture.bind(this)
    this.scrollResponderHandleTerminationRequest = this.scrollResponderHandleTerminationRequest.bind(this)
    this.scrollResponderHandleTouchCancel = this.scrollResponderHandleTouchCancel.bind(this)
    this.scrollResponderHandleTouchEnd = this.scrollResponderHandleTouchEnd.bind(this)
    this.scrollResponderHandleTouchMove = this.scrollResponderHandleTouchMove.bind(this)
    this.scrollResponderHandleTouchStart = this.scrollResponderHandleTouchStart.bind(this)
    this.scrollResponderInputMeasureAndScrollToKeyboard = this.scrollResponderInputMeasureAndScrollToKeyboard.bind(this)
    this.scrollResponderIsAnimating = this.scrollResponderIsAnimating.bind(this)
    this.scrollResponderKeyboardDidHide = this.scrollResponderKeyboardDidHide.bind(this)
    this.scrollResponderKeyboardDidShow = this.scrollResponderKeyboardDidShow.bind(this)
    this.scrollResponderKeyboardWillHide = this.scrollResponderKeyboardWillHide.bind(this)
    this.scrollResponderKeyboardWillShow = this.scrollResponderKeyboardWillShow.bind(this)
    this.scrollResponderMixinGetInitialState = this.scrollResponderMixinGetInitialState.bind(this)
    this.scrollResponderScrollNativeHandleToKeyboard = this.scrollResponderScrollNativeHandleToKeyboard.bind(this)
    this.scrollResponderScrollTo = this.scrollResponderScrollTo.bind(this)
    this.scrollResponderScrollToEnd = this.scrollResponderScrollToEnd.bind(this)
    this.scrollResponderScrollWithoutAnimationTo = this.scrollResponderScrollWithoutAnimationTo.bind(this)
    this.scrollResponderTextInputFocusError = this.scrollResponderTextInputFocusError.bind(this)
    this.scrollResponderZoomTo = this.scrollResponderZoomTo.bind(this)

    this.state = {
      visibleCells: undefined,
      stories: props.stories,
    }
  }

  checkEqual(r1,r2) {
    return r1.id !== r2.id
  }

  _handleVisibleCellsChanged = (event) => {
    this.setState(event.nativeEvent)
  }

  componentWillReceiveProps(nextProps) {
    if (_.xor(nextProps.stories, this.props.stories).length !== 0){
      this.setState({
        stories: nextProps.stories
      })
    }
  }

  // TODO: NativeFeed should probably be wrapped in another class
  render () {
    let storyViews = []

    const {
      stories, renderSectionHeader,
      renderHeaderContent, headerContentHeight,
    } = this.props

    const imageOptions = {
      width: 'screen',
    }
    const videoOptions = {
      video: true,
      width: 'screen',
    }

    const storyInfos = stories.map((story) => {
      if (story && story.coverImage) {
        return {
          headerImage: getImageUrl(story.coverImage, 'optimized', imageOptions),
          height: Metrics.feedCell.imageCellHeight,
        }
      } else if (story && story.coverVideo) {
        return {
          headerImage: getImageUrl(story.coverVideo, 'optimized', videoOptions),
          height: Metrics.feedCell.videoCellHeight,
        }
      }

      return {
        headerImage: null,
        height: 0,
      }
    })

    if (this.state.visibleCells){
      const {minCell, maxCell} = this.state.visibleCells

      let i = minCell - 1
      let keyIndex = -1
      storyViews = stories.slice(minCell, maxCell).map((story) => {
        i = i + 1
        keyIndex = keyIndex + 1
        return (
          <NativeFeedItem key={`FeedItem:${keyIndex}`} cellNum={i}>
            {this.props.renderStory(story, i)}
          </NativeFeedItem>
        )
      })
    }

    return (
      <NativeFeed
        style={[styles.container, this.props.style]}
        cellSeparatorHeight={Metrics.feedCell.separator}
        storyInfos={storyInfos}
        numPreloadBehindCells={2}
        numPreloadAheadCells={3}
        onVisibleCellsChanged={this._handleVisibleCellsChanged}
        onMomentumScrollBegin={this.scrollResponderHandleMomentumScrollBegin}
        onMomentumScrollEnd={this.scrollResponderHandleMomentumScrollEnd}
        onResponderGrant={this.scrollResponderHandleResponderGrant}
        onResponderReject={this.scrollResponderHandleResponderReject}
        onResponderRelease={this.scrollResponderHandleResponderRelease}
        onResponderTerminate={this.scrollResponderHandleTerminate}
        onResponderTerminationRequest={this.scrollResponderHandleTerminationRequest}
        onScrollBeginDrag={this.scrollResponderHandleScrollBeginDrag}
        onScrollEndDrag={this.scrollResponderHandleScrollEndDrag}
        onScrollShouldSetResponder={this.scrollResponderHandleScrollShouldSetResponder}
        onStartShouldSetResponder={this.scrollResponderHandleStartShouldSetResponder}
        onStartShouldSetResponderCapture={this.scrollResponderHandleStartShouldSetResponderCapture}
        onTouchEnd={this.scrollResponderHandleTouchEnd}
        onTouchMove={this.scrollResponderHandleTouchMove}
        onTouchStart={this.scrollResponderHandleTouchStart}
        onTouchCancel={this.scrollResponderHandleTouchCancel}
      >
        <RefreshControl
          enabled={this.props.refreshing}
          refreshing={this.props.refreshing}
          onRefresh={this.props.onRefresh}
        />
        {
          renderHeaderContent ?
          (<NativeFeedHeader headerHeight={headerContentHeight} sticky={false}>{
            renderHeaderContent}
          </NativeFeedHeader>) :
          null
        }
        { renderSectionHeader ?
          (<NativeFeedHeader headerHeight={50} sticky={true}>
            {renderSectionHeader}
          </NativeFeedHeader>) :
          null
        }

        {storyViews}
      </NativeFeed>
    )
  }
}

reactMixin(StoryList.prototype, ScrollResponder.Mixin)
reactMixin(StoryList.prototype, ScrollResponder.Mixin.mixins[0])
