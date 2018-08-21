import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import FeedItemList from '../Components/FeedItemList'
import FeedHeader from '../Components/FeedHeader'
import StoryActions from '../Shared/Redux/Entities/Stories'
import GuideActions from '../Shared/Redux/Entities/Guides'
import SignUpActions from '../Shared/Redux/SignupRedux'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'
import HorizontalDivider from '../Components/HorizontalDivider'
import TabBar from '../Components/TabBar'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 1.5px;
  padding: 30px 0 0 0;
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
`

const StyledDivider = styled(HorizontalDivider)`
  border-color: ${props => props.theme.Colors.background};
  border-width: 1px;
  margin-bottom: 23px;
`

const tabBarTabs = ['STORIES', 'GUIDES']

class Feed extends Component {
  static propTypes = {
    userId: PropTypes.string,
    storiesById: PropTypes.arrayOf(PropTypes.string),
    stories: PropTypes.objectOf(PropTypes.object),
    users: PropTypes.objectOf(PropTypes.object),
    attemptGetUserFeedStories: PropTypes.func,
    signedUp: PropTypes.bool,
  }

  state = { activeTab: tabBarTabs[0]}

  componentDidMount(){
    //get user feed on signUp and reset signUp redux
    if (this.props.signedUp) {
      this.props.attemptGetUserFeedStories(this.props.userId)
      this.props.signupReset()
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab }, () => {
        this.getTabInfo(tab)
      })
    }
  }

  getTabInfo = (tab) => {
    switch (tab) {
      case 'GUIDES':
        return this.props.attemptGetUserFeedGuides(this.props.userId)
      case 'STORIES':
      default:
        return this.props.attemptGetUserFeedStories(this.props.userId)
    }
  }

  getFeedItemsByIds(idList, type = 'stories') {
    return idList.map(id => {
      return this.props[type][id]
    })
  }

  getSelectedFeedItems = () => {
    const {
      userStoriesFetchStatus, storiesById,
      draftsFetchStatus, draftsById,
      userBookmarksFetchStatus, userBookmarksById,
      guidesFetchStatus, feedGuidesById
    } = this.props

    // will use fetchStatus to show loading/error
    switch(this.state.activeTab){
      case 'DRAFTS':
        return {
          fetchStatus: draftsFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(draftsById),
        }
      case 'BOOKMARKS':
        return {
          fetchStatus: userBookmarksFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(userBookmarksById),
        }
      case 'GUIDES':
        return {
          fetchStatus: guidesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(feedGuidesById, 'guides')
        }
      case 'STORIES':
      default:
        return {
          fetchStatus: userStoriesFetchStatus,
          selectedFeedItems: this.getFeedItemsByIds(storiesById),
        }
    }
  }

  render() {
    const {
      users,
      stories,
      storiesById,
    } = this.props
    const feedStories = storiesById.map((id) => {
      return stories[id]
    })

    const {selectedFeedItems} = this.getSelectedFeedItems()

    return (
      <Wrapper>
        <FeedHeader stories={feedStories} users={users}/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StyledDivider />
          <FeedItemList feedItems={selectedFeedItems}/>
          <ShowMore/>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  let { userFeedById, entities: stories } = state.entities.stories
  const guides = state.entities.guides.entities
  const feedGuidesById = state.entities.guides.feedGuidesById || []

  return {
    userId: state.session.userId,
    storiesById: userFeedById,
    feedGuidesById,
    stories,
    guides,
    users: state.entities.users.entities,
    signedUp: state.signup.signedUp,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptGetUserFeedStories: (userId) => dispatch(StoryActions.feedRequest(userId)),
    attemptGetUserFeedGuides: (userId) => dispatch(GuideActions.guideFeedRequest(userId)),
    signupReset: () => dispatch(SignUpActions.signupReset())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
