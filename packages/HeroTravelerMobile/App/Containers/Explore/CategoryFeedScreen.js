import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavActions } from 'react-native-router-flux'

import StoryActions, {
  getByCategory,
  getFetchStatus,
} from '../../Shared/Redux/Entities/Stories'
import SignupActions from '../../Shared/Redux/SignupRedux'

import ConnectedStoryPreview from '../ConnectedStoryPreview'
import StoryList from '../../Containers/ConnectedStoryList'
import Loader from '../../Components/Loader'
import Tabs from '../../Components/Tabs'
import Tab from '../../Components/Tab'

import { Metrics } from '../../Shared/Themes'
import styles from '../Styles/CategoryFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import NavBar from '../CreateStory/NavBar'

const imageHeight =
  Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight - 40

class CategoryFeedScreen extends React.Component {
  static propTypes = {
    categoryId: PropTypes.string,
    user: PropTypes.object,
    storiesById: PropTypes.array,
    fetchStatus: PropTypes.object,
    error: PropTypes.object,
    title: PropTypes.string,
    loadCategory: PropTypes.func,
    getSelectedCategories: PropTypes.func,
    unfollowCategory: PropTypes.func,
    followCategory: PropTypes.func,
    selectedCategories: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      selectedTabIndex: 0,
    }
  }

  loadData() {
    let storyType

    switch (this.state.selectedTabIndex) {
      case 0:
        storyType = null
        break
      case 1:
        storyType = 'see'
        break
      case 2:
        storyType = 'do'
        break
      case 3:
        storyType = 'eat'
        break
      case 4:
        storyType = 'stay'
        break
      case 5:
        storyType = 'guides'
        break
    }

    this.props.loadCategory(this.props.categoryId, storyType)
  }

  componentDidMount() {
    this.loadData()
    this.props.getSelectedCategories()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.refreshing && nextProps.fetchStatus.loaded) {
      this.setState({ refreshing: false })
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadData()
  }

  _wrapElt(elt) {
    return (
      <View style={[styles.scrollItemFullScreen, styles.center]}>{elt}</View>
    )
  }

  _changeTab = selectedTabIndex => {
    this.setState(
      {
        selectedTabIndex,
      },
      () => {
        this.loadData()
      }
    )
  }

  _touchUser = userId => {
    if (this.props.user.id === userId) {
      NavActions.profile({ type: 'jump' })
    } else {
      NavActions.readOnlyProfile({ userId })
    }
  }

  renderStory = (story, index) => {
    return (
      <ConnectedStoryPreview
        isFeed={true}
        story={story}
        height={imageHeight}
        onPressUser={this._touchUser}
        userId={this.props.user.id}
        autoPlayVideo
        allowVideoPlay
        renderLocation={this.props.location}
        index={index}
        showPlayButton={true}
      />
    )
  }

  _onLeft = () => NavActions.pop()

  _onRight = () => {
    const shouldUnfollow = this.getIsFollowingCategory()
    if (shouldUnfollow) this.props.unfollowCategory()
    else this.props.followCategory()
  }

  getIsFollowingCategory = () => {
    const { categoryId, selectedCategories } = this.props
    return _.includes(selectedCategories, categoryId)
  }

  renderTabs() {
    return (
      <Tabs>
        <Tab
          selected={this.state.selectedTabIndex === 0}
          onPress={() => this._changeTab(0)}
          text="ALL"
        />
        <Tab
          selected={this.state.selectedTabIndex === 1}
          onPress={() => this._changeTab(1)}
          text="SEE"
        />
        <Tab
          selected={this.state.selectedTabIndex === 2}
          onPress={() => this._changeTab(2)}
          text="DO"
        />
        <Tab
          selected={this.state.selectedTabIndex === 3}
          onPress={() => this._changeTab(3)}
          text="EAT"
        />
        <Tab
          selected={this.state.selectedTabIndex === 4}
          onPress={() => this._changeTab(4)}
          text="STAY"
        />
        <Tab
          selected={this.state.selectedTabIndex === 5}
          onPress={() => this._changeTab(5)}
          text="GUIDES"
        />
      </Tabs>
    )
  }

  render() {
    let { storiesById, fetchStatus, error, title } = this.props
    const isFollowingCategory = this.getIsFollowingCategory()

    let topContent, bottomContent

    if (fetchStatus.fetching && !this.state.refreshing) {
      topContent = <Loader />
    } else if (error) {
      topContent = this._wrapElt(
        <Text style={styles.message}>
          Unable to find new content. Pull down to refresh.
        </Text>
      )
    }
    if (_.size(storiesById) === 0) {
      bottomContent = (
        <View style={styles.noStoriesWrapper}>
          {this.renderTabs()}
          <NoStoriesMessage />
        </View>
      )
    } else {
      bottomContent = (
        <StoryList
          style={styles.storyList}
          storiesById={storiesById}
          renderSectionHeader={this.renderTabs()}
          renderStory={this.renderStory}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />
      )
    }

    return (
      <View style={[styles.containerWithTabbar, styles.root]}>
        <NavBar
          title={title}
          titleStyle={styles.navbarTitleStyle}
          onLeft={this._onLeft}
          leftIcon="arrowLeft"
          leftIconStyle={styles.navbarLeftIconStyle}
          onRight={this._onRight}
          rightTextStyle={styles.navbarRightTextStyle}
          rightTitle={isFollowingCategory ? 'FOLLOWING' : '+ FOLLOW'}
          style={(styles.navbarContainer, { marginTop: 0 })}
        />
        {topContent}
        {bottomContent}
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.entities.users.entities[state.session.userId],
    fetchStatus: getFetchStatus(state.entities.stories, props.categoryId),
    storiesById: getByCategory(state.entities.stories, props.categoryId),
    error: state.entities.stories.error,
    selectedCategories: state.signup.selectedCategories,
    location: state.routes.scene.name,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadCategory: (categoryId, storyType) =>
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType)),
    getSelectedCategories: () =>
      dispatch(SignupActions.signupGetUsersCategories()),
    followCategory: () =>
      dispatch(SignupActions.signupFollowCategory(ownProps.categoryId)),
    unfollowCategory: () =>
      dispatch(SignupActions.signupUnfollowCategory(ownProps.categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
