import React, { PropTypes } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'

// Styles

import {Metrics} from '../../Themes'
import StoryActions from '../../Redux/StoryRedux.js'
import StoryList from '../../Components/StoryList'
import styles from '../Styles/MyFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class MyFeedScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    posts: PropTypes.array,
    fetching: PropTypes.bool,
    error: PropTypes.bool
  };

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.user._id)
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
    let { posts: stories, fetching, error } = this.props;
    let content;

    if (fetching || error){
      let innerContent = fetching ? this._showLoader() : this._showError()
      content = this._wrapElt(innerContent);
    } else if (!stories || !stories.length) {
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      content = (
        <StoryList
          style={styles.storyList}
          stories={stories}
          height={imageHeight}
          onPressStory={story => alert(`Story ${story._id} pressed`)}
          onPressLike={story => alert(`Story ${story._id} liked`)}
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
  let { fetching, posts, error } = state.feed;
  return {
    user: state.session.user,
    fetching,
    posts,
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
