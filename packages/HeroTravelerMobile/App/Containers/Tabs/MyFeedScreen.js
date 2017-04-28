import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Metrics, Images} from '../../Themes'
import isTooltipComplete, {Types as TooltipTypes} from '../../Lib/firstTimeTooltips'
import StoryActions from '../../Redux/Entities/Stories'
import UserActions from '../../Redux/Entities/Users'
import Loader from '../../Components/Loader'
import StoryList from '../../Components/StoryList'
import ConnectedStoryPreview from '../ConnectedStoryPreview'
import RoundedButton from '../../Components/RoundedButton'
import styles from '../Styles/MyFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    stories: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.bool,
  };

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.user.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.refreshing && nextProps.fetchStatus.loaded) {
      this.setState({refreshing: false})
    }
  }

  _wrapElt(elt){
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }

  _showLoader(){
   return (
     <Text style={styles.message}>Loading</Text>
   )
  }

  _showError(){
    return (
      <Text style={styles.message}>Error</Text>
    )
  }

  _showNoStories(){
    return (
      <Text style={styles.title}>There are no stories here</Text>
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

  render () {
    let { storiesById, fetchStatus, error } = this.props;

    const showTooltip = !isTooltipComplete(
      TooltipTypes.MY_FEED,
      this.props.user.introTooltips
    )

    if (fetchStatus.fetching && this.state.refreshing) {
      content = (
        <Loader />
      )
    } else if (error) {
      content = this._wrapElt(this._showError())
    } else if (!storiesById || !storiesById.length) {
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      content = (
        <StoryList
          style={styles.storyList}
          storiesById={storiesById}
          renderStory={(storyId) => {
            return (
              <ConnectedStoryPreview
                key={storyId}
                storyId={storyId}
                height={imageHeight}
                autoPlayVideo={false}
                allowVideoPlay={true}
                onPress={() => NavActions.story({storyId})}
                onPressLike={story => this.props.toggleLike(this.props.user.id, story.id)}
              />
            )
          }}
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
    user: state.entities.users.entities[state.session.userId],
    fetchStatus,
    storiesById: userFeedById,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    toggleLike: (userId, storyId) => dispatch(StoryActions.storyLike(userId, storyId)),
    completeTooltip: (introTooltips) => dispatch(UserActions.updateUser({introTooltips}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
