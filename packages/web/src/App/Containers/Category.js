import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import CategoryHeader from '../Components/CategoryHeader'
import Togglebar from '../Components/Togglebar'
import StoryList from '../Components/StoryList'
import Footer from '../Components/Footer'
import Icon from '../Components/Icon'

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
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.theme.Colors.background};
  font-size: 15px;
  letter-spacing: 1.2px;
  margin: 100px 0 8px 0;
`

const IconContainer = styled.div`
  text-align: center;
  margin-bottom: 220px;
`

const StyledIcon = styled(Icon)`
  text-align: center;
  height: 24px;
  width: 12px;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg); 
  transform: rotate(90deg);
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
          <IconContainer>
            <StyledIcon 
              name='arrowRightRed'
              size='mediumSmall'
            />            
          </IconContainer>
          <Footer />
        </StoryListWrapper>     
      </ContentWrapper>
    )
  }
}

export default Category
