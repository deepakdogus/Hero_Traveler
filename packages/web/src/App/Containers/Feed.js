import React, { Component } from 'react'
import styled from 'styled-components'

import StoryList from '../Components/StoryList'
import {feedExample, usersExample} from './Feed_TEST_DATA'
import Footer from '../Components/Footer';

const CenteredText = styled.p`
  text-align: center;
`

const ContentWrapper = styled.div`
  margin: 0 7%;
`

class Feed extends Component {
  render() {
    return (
      <ContentWrapper>
        <CenteredText>MY FEED</CenteredText>
        <StoryList
          stories={feedExample}
          users={usersExample}
        />
        <Footer />
      </ContentWrapper>
    )
  }
}

export default Feed
