import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View} from 'react-native'
import { connect } from 'react-redux'
import {Actions as NavActions} from 'react-native-router-flux'

import StoryActions, {getByCategory, getFetchStatus} from '../../Shared/Redux/Entities/Stories'
import SignupActions from '../../Shared/Redux/SignupRedux'

import ConnectedFeedItemPreview from '../ConnectedFeedItemPreview'
import ConnectedFeedList from '../../Containers/ConnectedFeedList'
import Loader from '../../Components/Loader'

import {Metrics} from '../../Shared/Themes'
import styles from '../Styles/CategoryFeedScreenStyles'
import NoStoriesMessage from '../../Components/NoStoriesMessage'
import TabBar from '../../Components/TabBar'
import NavBar from '../CreateStory/NavBar'

const imageHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight - 40

const tabTypes = {
  all: null,
  see: "see",
  do: "do",
  eat: "eat",
  stay: "stay",
  guide: "guide",
}

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
      selectedTabValue: null
    }
  }

  loadData() {
    let storyType = this.state.selectedTabValue
    this.props.loadCategory(this.props.categoryId, storyType)
  }

  componentDidMount() {
    this.loadData()
    this.props.getSelectedCategories()
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

  _changeTab = (selectedTabValue) => {
    this.setState({
      selectedTabValue
    }, () => {
      this.loadData()
    })
  }

  renderStory = (story, index) => {
    return (
      <ConnectedFeedItemPreview
        isFeed={true}
        isStory={true}
        story={story}
        height={imageHeight}
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
    const {categoryId, selectedCategories} = this.props
    return _.includes(selectedCategories, categoryId)
  }

  renderTabs(){
    return (
      <TabBar
        tabs={tabTypes}
        activeTab={this.state.selectedTabValue}
        onClickTab={this._changeTab}
        tabStyle={styles.tabStyle}
      />
    )
  }

  renderNoStories = (content) => {
    return (
      <View style={styles.noStoriesWrapper}>
        {this.renderTabs()}
        {content}
      </View>
    )
  }

  render () {
    let { storiesById, fetchStatus, error, title} = this.props;
    const isFollowingCategory = this.getIsFollowingCategory()

    let topContent, bottomContent

    if (error) {
      topContent = this._wrapElt(<Text style={styles.message}>Unable to find new content. Pull down to refresh.</Text>);
    }

    if (fetchStatus.fetching && !this.state.refreshing) {
      bottomContent = this.renderNoStories(<Loader />);
    } else if (_.size(storiesById) === 0) {
      bottomContent = this.renderNoStories(<NoStoriesMessage />);
    } else {
      bottomContent = (
        <ConnectedFeedList
          isStory={true}
          style={styles.feedList}
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
          leftIcon='arrowLeft'
          leftIconStyle={styles.navbarLeftIconStyle}
          onRight={this._onRight}
          rightTextStyle={styles.navbarRightTextStyle}
          rightTitle={isFollowingCategory ? 'FOLLOWING' : '+ FOLLOW'}
          style={styles.navbarContainer}
        />
        { topContent }
        { bottomContent }
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
    location: state.routes.scene.name
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadCategory: (categoryId, storyType) => dispatch(StoryActions.fromCategoryRequest(categoryId, storyType)),
    getSelectedCategories: () => dispatch(SignupActions.signupGetUsersCategories()),
    followCategory: () => dispatch(SignupActions.signupFollowCategory(ownProps.categoryId)),
    unfollowCategory: () => dispatch(SignupActions.signupUnfollowCategory(ownProps.categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryFeedScreen)
