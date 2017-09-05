import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import CategoryHeader from '../Components/CategoryHeader'
import Togglebar from '../Components/Togglebar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'

const toggleBarTabs = [
  { text: 'all', isActive: false },
  { text: 'do', isActive: false },
  { text: 'eat', isActive: true },
  { text: 'stay', isActive: false },
]

const ContentWrapper = styled.div``

const StoryListWrapper = styled.div`
  margin: 50px 7% 0;
`

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const More = styled(CenteredText)`
  font-size: 15px;
  letter-spacing: 1.2px;
`

class Category extends Component {
  render() {

    const user = usersExample['590b9b0a4990800011537924']
    const usersStories = Object.keys(feedExample).reduce((matchingStories, key) => {
      const story = feedExample[key]
      if (story.author === user.id) matchingStories[key] = story;
      return matchingStories
    }, {})
    return (
      <ContentWrapper>
        <CategoryHeader/>
        <Togglebar tabs={toggleBarTabs}/>
        <StoryListWrapper>
          <StoryList stories={usersStories} users={usersExample}/>
          <More>SHOW MORE</More>
          <More>Need downwards black arrow</More>
          <Footer />
        </StoryListWrapper>     
      </ContentWrapper>
    )
  }
}

export default Category
