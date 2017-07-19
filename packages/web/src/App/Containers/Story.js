import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import StoryHeader from '../Components/StoryHeader'
import StoryBody from '../Components/StoryBody'

const ContentWrapper = styled.div``
const Suggestions = styled.div``

const story = feedExample['596775b90d4bb70010e2a5f8']
const author = usersExample[story.author]

class Story extends Component {
  render() {
    return (
      <ContentWrapper>
        <StoryHeader story={story} author={author}/>
        <StoryBody story={story} author={author}/>
        <Suggestions />
      </ContentWrapper>
    )
  }
}

export default Story
