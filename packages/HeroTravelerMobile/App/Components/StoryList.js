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
import UXActions from '../Redux/UXRedux'
import _ from 'lodash'

const NativeFeed = requireNativeComponent('RHNativeFeed', null)
const NativeFeedHeader = requireNativeComponent('RHNativeFeedHeader', null)

// const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

/*
add pagingIsDisabled instead of pagingEnabled as a prop so that paging is default
and so we do not need to add the property to (almost) every StoryList call we make
*/
class StoryList extends React.Component {
  static propTypes = {
    storiesById: PropTypes.arrayOf(PropTypes.string).isRequired,
    onRefresh: PropTypes.func,
    pagingIsDisabled: PropTypes.bool,
    refreshing: PropTypes.bool,
    renderHeaderContent: PropTypes.object,
    renderSectionHeader: PropTypes.object,
    setPlayingRow: PropTypes.func,
    setVisibleRows: PropTypes.func,
    playingRow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
      storiesById: props.storiesById,
    }
  }

  checkEqual(r1,r2) {
    return r1.id !== r2.id
  }

  _handleVisibleCellsChanged = (event) => {
      const {setPlayingRow, playingRow, setVisibleRows} = this.props
        
      this.setState(event.nativeEvent)

      let visibleRowsKeys = []
      if (event.nativeEvent.visibleCells)
      {
          for (let i = event.nativeEvent.minCell; i < event.nativeEvent.maxCell; i++)
          {
              visibleRowsKeys.push(i)
          }
      }
      setVisibleRows(visibleRowsKeys)

      let newPlayingRow = event.nativeEvent.playingCell
      if (playingRow != newPlayingRow)
      {
          setPlayingRow(newPlayingRow)
      }
  }

  componentWillReceiveProps(nextProps) {
    if (_.xor(nextProps.storiesById, this.props.storiesById).length !== 0){
      this.setState({
        storiesById: nextProps.storiesById
      })
    }
  }

  render () {
        let storyViews = []
        let startCell = 0

        const { storiesById, renderHeaderContent, renderSectionHeader } = this.props

        if (this.state.visibleCells)
        {
            const {minCell, maxCell} = this.state.visibleCells

            let i = minCell - 1
            storyViews = storiesById.slice(minCell, maxCell).map((storyId) => {
                i = i + 1
                return (<View key={`FeedItem:${storyId}`}>
                        {this.props.renderStory({id: storyId, index: i})}
                        </View>)
            })
            startCell = minCell
        }

        return (
                <NativeFeed
            style={[styles.container, this.props.style]}
            cellHeight={Metrics.feedCell.height}
            cellSeparatorHeight={Metrics.feedCell.separator}
            numCells={storiesById.length}
            startCell={startCell}
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
                {
                    renderHeaderContent
                        ? (<NativeFeedHeader headerHeight={204} sticky={false}>{renderHeaderContent}</NativeFeedHeader>)
                           : null
                          }
                {
                    renderSectionHeader
                        ? (<NativeFeedHeader headerHeight={50} sticky={true}>{renderSectionHeader}</NativeFeedHeader>)
                           : null
                          }
                   
                {storyViews}
                </NativeFeed>
        )
  }
}

reactMixin(StoryList.prototype, ScrollResponder.Mixin)
reactMixin(StoryList.prototype, ScrollResponder.Mixin.mixins[0])

const mapStateToProps = (state) => {
  return {
    playingRow: state.ux.storyListPlayingRow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPlayingRow: (row) => dispatch(UXActions.setStoryListPlayingRow(row)),
    setVisibleRows: (rows) => dispatch(UXActions.setStoryListVisibleRows(rows)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryList)

