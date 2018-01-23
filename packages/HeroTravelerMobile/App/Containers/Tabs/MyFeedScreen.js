import _ from 'lodash'
import React, { PropTypes } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import SplashScreen from 'react-native-splash-screen'

import {Metrics, Images} from '../../Shared/Themes'
import isTooltipComplete, {Types as TooltipTypes} from '../../Shared/Lib/firstTimeTooltips'
import StoryActions from '../../Shared/Redux/Entities/Stories'
import UserActions from '../../Shared/Redux/Entities/Users'
import Loader from '../../Components/Loader'
import StoryList from '../../Components/StoryList'
import ConnectedStoryPreview from '../ConnectedStoryPreview'
import RoundedButton from '../../Components/RoundedButton'
import styles from '../Styles/MyFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.bool,
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
      this.props.user && !this.props.user.introTooltips.length && nextProps.user.introTooltips,
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
      <Text style={styles.message}>Error</Text>
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

  _completeTooltip = () => {
    const tooltips = this.props.user.introTooltips.concat({
      name: TooltipTypes.MY_FEED,
      seen: true,
    })
    this.props.completeTooltip(tooltips)
  }

  renderTooltip() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,.4)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this._completeTooltip}
      >
          <View style={{
            height: 175,
            width: 200,
            padding: 20,
            borderRadius: 20,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}>
            <Icon name='hand-pointer-o' size={40} />
            <Text style={{marginTop: 10}}>Swipe up for more stories!</Text>
            <RoundedButton
              style={{
                height: 30,
                borderRadius: 10,
                paddingHorizontal: 10
              }} onPress={this._completeTooltip}>Ok, I got it</RoundedButton>
          </View>

      </TouchableOpacity>
    )
  }

  _touchUser = (userId) => {
    if (this.props.userId === userId) {
      NavActions.profile({type: 'jump'})
    } else {
      NavActions.readOnlyProfile({userId})
    }
  }

  renderStory = (storyInfo) => {
    return (
      <ConnectedStoryPreview
        key={storyInfo.id}
        storyId={storyInfo.id}
        height={imageHeight}
        showLike={true}
        showUserInfo={true}
        onPressUser={this._touchUser}
        userId={this.props.user.id}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        index={storyInfo.index}
      />
    )
  }

  render () {
    let {storiesById, fetchStatus, error} = this.props;
    let showTooltip = false;
    let content

    if (this.props.user) {
      showTooltip = !isTooltipComplete(
        TooltipTypes.MY_FEED,
        this.props.user.introTooltips
      )
    }

    if (fetchStatus.fetching || this.state.refreshing) {
      content = (
        <Loader />
      )
    }
    if (error && (!storiesById || !storiesById.length)) {
      content = this._wrapElt(this._showError())
    } else if (!storiesById || !storiesById.length) {
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      content = (
        <StoryList
          style={styles.storyList}
          storiesById={storiesById}
          renderStory={this.renderStory}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      );
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.fakeNavBar}>
          <Image source={Images.whiteLogo} style={styles.logo} />
        </View>
        { content }
        {showTooltip && this.renderTooltip()}
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  let {
    userFeedById,
    fetchStatus,
    entities: stories,
    error
  } = state.entities.stories;
  return {
    userId: state.session.userId,
    user: state.entities.users.entities[state.session.userId],
    fetchStatus,
    storiesById: userFeedById,
    error,
    location: state.routes.scene.name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
