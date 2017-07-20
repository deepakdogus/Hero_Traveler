import React, { Component } from 'react'
import styled from 'styled-components'

import {feedExample, usersExample} from './Feed_TEST_DATA'
import StoryHeader from '../Components/StoryHeader'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GMap from '../Components/GoogleMap'
import StoryMetaInfo from '../Components/StoryMetaInfo'
import StoryActionBar from '../Components/StoryActionBar'
import StorySuggestions from '../Components/StorySuggestions'


const ContentWrapper = styled.div`
  margin: 0;
  padding: 0 auto;
`

const LimitedWidthContainer = styled.div`
  width: 66%;
  max-width: 900px;
  margin: 0 auto;
`

const GreyWrapper = styled.div`
  background-color: ${props => props.theme.Colors.dividerGrey};
`

class Story extends Component {
  render() {
    const {match} = this.props
    const story = feedExample[match.params.storyId]
    const author = usersExample[story.author]
    return (
      <ContentWrapper>
        <StoryHeader story={story} author={author}/>
        <LimitedWidthContainer>
          <StoryContentRenderer story={story} />
        </LimitedWidthContainer>
        <p style={{paddingLeft: '10px'}}>Are they trying to do fixed map and/or hidden buttons on the map?</p>
        {story.latitude && story.longitude &&
          <GMap
            lat={story.latitude}
            lng={story.longitude}
            location={story.location}
          />
        }
        <LimitedWidthContainer>
          <StoryMetaInfo story={story}/>
          <StoryActionBar story={story}/>
        </LimitedWidthContainer>
        <GreyWrapper>
          <LimitedWidthContainer>
            <StorySuggestions suggestedStories={feedExample}/>
          </LimitedWidthContainer>
        </GreyWrapper>
      </ContentWrapper>
    )
  }
}

export default Story
