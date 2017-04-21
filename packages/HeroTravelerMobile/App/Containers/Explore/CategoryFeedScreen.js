import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions, {getByCategory} from '../../Redux/Entities/Stories'

import StoryList from '../../Components/StoryList'
import Loader from '../../Components/Loader'

import {Metrics} from '../../Themes'
import styles from '../Styles/CategoryFeedScreenStyles'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight - 50

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableOpacity style={[styles.tab, selected ? styles.tabSelected : null]} onPress={onPress}>
      <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
    </TouchableOpacity>
  )
}


class CategoryFeedScreen extends React.Component {

  static propTypes = {
    categoryId: PropTypes.string,
    user: PropTypes.object,
    usersById: PropTypes.object,
    stories: PropTypes.array,
    fetching: PropTypes.bool,
    error: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTabIndex: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.refreshing && nextProps.fetchStatus.loaded) {
      this.setState({refreshing: false})
    }
  }

  _wrapElt(elt) {
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>
        {elt}
      </View>
    )
  }

  _changeTab = (selectedTabIndex) => {
    this.setState({
      selectedTabIndex
    })
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

  _onRefresh = () => {
    this.setState({refreshing: true})
    this.props.attemptGetUserFeed(this.props.user.id)
  }

  render () {
    let { stories, fetchStatus, error } = this.props;

    const filterMap = {
      0: true,
      1: 'do',
      2: 'eat',
      3: 'stay'
    }

    const filterByTopic = value => {
      if (this.state.selectedTabIndex === 0 ) return true
      return value.type === filterMap[this.state.selectedTabIndex]
    }

    const storiesAsArray = _.map(stories, s => {
      return {
        ...s,
        author: this.props.usersById[s.author]
      }
    }).filter(filterByTopic)

    let content;

    if (fetchStatus.fetching && !this.state.refreshing) {
      content = (
        <Loader />
      )
    } else if (error) {
      content = this._wrapElt(this._showError());
    } else if (!storiesAsArray || !storiesAsArray.length) {
      content = this._wrapElt(this._showNoStories());
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
      )
    }

    return (
      <View style={[styles.containerWithNavbarAndTabbar, styles.root]}>
          <View style={styles.tabs}>
            <View style={styles.tabnav}>
              <Tab
                selected={this.state.selectedTabIndex === 0}
                onPress={() => this._changeTab(0)}
                text='ALL'
              />
              <Tab
                selected={this.state.selectedTabIndex === 1}
                onPress={() => this._changeTab(1)}
                text='DO'
              />
              <Tab
                selected={this.state.selectedTabIndex === 2}
                onPress={() => this._changeTab(2)}
                text='EAT'
              />
              <Tab
                selected={this.state.selectedTabIndex === 3}
                onPress={() => this._changeTab(3)}
                text='STAY'
              />
            </View>
          </View>
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
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
    toggleLike: (storyId) => dispatch(StoryActions.storyLike(storyId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
