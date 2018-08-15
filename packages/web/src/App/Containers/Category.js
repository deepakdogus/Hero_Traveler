import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryActions, {getByCategory, getFetchStatus} from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import SignupActions from'../Shared/Redux/SignupRedux'

import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'

const tabBarTabs = ['ALL', 'SEE', 'DO', 'EAT', 'STAY']

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

class Category extends Component {
  static propTypes = {
    stories: PropTypes.object,
    users: PropTypes.object,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    categoryId: PropTypes.string,
    category: PropTypes.object,
    loadCategories: PropTypes.func,
    loadCategoryStories: PropTypes.func,
    followCategory: PropTypes.func,
    unfollowCategory: PropTypes.func,
    isFollowingCategory: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'ALL'
    }
  }

  loadData() {
    const {categoryId, loadCategoryStories, category, loadCategories} = this.props
    let storyType = null
    if (this.state.activeTab !== 'ALL') storyType = this.state.activeTab.toLowerCase()
    loadCategoryStories(categoryId, storyType)
    if (!category) loadCategories()
  }

  componentDidMount() {
    this.loadData()
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab}, () => {
        this.loadData()
      })
    }
  }

  render() {
    const {
      storiesById,
      stories,
      category,
      users,
      followCategory,
      unfollowCategory,
      isFollowingCategory,
    } = this.props
    const categoryStories = storiesById.map((id) => {
      return stories[id]
    })

    return (
      <ContentWrapper>
        <CategoryHeader
          category={category}
          followCategory={followCategory}
          unfollowCategory={unfollowCategory}
          isFollowingCategory={isFollowingCategory}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <StoryListWrapper>
          <StoryList stories={categoryStories} users={users}/>
          <ShowMore/>
          <Footer />
        </StoryListWrapper>
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  let isFollowingCategory = false;
  if (state.session.userId) {
    isFollowingCategory = _.includes(state.signup.selectedCategories, categoryId)
  }

  return {
    categoryId,
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    users: state.entities.users.entities,
    isFollowingCategory,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategoryStories: (categoryId, storyType) => dispatch(StoryActions.fromCategoryRequest(categoryId, storyType)),
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    followCategory: (categoryId) => dispatch(SignupActions.signupFollowCategory(categoryId)),
    unfollowCategory: (categoryId) => dispatch(SignupActions.signupUnfollowCategory(categoryId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)
