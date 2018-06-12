import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'

import {Metrics, Images} from '../../Shared/Themes'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import StoryList from '../../Containers/ConnectedStoryList'
import ConnectedStoryPreview from '../ConnectedStoryPreview'
import styles from '../Styles/MyFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import BackgroundPublishingBars from '../../Components/BackgroundPublishingBars'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.object,
    attemptGetUserFeed: PropTypes.func,
    userId: PropTypes.string,
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
      refreshing: false
    }
  }

  componentDidMount() {
    if (!this.isPendingUpdate()) this.props.attemptGetUserFeed(this.props.userId)
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
      <NoStoriesMessage />
    )
  }

  _onRefresh = () => {
    if (this.isPendingUpdate()) return
    this.setState({refreshing: true})
    this.props.attemptGetUserFeed(this.props.user.id)
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

  render () {
    let {storiesById, fetchStatus, sync} = this.props;
    let bottomContent

    const failure = this.getFirstBackgroundFailure()

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
