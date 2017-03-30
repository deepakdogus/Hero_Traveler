import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import {Metrics} from '../../Themes'
import StoryActions from '../../Redux/Entities/Stories'
import StoryList from '../../Components/StoryList'
import styles from '../Styles/MyFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    stories: PropTypes.object,
    fetching: PropTypes.bool,
    error: PropTypes.bool
  };

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.user.id)
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

  render () {
    let { stories, fetchStatus, error } = this.props;
    const storiesAsArray = _.map(stories, s => {
      return {
        ...s,
        author: this.props.usersById[s.author]
      }
    })
    let content;

    if (fetchStatus.fetching || error) {
      let innerContent = fetchStatus.fetching ? this._showLoader() : this._showError()
      content = this._wrapElt(innerContent);
    } else if (!storiesAsArray || !storiesAsArray.length) {
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      content = (
        <StoryList
          style={styles.storyList}
          stories={storiesAsArray}
          height={imageHeight}
          onPressStory={story => NavActions.story()}
          onPressLike={story => alert(`Story ${story.id} liked`)}
        />
      );
    }

    return (
      <View style={[styles.containerWithNavbarAndTabbar, styles.root]}>
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
    attemptGetUserFeed: (userId) => {
      return dispatch(StoryActions.feedRequest(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
