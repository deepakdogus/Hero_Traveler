import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import StorySelectRow, {DefaultContainer} from './StorySelectRow'

const Container = styled.div``

const StyledContainer = styled(DefaultContainer)`
  border-width: ${props => props.index !== 0 ? '2px 0 0' : '0'};
  padding: 10px 0px 6px;
`

export default class SearchResultsStories extends Component {
  static PropTypes = {
    storySearchResults: PropTypes.object,
    // userSearchResults: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const stories = this.props.storySearchResults.hits ? this.props.storySearchResults.hits : [];
    // const users = this.props.userSearchResults;

    /*
      We only need the first 4 elements for suggestions
      We will improve this check to allow 'pagination' will carousel scroll
    */

    const renderedStories = stories.map((story, index) => {
      if(story.coverVideo) return null
      return (
        <StorySelectRow 
          story={story}
          username={story.author}
          key={index}
          index={index}
          ReplacementContainer={StyledContainer}
        />
      )
    })

    return (
      <Container>
        {renderedStories}
      </Container>
    )
  }
}

