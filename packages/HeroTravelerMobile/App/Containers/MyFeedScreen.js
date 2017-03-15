import React, { PropTypes } from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/MyFeedScreenStyles'

import StoryList from '../Components/StoryList.js'
import StoryActions from '../Redux/StoryRedux.js'

class MyFeedScreen extends React.Component {
  static propTypes = {
    posts: PropTypes.array,
    fetching: PropTypes.bool,
    error: PropTypes.bool
  };

  componentDidMount() {
    this.props.attemptGetUserFeed()
  }

  render () {
    let { posts: stories, fetching, error } = this.props;
    let content;

    console.log("stories", stories);

    if (error){
      content = <Text>Something went wrong ...</Text>
    }

    if (fetching){
      content = <Text>Loading</Text>
    }

    if (!fetching && !error){
      if (!stories || !stories.length) {
        content = <Text style={styles.title}>There are no stories here</Text>
      } else {
        content = <StoryList stories={stories}/>
      }
    }

    return (
      <ScrollView style={styles.containerWithNavbar}>
        { content }
      </ScrollView>
    )
  }
}


const mapStateToProps = (state) => {
  let { fetching, posts, error } = state.feed;
  return {
    fetching, posts, error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptGetUserFeed: () => {
      const userId = "1234"
      return dispatch(StoryActions.feedRequest(userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFeedScreen)
