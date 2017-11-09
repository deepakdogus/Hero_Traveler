import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import StoryList from '../Components/StoryList'
import FeedHeader from '../Components/FeedHeader'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'
import StoryActions from '../Shared/Redux/Entities/Stories'

const CenteredText = styled.p`
  text-align: center;
`

const FeedText = styled(CenteredText)`
  color: ${props => props.theme.Colors.background}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 23px;
  letter-spacing: 1.5px;
  padding: 50px 0 0 0;
`

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
`

class Feed extends Component {

  componentDidMount() {
    this.props.attemptGetUserFeed(this.props.userId)
  }

  render() {
    const {stories, users, storiesById} = this.props
    const feedStories = storiesById.map((id) => {
      return stories[id]
    })
    return (
      <Wrapper>
        <FeedHeader stories={feedStories} users={users}/>
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StoryList
            stories={feedStories}
            users={users}
          />
          <ShowMore/>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}


function mapStateToProps(state, ownProps) {
  let { userFeedById, entities: stories } = state.entities.stories
  return {
    userId: state.session.userId,
    storiesById: userFeedById,
    stories,
    users: state.entities.users.entities,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptGetUserFeed: (userId) => dispatch(StoryActions.feedRequest(userId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
