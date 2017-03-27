import React, { PropTypes } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions from '../Redux/StoryRedux.js'
import StoryList from '../Components/StoryList'
import RoundedButton from '../Components/RoundedButton'
import {Metrics} from '../Themes'
import styles from './Styles/StoryReadingScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class StoryReadingScreen extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    stories: PropTypes.array,
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
    let { stories, fetching, error } = this.props;

    let story = stories[0]

    return (
      <View style={[styles.containerWithNavbarAndTabbar, styles.root]}>
        <RoundedButton onPress={() => NavActions.storyComments()}>
          Comments
        </RoundedButton>
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    user: state.session.user,
    fetching,
    stories: posts,
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

export default connect(mapStateToProps, mapDispatchToProps)(StoryReadingScreen)
