import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import {Metrics, Images} from '../../Themes'
import StoryActions from '../../Redux/Entities/Stories'
import Loader from '../../Components/Loader'
import StoryList from '../../Components/StoryList'
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

  render () {
    let { stories, fetchStatus, error } = this.props;
    const storiesAsArray = _.map(stories, s => {
      return {
        ...s,
        author: this.props.usersById[s.author]
      }
    })
    let content;

    if (fetchStatus.fetching && this.state.refreshing) {
      content = (
        <Loader />
      )
    } else if (error) {
      content = this._wrapElt(this._showError())
    } else if (!storiesAsArray || !storiesAsArray.length) {
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      content = (
        <StoryList
          style={styles.storyList}
          stories={storiesAsArray}
          height={imageHeight}
          onPressStory={story => NavActions.story({
            storyId: story.id
          })}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          onPressLike={story => this.props.toggleLike(story.id)}
        />
      );
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <View style={styles.fakeNavBar}>
          <Image source={Images.whiteLogo} style={styles.logo} />
        </View>
        { content }
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  let {
    fetchStatus,
    entities: stories,
    error
  } = state.entities.stories;
  return {
    user: state.session.user,
    usersById: state.entities.users.entities,
    fetchStatus,
    stories,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    toggleLike: (storyId) => dispatch(StoryActions.storyLike(storyId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
