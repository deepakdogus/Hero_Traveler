import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'

import { Metrics } from '../../Shared/Themes'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import ConnectedFeedList from '../../Containers/ConnectedFeedList'
import ConnectedFeedItemPreview from '../ConnectedFeedItemPreview'
import styles from '../Styles/MyFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'
import TabBar from '../../Components/TabBar'
import TabIcon from '../../Components/TabIcon'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

const tabTypes = {
  following: 'following',
  guides: 'guides',
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
    backgroundFailures: PropTypes.object,
    updateDraft: PropTypes.func,
    publishLocalDraft: PropTypes.func,
    discardUpdate: PropTypes.func,
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
      !_.isEqual(this.props.backgroundFailures, nextProps.backgroundFailures),
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
    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.tabWrapper}>
          {this.renderTabs()}
        </View>
        <NoStoriesMessage text={this.state.selectedTab}/>
      </View>
    )
  }

  _onRefresh = () => {
    if (this.isPendingUpdate()) return
    this.setState({refreshing: true})
    this.props.attemptGetUserFeedStories(this.props.userId)
    this.props.attemptGetUserFeedGuides(this.props.userId)
  }

  renderFeedItem = (feedItem, index) => {
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

  getFirstBackgroundFailure() {
    const backgroundFailures = this.props.backgroundFailures
    return backgroundFailures[Object.keys(backgroundFailures)[0]]
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

  _setupInputRef = ref => this._searchInput = ref

  _changeQuery = (e) => {
    const q = e.nativeEvent.text
    const hasSearchText = q.length > 0
    this.setState({
      hasSearchText,
    })
  }

  cancelSearch = () => {
    // this.setState({
    //   hasSearchText: false,
    // })
  }

  render () {
    let {storiesById, fetchStatus, sync, feedGuidesById} = this.props
    const {selectedTab} = this.state
    let bottomContent

    const isStoriesSelected = selectedTab === tabTypes.following
    const failure = this.getFirstBackgroundFailure()

    if (
      (isStoriesSelected && (!storiesById || !storiesById.length))
      || (!isStoriesSelected && (!feedGuidesById || !feedGuidesById.length))
    ) {
      let innerContent = this._showNoStories()
      bottomContent = this._wrapElt(innerContent)
    }
    else {
      bottomContent = (
        <ConnectedFeedList
          isStory={isStoriesSelected}
          entitiesById={isStoriesSelected ? storiesById : feedGuidesById}
          renderFeedItem={this.renderFeedItem}
          renderSectionHeader={this.renderTabs()}
          onRefresh={this._onRefresh}
          refreshing={fetchStatus.fetching}
        />
      )
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.fakeNavBar}>
          <View style={styles.headerSearch}>
            <View style={styles.searchWrapper}>
              <TextInput
                ref={this._setupInputRef}
                style={styles.searchInput}
                placeholder='Search'
                placeholderTextColor='#757575'
                // onFocus={this.setFocus}
                onChange={this._changeQuery}
                // onChangeText={this.checkClearResults}
                returnKeyType='search'
              />
              { this.state.hasSearchText && (
                <TouchableOpacity
                  style={styles.InputXPosition}
                  onPress={this.resetSearchText}
                >
                  <TabIcon
                    name='closeDark'
                    style={{
                      view: styles.InputXView,
                      image: styles.InputXIcon,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          {this.state.hasSearchText && (
            <TouchableOpacity
              onPress={this.cancelSearch}>
              <View style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          )}
          </View>
        </View>
        <BackgroundPublishingBars
          sync={sync}
          failure={failure}
          updateDraft={this.props.updateDraft}
          publishLocalDraft={this.props.publishLocalDraft}
          discardUpdate={this.props.discardUpdate}
        />
        { bottomContent }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let {
    userFeedById,
    fetchStatus,
    error,
    backgroundFailures,
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
    backgroundFailures,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeedStories: (userId) => dispatch(StoryActions.feedRequest(userId)),
    attemptGetUserFeedGuides: (userId) => dispatch(GuideActions.guideFeedRequest(userId)),
    discardUpdate: (storyId) => dispatch(StoryActions.removeBackgroundFailure(storyId)),
    publishLocalDraft: (story) => dispatch(StoryCreateActions.publishLocalDraft(story)),
    updateDraft: (story) => dispatch(StoryCreateActions.updateDraft(story.id, story, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
