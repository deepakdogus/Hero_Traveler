import React, { Component } from 'react'
import styled from 'styled-components'

import StoryList from '../Components/StoryList'
import {feedExample, usersExample} from './Feed_TEST_DATA'
import ContentLayout from '../Components/ContentLayout.component';

const CenteredText = styled.p`
  text-align: center;
`

class Feed extends Component {
  render() {
    return (
      <ContentLayout>
        <CenteredText>MY FEED</CenteredText>
        <StoryList
          stories={feedExample}
          users={usersExample}
        />
      </ContentLayout>
    )
  }
}

export default Feed
