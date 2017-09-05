import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Togglebar from './Togglebar'
import StorySearchResultRow from './StorySearchResultRow'

const togglebarTabs = [
  { text: 'stories', isActive: true },
  { text: 'people', isActive: false },
]

const StyledTogglebar = styled(Togglebar)`
  background-color: ${props => props.theme.Colors.clear}
  margin-bottom: 40px;
`

const Container = styled.div``

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export default class SearchResultsStories extends Component {
  static PropTypes = {
    toggleSearchResultTabs: PropTypes.func,
    storySearchResults: PropTypes.object,
    userSearchResults: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const stories = this.props.storySearchResults;
    const users = this.props.userSearchResults;
    const renderedStories = Object.keys(stories).map((key, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */

      const story = stories[key]
      if (index >= 4) return null
      return (
        <StorySearchResultRow
          story={story}
          image={story.coverImage || story.coverVideo}
          author={users[story.author].username}
          title={story.title}
          key={index}
          index={index}
          margin='0 0 25px'
        />
      )
    })

    return (
      <Container>
        <ContentWrapper>
          <StyledTogglebar 
            tabs={togglebarTabs}
            isClear={true}
            onClick={this.props.toggleSearchResultTabs}
          />
          {renderedStories}
        </ContentWrapper>
      </Container>
    )
  }
}

