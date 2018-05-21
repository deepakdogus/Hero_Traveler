import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'

import {Metrics, Images} from '../../Shared/Themes'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import GuideActions from '../../Shared/Redux/Entities/Guides'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryList from '../../Containers/ConnectedStoryList'
import ConnectedStoryPreview from '../ConnectedStoryPreview'
import styles from '../Styles/MyFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'
import TabBar from '../../Components/TabBar'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

const tabTypes = {
  stories: "stories",
  guides: "guides",
}

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTab: tabTypes.stories
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
    return  sync.syncProgressSteps
    && sync.syncProgressSteps !== sync.syncProgress
    && !sync.error
  }

  isSuccessfulLoad(nextProps){
    return this.state.refreshing && nextProps.fetchStatus.loaded
  }

  isFailedLoad(nextProps){
    return this.state.refreshing && nextProps.error &&
    this.props.fetchStatus.fetching && !nextProps.fetchStatus.fetching
  }

  componentWillReceiveProps(nextProps) {
    if (this.isSuccessfulLoad(nextProps) || this.isFailedLoad(nextProps)) {
      this.setState({refreshing: false})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = _.some([
      this.state.refreshing !== nextState.refreshing,
      this.props.storiesById !== nextProps.storiesById,
      this.props.fetchStatus !== nextProps.fetchStatus,
      this.props.error !== nextProps.error,
      !_.isEqual(this.props.sync, nextProps.sync),
      !_.isEqual(this.props.backgroundFailures, nextProps.backgroundFailures),
      this.state.selectedTab !== nextState.selectedTab,
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

  _showError(){
    return (
      <Text style={styles.message}>Failed to update feed. Please try again.</Text>
    )
  }

  _showNoStories() {
    return (
      <NoStoriesMessage />
    )
  }

  _onRefresh = () => {
    if (this.isPendingUpdate()) return
    this.setState({refreshing: true})
    this.props.attemptGetUserFeedStories(this.props.user.id)
  }

  renderStory = (story, index) => {
    return (
      <ConnectedStoryPreview
        isFeed={true}
        story={story}
        height={imageHeight}
        userId={this.props.user.id}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        index={index}
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

  render () {
    let {storiesById, fetchStatus, error, sync} = this.props;
    let topContent, bottomContent

    const failure = this.getFirstBackgroundFailure()

    if (error) {
      topContent = this._showError()
    }
    if (!storiesById || !storiesById.length) {
      let innerContent = this._showNoStories();
      bottomContent = this._wrapElt(innerContent);
    } else {
      bottomContent = (
        <StoryList
          style={styles.storyList}
          storiesById={storiesById}
          renderStory={this.renderStory}
          onRefresh={this._onRefresh}
          refreshing={fetchStatus.fetching}
        />
      );
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.fakeNavBar}>
          <Image source={Images.whiteLogo} style={styles.logo} />
        </View>
        { topContent }
        <BackgroundPublishingBars
          sync={sync}
          failure={failure}
          updateDraft={this.props.updateDraft}
          publishLocalDraft={this.props.publishLocalDraft}
          discardUpdate={this.props.discardUpdate}
        />
        <TabBar
          tabs={tabTypes}
          activeTab={this.state.selectedTab}
          onClickTab={this.selectTab}
          tabStyle={styles.tabStyle}
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
  } = state.entities.stories;

  return {
    userId: state.session.userId,
    user: state.entities.users.entities[state.session.userId],
    fetchStatus,
    storiesById: userFeedById,
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
