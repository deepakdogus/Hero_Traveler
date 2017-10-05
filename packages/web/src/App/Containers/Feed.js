import React, { Component } from 'react'
import styled from 'styled-components'

import StoryList from '../Components/StoryList'
import FeedHeader from '../Components/FeedHeader'
import {feedExample, usersExample} from './Feed_TEST_DATA'
import Footer from '../Components/Footer'
import ShowMore from '../Components/ShowMore'

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
  render() {
    const usersStories = Object.keys(feedExample).reduce((matchingStories, key) => {
      const story = feedExample[key]
      matchingStories[key] = story;
      return matchingStories
    }, {})
    return (
      <Wrapper>
        <FeedHeader stories={usersStories} users={usersExample}/>
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StoryList
            stories={feedExample}
            users={usersExample}
          />
          <ShowMore/>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default Feed
