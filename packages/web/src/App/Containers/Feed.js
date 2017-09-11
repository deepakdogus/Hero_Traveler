import React, { Component } from 'react'
import styled from 'styled-components'

import StoryList from '../Components/StoryList'
import FeedHeader from '../Components/FeedHeader'
import {feedExample, usersExample} from './Feed_TEST_DATA'
import Footer from '../Components/Footer'
import Icon from '../Components/Icon'


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

class Feed extends Component {
  render() {
    const user = usersExample['590b9b0a4990800011537924']
    const usersStories = Object.keys(feedExample).reduce((matchingStories, key) => {
      const story = feedExample[key]
      if (story.author === user.id) matchingStories[key] = story;
      return matchingStories
    }, {})
    return (
      <Wrapper>
        <FeedHeader stories={usersStories} author={user}/>      
        <ContentWrapper>
          <FeedText>MY FEED</FeedText>
          <StoryList
            stories={feedExample}
            users={usersExample}
          />
          <More>SHOW MORE</More>
          <IconContainer>
            <StyledIcon 
              name='arrowRightRed'
              size='mediumSmall'
            />            
          </IconContainer>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

export default Feed
