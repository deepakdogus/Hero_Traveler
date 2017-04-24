import _ from 'lodash'
import React, { PropTypes } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions, {getByCategory, getFetchStatus} from '../../Redux/Entities/Stories'

import ConnectedStoryPreview from '../ConnectedStoryPreview'
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
    storiesById: PropTypes.object,
    fetchStatus: PropTypes.bool,
    error: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTabIndex: 0
    }
  }

  loadData() {
    this.props.loadCategory(this.props.categoryId)
  }

  componentDidMount() {
    this.loadData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.refreshing && nextProps.fetchStatus.loaded) {
      this.setState({refreshing: false})
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true})
    this.loadData()
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

  render () {
    let { storiesById, fetchStatus, error } = this.props;

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

    let content;

    if (fetchStatus.fetching && !this.state.refreshing) {
      content = (
        <Loader />
      )
    } else if (error) {
      content = this._wrapElt(this._showError());
    } else if (!storiesById || !storiesById.length) {
      content = this._wrapElt(this._showNoStories());
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
                onPress={story => {
                  NavActions.story({
                    storyId: story.id
                })}}
                onPressLike={story => this.props.toggleLike(story.id)}
              />
            )
          }}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
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
    entities: stories,
    error
  } = state.entities.stories;
  return {
    user: state.entities.users.entities[state.session.userId],
    fetchStatus: getFetchStatus(stories, props.categoryId),
    storiesById: getByCategory(stories, props.categoryId),
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCategory: (categoryId) => dispatch(StoryActions.fromCategoryRequest(categoryId)),
    toggleLike: (storyId) => dispatch(StoryActions.storyLike(storyId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
