import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {feedExample} from './Feed_TEST_DATA'
import StoryActions from '../Shared/Redux/Entities/Stories'

import Header from '../Components/Header'
import StoryHeader from '../Components/StoryHeader'
import StoryContentRenderer from '../Components/StoryContentRenderer'
import GMap from '../Components/GoogleMap'
import StoryMetaInfo from '../Components/StoryMetaInfo'
import StoryActionBar from '../Components/StoryActionBar'
import StorySuggestions from '../Components/StorySuggestions'


const ContentWrapper = styled.div``

const LimitedWidthContainer = styled.div`
  width: 66%;
  max-width: 900px;
  margin: 0 auto;
`

const GreyWrapper = styled.div`
  background-color: ${props => props.theme.Colors.dividerGrey};
`

class Story extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.object,
    getStory: PropTypes.func,
    match: PropTypes.object,
  }

  componentWillMount() {
    if (!this.props.story) {
      this.props.getStory(this.props.match.params.storyId)
    }
  }

  render() {
    const {story, author} = this.props
    if (!story || !author) return null

    return (
      <ContentWrapper>
        <Header isLoggedIn></Header>
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

function mapStateToProps(state, ownProps) {
  const storyId = ownProps.match.params.storyId
  const story = state.entities.stories.entities[storyId]
  const author = story ? state.entities.users.entities[story.author] : undefined
  return {
    story,
    author,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStory: (storyId, tokens) => dispatch(StoryActions.storyRequest(storyId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Story)
