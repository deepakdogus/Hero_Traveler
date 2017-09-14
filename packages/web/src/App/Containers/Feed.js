import React, { Component } from 'react'
import styled from 'styled-components'

import StoryList from '../Components/StoryList'
import {feedExample, usersExample} from './Feed_TEST_DATA'
import Footer from '../Components/Footer';


const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const FeedText = styled(CenteredText)`
  font-weight: 400;
  font-size: 23px;
  letter-spacing: 1.5px;
`

const ContentWrapper = styled.div`
  margin: 0 7%;
`

const More = styled(CenteredText)`
  font-size: 15px;
  letter-spacing: 1.2px;
`

class Feed extends Component {
  render() {
    return (
      <ContentWrapper>
        <FeedText>MY FEED</FeedText>
        <StoryList
          stories={feedExample}
          users={usersExample}
        />
        <More>SHOW MORE</More>
        <More>Need downwards black arrow</More>
        <Footer />
      </ContentWrapper>
    )
  }
}

export default Feed
