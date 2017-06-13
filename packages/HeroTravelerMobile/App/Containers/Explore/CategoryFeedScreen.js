import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {ScrollView, Text, View, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions, {getByCategory, getFetchStatus} from '../../Redux/Entities/Stories'

import ConnectedStoryPreview from '../ConnectedStoryPreview'
import StoryList from '../../Components/StoryList'
import Loader from '../../Components/Loader'

import {Metrics} from '../../Themes'
import styles from '../Styles/CategoryFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight - 50

const Tab = ({text, onPress, selected}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.tab, selected ? styles.tabSelected : null]}>
        <Text style={[styles.tabText, selected ? styles.tabTextSelected : null]}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}


class CategoryFeedScreen extends React.Component {

  static propTypes = {
    categoryId: PropTypes.string,
    user: PropTypes.object,
    storiesById: PropTypes.array,
    fetchStatus: PropTypes.object,
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
    let storyType

    switch (this.state.selectedTabIndex) {
      case 0:
        storyType = null
        break;
      case 1:
        storyType = 'do'
        break;
      case 2:
        storyType = 'eat'
        break;
      case 3:
        storyType = 'stay'
        break;
    }

    this.props.loadCategory(this.props.categoryId, storyType)
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
    }, () => {
      this.loadData()
    })
  }

  _touchUser = (userId) => {
    if (this.props.user.id === userId) {
      NavActions.profile({type: 'jump'})
    } else {
      NavActions.readOnlyProfile({userId})
    }
  }

  render () {
    let { storiesById, fetchStatus, error } = this.props;

    let content;

    if (fetchStatus.fetching && !this.state.refreshing) {
      content = (
        <Loader />
      )
    } else if (error) {
      content = this._wrapElt(<Text style={styles.message}>Error</Text>);
    } else if (_.size(storiesById) === 0) {
      content = <NoStoriesMessage />
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
                onPress={() => NavActions.story({storyId})}
                onPressUser={this._touchUser}
                onPressLike={story => this.props.toggleLike(this.props.user.id, story.id)}
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
  return {
    user: state.entities.users.entities[state.session.userId],
    fetchStatus: getFetchStatus(state.entities.stories, props.categoryId),
    storiesById: getByCategory(state.entities.stories, props.categoryId),
    error: state.entities.stories.error
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadCategory: (categoryId, storyType) => dispatch(StoryActions.fromCategoryRequest(categoryId, storyType)),
    toggleLike: (userId, storyId) => dispatch(StoryActions.storyLike(
      userId,
      storyId
    ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
