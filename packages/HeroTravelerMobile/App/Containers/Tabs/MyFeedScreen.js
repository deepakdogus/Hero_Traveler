import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../../Shared/Redux/Entities/Stories'
import PendingUpdatesActions from '../../Shared/Redux/PendingUpdatesRedux'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'

import { Metrics } from '../../Shared/Themes'
import styles from '../Styles/MyFeedScreenStyles'

import ConnectedFeedList from '../../Containers/ConnectedFeedList'
import ConnectedFeedItemPreview from '../ConnectedFeedItemPreview'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'
import TabBar from '../../Components/TabBar'
import SearchPlacesPeople from '../SearchPlacesPeople'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

const tabTypes = {
  following: 'following',
  guides: 'guides',
  // featured: 'featured',
  // trending: 'trending',
}

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
    feedGuidesById: PropTypes.arrayOf(PropTypes.string),
    attemptGetUserFeedStories: PropTypes.func,
    attemptGetUserFeedGuides: PropTypes.func,
    userId: PropTypes.string,
    location: PropTypes.string,
    sync: PropTypes.object,
    fetchStatus: PropTypes.object,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    stories: PropTypes.object,
    pendingUpdates: PropTypes.object,
    updateDraft: PropTypes.func,
    saveLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
    resetFailCount: PropTypes.func,
    updateOrder: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTab: tabTypes.following,
      hasSearchText: false,
    }
  }

  componentDidMount() {
    if (!this.isPendingUpdate()) {
      this.props.attemptGetUserFeedStories(this.props.userId)
      this.props.attemptGetUserFeedGuides(this.props.userId)
    }
    if (this.props.user.usernameIsTemporary === true) {
      NavActions.signupFlow()
    }
    SplashScreen.hide()
  }

  isPendingUpdate() {
    const {sync} = this.props
    return sync.syncProgressSteps
    && sync.syncProgressSteps !== sync.syncProgress
    && !sync.error
  }

  isFailedLoad(nextProps){
    return nextProps.error
    && this.props.fetchStatus.fetching && !nextProps.fetchStatus.fetching
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = _.some([
      this.props.storiesById !== nextProps.storiesById,
      this.props.fetchStatus !== nextProps.fetchStatus,
      this.props.error !== nextProps.error,
      !_.isEqual(this.props.sync, nextProps.sync),
      !_.isEqual(this.props.pendingUpdates, nextProps.pendingUpdates),
      this.state.selectedTab !== nextState.selectedTab,
      this.state.hasSearchText !== nextState.hasSearchText,
    ])

    return shouldUpdate
  }

  _wrapElt(elt){
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }

  _showNoStories() {
    let text = ''
    switch(this.state.selectedTab) {
      case 'following':
        text = `You aren't following any users yet.`
        break
      case 'guide':
        text = `There are no guides to display.`
        break
      case 'featured':
      case 'trending':
        text = `There are no ${this.state.selectedTab} stories to show right now.`
        break
      default:
        text = `There is no content available. Check back later.`
    }
    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.tabWrapper}>
          {this.renderTabs()}
        </View>
        <NoStoriesMessage text={text}/>
      </View>
    )
  }

  _onRefresh = () => {
    if (this.isPendingUpdate()) return
    this.setState({refreshing: true})
    this.props.attemptGetUserFeedStories(this.props.userId)
    this.props.attemptGetUserFeedGuides(this.props.userId)
  }

  renderFeedItem = ({feedItem, index}) => {
    return (
      <ConnectedFeedItemPreview
        index={index}
        isFeed={true}
        isStory={this.state.selectedTab === tabTypes.following}
        feedItem={feedItem}
        height={imageHeight}
        userId={this.props.userId}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        showPlayButton={true}
      />
    )
  }

  getFirstPendingFailure() {
    const { pendingUpdates, updateOrder } = this.props
    const firstFailureKey = updateOrder.find(key => {
      const pendingUpdate = pendingUpdates[key] || {}
      return pendingUpdate.failCount >= 5
    })
    if (firstFailureKey) return pendingUpdates[firstFailureKey]
    return undefined
  }

  selectTab = (selectedTab) => {
    this.setState({selectedTab})
  }

  renderTabs(){
    const {selectedTab} = this.state
    return (
      <TabBar
        tabs={tabTypes}
        activeTab={selectedTab}
        onClickTab={this.selectTab}
        tabStyle={styles.tabStyle}
      />
    )
  }

  render () {
    let {
      storiesById,
      fetchStatus,
      sync,
      feedGuidesById,
      stories,
      user,
    } = this.props
    const { selectedTab } = this.state
    let bottomContent

    const isFollowingSelected = selectedTab === tabTypes.following
    const failure = this.getFirstPendingFailure()

    if (
      (isFollowingSelected && (!storiesById || !storiesById.length))
      || (!isFollowingSelected && (!feedGuidesById || !feedGuidesById.length))
    ) {
      let innerContent = this._showNoStories()
      bottomContent = this._wrapElt(innerContent)
    }
    else {
      bottomContent = (
        <ConnectedFeedList
          isStory={isFollowingSelected}
          entitiesById={isFollowingSelected ? storiesById : feedGuidesById}
          renderFeedItem={this.renderFeedItem}
          renderSectionHeader={this.renderTabs()}
          sectionContentHeight={40}
          onRefresh={this._onRefresh}
          refreshing={fetchStatus.fetching}
        />
      )
    }

    return (
      <View style={styles.statusBarAvoider}>
        <BackgroundPublishingBars
          sync={sync}
          failure={failure}
          updateDraft={this.props.updateDraft}
          saveLocalDraft={this.props.saveLocalDraft}
          discardUpdate={this.props.discardUpdate}
          resetFailCount={this.props.resetFailCount}
        />
        <SearchPlacesPeople
          stories={stories}
          user={user}
          placeholder={`Search`}
        >
          { bottomContent }
        </SearchPlacesPeople>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    userFeedById,
    fetchStatus,
    error,
  } = state.entities.stories
  const feedGuidesById = state.entities.guides.feedGuidesById || []
  return {
    userId: state.session.userId,
    user: state.entities.users.entities[state.session.userId],
    fetchStatus,
    storiesById: userFeedById,
    feedGuidesById,
    error,
    location: state.routes.scene.name,
    sync: state.storyCreate.sync,
    pendingUpdates: state.pendingUpdates.pendingUpdates,
    updateOrder: state.pendingUpdates.updateOrder,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeedStories: (userId) => dispatch(StoryActions.feedRequest(userId)),
    attemptGetUserFeedGuides: (userId) => dispatch(GuideActions.guideFeedRequest(userId)),
    discardUpdate: (storyId) => dispatch(PendingUpdatesActions.removePendingUpdate(storyId)),
    resetFailCount: (storyId) => dispatch(PendingUpdatesActions.resetFailCount(storyId)),
    saveLocalDraft: (story) => dispatch(StoryCreateActions.saveLocalDraft(story)),
    updateDraft: (story) => dispatch(StoryCreateActions.updateDraft(story.id, story, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
