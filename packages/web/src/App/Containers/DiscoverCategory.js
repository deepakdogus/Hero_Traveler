import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StoryActions, { getByCategory, getFetchStatus } from '../Shared/Redux/Entities/Stories'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignupActions from '../Shared/Redux/SignupRedux'

import ContainerWithFeedList from './ContainerWithFeedList'
import CategoryHeader from '../Components/CategoryHeader'
import TabBar from '../Components/TabBar'
import FeedItemList from '../Components/FeedItemList'
import Footer from '../Components/Footer'

import getImageUrl from '../Shared/Lib/getImageUrl'

import { runIfAuthed } from '../Lib/authHelpers'

const tabBarTabs = ['STORIES', 'GUIDES']

const ContentWrapper = styled.div``

const FeedItemListWrapper = styled.div`
  margin: 50px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const SponsoredBy = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin-top: 50px;
  color: #adadad;
`

const StyledImage = styled.img`
  height: 50px;
  margin: 5px;
`

const Divider = styled.hr`
  border-bottom: 2px solid black;
  width: 100%;
  max-width: 960px;
  margin: 0 auto 50px; 
`

class DiscoverCategory extends ContainerWithFeedList {
  static propTypes = {
    users: PropTypes.object,
    categoryId: PropTypes.string,
    category: PropTypes.object,
    loadCategories: PropTypes.func,
    loadCategoryStories: PropTypes.func,
    followCategory: PropTypes.func,
    unfollowCategory: PropTypes.func,
    isFollowingCategory: PropTypes.bool,
  }

  state = { activeTab: 'STORIES' }

  componentDidMount() {
    const {category, loadCategories, getStories, getGuides} = this.props
    this.getTabInfo()
    if (!category) loadCategories()
    getStories(null, 'all')
    getGuides()
  }

  _followCategory = (categoryId) => {
    this.props.followCategory(this.props.sessionUserId, categoryId)
  }

  _unfollowCategory = (categoryId) => {
    this.props.unfollowCategory(this.props.sessionUserId, categoryId)
  }

  render() {
    const {
      category,
      isFollowingCategory,
    } = this.props
    const {selectedFeedItems} = this.getSelectedFeedItems()

    return (
      <ContentWrapper>
        <CategoryHeader
          category={category}
          followCategory={this._followCategory}
          unfollowCategory={this._unfollowCategory}
          isFollowingCategory={isFollowingCategory}
        />
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <SponsoredBy>
          <span>Sponsored by </span>
            <a href={_.get(category, 'sponsorLink')}>
              <StyledImage src={getImageUrl(_.get(category, 'categorySponsorLogo'))} />
            </a>
        </SponsoredBy>
        <FeedItemListWrapper>
          <Divider />
          <FeedItemList
            feedItems={selectedFeedItems}
            activeTab={this.state.activeTab === 'GUIDES' ? 'GUIDES' : 'STORIES'}
          />
          <Footer />
        </FeedItemListWrapper>
      </ContentWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  const sessionUserId = state.session.userId
  let isFollowingCategory = false
  if (state.session.userId) {
    isFollowingCategory = _.includes(state.signup.selectedCategories, categoryId)
  }

  return {
    sessionUserId,
    categoryId,
    category: state.entities.categories.entities[categoryId],
    fetchStatus: getFetchStatus(state.entities.stories, categoryId),
    storiesById: getByCategory(state.entities.stories, categoryId),
    stories: state.entities.stories.entities,
    guides: state.entities.guides.entities,
    guidesById: _.get(state, `entities.guides.guideIdsByCategoryId[${categoryId}]`, []),
    isFollowingCategory,
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const categoryId = ownProps.match.params.categoryId
  return {
    getStories: (_ignore, storyType) => {
      storyType = storyType.toLowerCase()
      if (storyType === 'all') storyType = null
      dispatch(StoryActions.fromCategoryRequest(categoryId, storyType))
    },
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    getGuides: () => dispatch(GuideActions.getCategoryGuides(categoryId)),
    followCategory: (sessionUserId, categoryId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupFollowCategory, [categoryId])),
    unfollowCategory: (sessionUserId, categoryId) =>
      dispatch(runIfAuthed(sessionUserId, SignupActions.signupUnfollowCategory, [categoryId])),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscoverCategory)
