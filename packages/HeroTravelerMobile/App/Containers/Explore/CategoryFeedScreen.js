import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import {getByCategory} from '../../Redux/Entities/Stories'

import StoryList from '../../Components/StoryList'

import {Metrics} from '../../Themes'
import styles from '../Styles/CategoryFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight


class CategoryFeedScreen extends React.Component {

  static propTypes = {
    categoryId: PropTypes.string,
    user: PropTypes.object,
    usersById: PropTypes.object,
    stories: PropTypes.array,
    fetching: PropTypes.bool,
    error: PropTypes.bool
  }

  _wrapElt(elt) {
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

  _showNoStories() {
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
      console.log('1');
      let innerContent = fetchStatus.fetching ? this._showLoader() : this._showError()
      content = this._wrapElt(innerContent);
    } else if (!storiesAsArray || !storiesAsArray.length) {
      console.log('2');
      let innerContent = this._showNoStories();
      content = this._wrapElt(innerContent);
    } else {
      console.log('3');
      content = (
        <StoryList
          style={styles.storyList}
          stories={storiesAsArray}
          height={imageHeight}
          onPressStory={story => NavActions.story({storyId: story.id})}
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


const mapStateToProps = (state, props) => {
  let {
    fetchStatus,
    entities: stories,
    error
  } = state.entities.stories;
  return {
    user: state.session.user,
    usersById: state.entities.users.entities,
    fetchStatus,
    stories: getByCategory(stories, props.categoryId),
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
