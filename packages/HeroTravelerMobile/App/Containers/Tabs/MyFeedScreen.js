import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'

import {Metrics, Images} from '../../Shared/Themes'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryList from '../../Containers/ConnectedStoryList'
import ConnectedStoryPreview from '../ConnectedStoryPreview'
import styles from '../Styles/MyFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import ProgressBar from '../../Components/ProgressBar'
import FailureBar from '../../Components/FailureBar'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.userId)
    SplashScreen.hide()
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
    this.setState({refreshing: true})
    this.props.attemptGetUserFeed(this.props.user.id)
  }

  _touchUser = (userId) => {
    if (this.props.userId === userId) {
      NavActions.profile({type: 'jump'})
    } else {
      NavActions.readOnlyProfile({userId})
    }
  }

  renderStory = (story, index) => {
    return (
      <ConnectedStoryPreview
        isFeed={true}
        story={story}
        height={imageHeight}
        onPressUser={this._touchUser}
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

  render () {
    let {storiesById, fetchStatus, error, sync, backgroundFailures} = this.props;
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
          <Image source={Images.logoFeedBeta} style={styles.logo} />
        </View>
        { topContent }
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
    entities: stories,
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
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    discardUpdate: (storyId) => dispatch(StoryActions.removeBackgroundFailure(storyId)),
    publishLocalDraft: (story) => dispatch(StoryCreateActions.publishLocalDraft(story)),
    updateDraft: (story) => dispatch(StoryCreateActions.updateDraft(story.id, story, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
