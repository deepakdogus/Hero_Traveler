import React, { PropTypes } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from '../Styles/MyFeedScreenStyles'
import StoryActions from '../../Redux/StoryRedux.js'

// import ErrorScreen
import StoryList from '../../Components/StoryList'

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
      content = (<StoryList stories={stories}/>);
    }

    return (
      <ScrollView style={styles.scrollContainer}>
        { content }
      </ScrollView>
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
