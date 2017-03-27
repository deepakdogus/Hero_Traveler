import React, { PropTypes } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../../Redux/StoryRedux.js'
import StoryList from '../../Components/StoryList'
import {Metrics} from '../../Themes'
import styles from '../Styles/CategoryFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class CategoryFeedScreen extends React.Component {
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
          onPressStory={story => NavActions.story()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
